export interface PageContent {
  id: string
  slug: string
  title: string
  subtitle: string
  section1: string
  section2: string
  metaTitle: string
  metaDescription: string
  isPublished: boolean
  updatedAt: string
}

export const pagesData: PageContent[] = [
  {
    id: '1', slug: 'about', title: 'About Us',
    subtitle: 'Our story and mission',
    section1: '<h2>Who We Are</h2><p>Shilperhaat is Bangladesh\'s premier handcraft textile marketplace, dedicated to preserving and promoting traditional Bengali craftsmanship. We connect skilled artisans directly with customers who value authentic, hand-crafted textiles.</p>',
    section2: '<h2>Our Mission</h2><p>Our mission is to bring Bangladesh\'s rich textile heritage to every home. We work with master artisans across the country to offer premium quality Katha, Chadar, Nakshi Katha, Blankets, and Muslin products.</p>',
    metaTitle: 'About Us - Shilperhaat', metaDescription: 'Learn about Shilperhaat',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '2', slug: 'faq', title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions',
    section1: '<h2>Ordering & Payment</h2><p><strong>Q: How do I place an order?</strong><br/>A: Browse our products, add to cart, and complete checkout. You can also order via WhatsApp.</p><p><strong>Q: What payment methods do you accept?</strong><br/>A: We accept Cash on Delivery, bKash, Nagad, and bank transfer.</p>',
    section2: '<h2>Shipping & Returns</h2><p><strong>Q: How long does delivery take?</strong><br/>A: 3-5 business days within Dhaka, 5-7 days outside Dhaka.</p><p><strong>Q: What is your return policy?</strong><br/>A: We accept returns within 7 days of delivery for unused items.</p>',
    metaTitle: 'FAQ - Shilperhaat', metaDescription: 'Frequently asked questions',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '3', slug: 'contact', title: 'Contact Us',
    subtitle: 'We would love to hear from you',
    section1: '<h2>Get In Touch</h2><p>📞 Phone: 01700000000</p><p>✉️ Email: info@shilperhaat.com</p><p>📍 Address: Dhaka, Bangladesh</p><p>🕐 Hours: Monday - Saturday, 10AM - 8PM</p>',
    section2: '<h2>Order via WhatsApp</h2><p>For quick orders and inquiries, message us on WhatsApp at +880-1700-000000. Our team responds within 30 minutes during business hours.</p>',
    metaTitle: 'Contact Us - Shilperhaat', metaDescription: 'Contact Shilperhaat',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '4', slug: 'privacy-policy', title: 'Privacy Policy',
    subtitle: 'How we collect and use your information',
    section1: '<h2>Information We Collect</h2><p>We collect information you provide when placing orders including name, phone number, email address, and delivery address. We also collect browsing data to improve our website.</p>',
    section2: '<h2>How We Use Your Information</h2><p>Your information is used only to process orders and improve our services. We never sell your personal data to third parties. Your data is stored securely and protected.</p>',
    metaTitle: 'Privacy Policy - Shilperhaat', metaDescription: 'Privacy policy',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '5', slug: 'terms-of-use', title: 'Terms of Use',
    subtitle: 'Terms and conditions for using Shilperhaat',
    section1: '<h2>Terms & Conditions</h2><p>By using Shilperhaat, you agree to these terms. All products are handmade and may have slight variations from images shown. Prices are in Bangladeshi Taka (৳).</p>',
    section2: '<h2>User Responsibilities</h2><p>Users must provide accurate delivery information. Shilperhaat is not responsible for delays caused by incorrect addresses. All disputes are subject to Bangladesh law.</p>',
    metaTitle: 'Terms of Use - Shilperhaat', metaDescription: 'Terms of use',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '6', slug: 'refund-policy', title: 'Refund Policy',
    subtitle: 'Our refund and exchange policy',
    section1: '<h2>Return & Refund Policy</h2><p>We accept returns within 7 days of delivery. Items must be unused and in original condition. To initiate a return, contact us via WhatsApp or email with your order number and reason.</p>',
    section2: '<h2>Refund Process</h2><p>Approved refunds are processed within 3-5 business days. Refunds are issued via the original payment method. Delivery charges are non-refundable unless the item was defective.</p>',
    metaTitle: 'Refund Policy - Shilperhaat', metaDescription: 'Refund policy',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '7', slug: 'delivery-policy', title: 'Delivery Policy',
    subtitle: 'Shipping and delivery information',
    section1: '<h2>Delivery Areas & Times</h2><p>We deliver across Bangladesh. Dhaka city: 2-3 business days. Outside Dhaka: 4-6 business days. We use trusted courier partners for all deliveries.</p>',
    section2: '<h2>Delivery Charges</h2><p>Free delivery on orders above ৳1,500. Below ৳1,500: ৳60 inside Dhaka, ৳120 outside Dhaka. Express delivery available on request for additional charge.</p>',
    metaTitle: 'Delivery Policy - Shilperhaat', metaDescription: 'Delivery policy',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '8', slug: 'shipping-info', title: 'Shipping Info',
    subtitle: 'Everything about our shipping process',
    section1: '<h2>How We Ship</h2><p>All orders are carefully packed to protect products during transit. We use Sundarban Courier, Pathao, and Redx for reliable delivery across Bangladesh.</p>',
    section2: '<h2>Tracking Your Order</h2><p>After shipment, you will receive a tracking number via SMS and email. Use this to track your order on the courier\'s website. Contact us if you face any issues.</p>',
    metaTitle: 'Shipping Info - Shilperhaat', metaDescription: 'Shipping information',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '9', slug: 'support', title: 'Support Center',
    subtitle: 'We are here to help you',
    section1: '<h2>How Can We Help?</h2><p>Our support team is available Monday to Saturday, 10AM to 8PM. Reach us via phone, WhatsApp, or email. Average response time is under 1 hour during business hours.</p>',
    section2: '<h2>Support Channels</h2><p>📞 Call: 01700000000<br/>💬 WhatsApp: +880-1700-000000<br/>✉️ Email: support@shilperhaat.com<br/>For urgent issues, WhatsApp is the fastest way to reach us.</p>',
    metaTitle: 'Support - Shilperhaat', metaDescription: 'Customer support',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '10', slug: 'how-to-order', title: 'How to Order',
    subtitle: 'Simple steps to place your order',
    section1: '<h2>Online Ordering Steps</h2><p><strong>Step 1:</strong> Browse products and select what you like.<br/><strong>Step 2:</strong> Click "Add to Cart" or "Buy Now".<br/><strong>Step 3:</strong> Enter your delivery address and phone number.<br/><strong>Step 4:</strong> Select Cash on Delivery or online payment.<br/><strong>Step 5:</strong> Confirm your order. Done!</p>',
    section2: '<h2>Order via WhatsApp</h2><p>Prefer to order by phone? Simply send us a WhatsApp message with the product name and your delivery address. Our team will confirm your order and arrange delivery.</p>',
    metaTitle: 'How to Order - Shilperhaat', metaDescription: 'How to order',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '11', slug: 'track-order', title: 'Track Your Order',
    subtitle: 'Check the status of your order',
    section1: '<h2>Track Your Order</h2><p>Enter your order number or phone number below to check your order status. You can also contact us directly via WhatsApp at +880-1700-000000 for order updates.</p>',
    section2: '<h2>Order Status Guide</h2><p><strong>Processing:</strong> Order received and being prepared.<br/><strong>Shipped:</strong> Order handed to courier.<br/><strong>Out for Delivery:</strong> Order is on its way.<br/><strong>Delivered:</strong> Order successfully delivered.</p>',
    metaTitle: 'Track Order - Shilperhaat', metaDescription: 'Track your order',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '12', slug: 'blog', title: 'Blog',
    subtitle: 'Stories, tips and news from Shilperhaat',
    section1: '<h2>Latest Articles</h2><p>Our blog is coming soon. We will share stories about our artisans, textile traditions, and tips for caring for your handcraft products.</p>',
    section2: '',
    metaTitle: 'Blog - Shilperhaat', metaDescription: 'Shilperhaat blog',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '13', slug: 'careers', title: 'Careers',
    subtitle: 'Join the Shilperhaat team',
    section1: '<h2>Work With Us</h2><p>We are always looking for passionate people who believe in preserving Bangladesh\'s craft heritage. If you are interested in joining our team, send your CV to careers@shilperhaat.com.</p>',
    section2: '<h2>Current Openings</h2><p>No current openings. Check back soon or send us your profile for future opportunities.</p>',
    metaTitle: 'Careers - Shilperhaat', metaDescription: 'Career opportunities',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '14', slug: 'press', title: 'Press',
    subtitle: 'Media resources and press releases',
    section1: '<h2>Press & Media</h2><p>For media inquiries, interviews, or press resources, contact our team at press@shilperhaat.com. We are happy to share our story about promoting Bangladeshi handcraft traditions.</p>',
    section2: '',
    metaTitle: 'Press - Shilperhaat', metaDescription: 'Press and media',
    isPublished: true, updatedAt: new Date().toISOString()
  },
  {
    id: '15', slug: 'account', title: 'My Account',
    subtitle: 'Manage your account',
    section1: '',
    section2: '',
    metaTitle: 'My Account - Shilperhaat', metaDescription: 'My account',
    isPublished: true, updatedAt: new Date().toISOString()
  }
]

export function getPage(slug: string): PageContent | null {
  return pagesData.find(p => p.slug === slug) || null
}

export function getAllPages(): PageContent[] {
  return pagesData
}

export function updatePage(slug: string, data: Partial<PageContent>): boolean {
  const index = pagesData.findIndex(p => p.slug === slug)
  if (index === -1) return false
  pagesData[index] = { ...pagesData[index], ...data, updatedAt: new Date().toISOString() }
  return true
}
