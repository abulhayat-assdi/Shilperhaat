"use client";

import { useState } from "react";

interface ProductTabsProps {
  description?: string;
  tags?: string[];
  reviewCount?: number;
}

export default function ProductTabs({ description, tags, reviewCount = 0 }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  return (
    <div style={{ marginTop: 40 }}>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "2px solid #eee" }}>
        {(["description", "reviews"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const label =
            tab === "description"
              ? "Description"
              : `Customer Reviews (${reviewCount})`;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#800000" : "#666",
                marginBottom: -2,
                background: "none",
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 3,
                borderBottomStyle: "solid",
                borderBottomColor: isActive ? "#800000" : "transparent",
                cursor: "pointer",
                fontFamily: "'Open Sans', sans-serif",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #eee",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          padding: 24,
        }}
      >
        {activeTab === "description" && (
          <div>
            {/* "Product Details" heading with orange underline */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: 16, fontWeight: 600, color: "#222",
                  fontFamily: "'Open Sans', sans-serif",
                  paddingBottom: 8,
                  display: "inline-block",
                }}
              >
                Product Details
              </h3>
              <div style={{ height: 3, width: 48, backgroundColor: "#800000", borderRadius: 2, marginTop: -4 }} />
            </div>

            {description ? (
              <div
                className="prose-description"
                style={{
                  fontSize: 14, lineHeight: 1.8, color: "#444",
                  fontFamily: "'Open Sans', sans-serif",
                }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p style={{ color: "#aaa", fontSize: 14 }}>No description available.</p>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#222", marginBottom: 10, fontFamily: "'Open Sans',sans-serif" }}>
                  Tags
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tags.map((tag) => (
                    <a
                      key={tag}
                      href={`/shop?search=${encodeURIComponent(tag)}`}
                      style={{
                        fontSize: 12, padding: "4px 12px",
                        backgroundColor: "#FFF0F0", color: "#800000",
                        borderRadius: 4, textDecoration: "none",
                        fontFamily: "'Open Sans',sans-serif", fontWeight: 500,
                        border: "1px solid #f5d0d0",
                        transition: "background-color 0.2s, color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#800000";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#FFF0F0";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#800000";
                      }}
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: "#222", marginBottom: 8, fontFamily: "'Open Sans',sans-serif" }}>
              No Reviews Yet
            </h4>
            <p style={{ color: "#888", fontSize: 14, fontFamily: "'Open Sans',sans-serif" }}>
              Be the first to review this product.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
