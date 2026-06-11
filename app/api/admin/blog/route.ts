import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeBlogPost, generateSlug, estimateReadTime } from "@/lib/blog-data";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
    return NextResponse.json({ posts: posts.map(serializeBlogPost) });
  } catch (error) {
    console.error("GET /api/admin/blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

    const content = String(body.content || "");
    let slug = String(body.slug || "").trim() || generateSlug(title);

    // Ensure the slug is unique
    const taken = await prisma.blogPost.findUnique({ where: { slug } });
    if (taken) {
      let counter = 2;
      while (await prisma.blogPost.findUnique({ where: { slug: `${slug}-${counter}` } })) counter++;
      slug = `${slug}-${counter}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt: String(body.excerpt || ""),
        content,
        coverImage: String(body.coverImage || ""),
        author: String(body.author || ""),
        category: String(body.category || ""),
        tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
        isPublished: !!body.isPublished,
        readTime: Number(body.readTime) || estimateReadTime(content),
      },
    });
    return NextResponse.json({ post: serializeBlogPost(post) });
  } catch (error) {
    console.error("POST /api/admin/blog error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
