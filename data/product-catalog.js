window.FY_CATALOG = {
  products: [
    { id: "ceramic-mug", name: "Ceramic Campfire Mug", category: "Drinkware", image: "/assets/image-11.jpg", colors: ["#f7f2e9", "#1f2937", "#b7c4b2", "#d88b45"], moq: "100 pcs", methods: "Pad print, decal, gift box", fit: "Client gifts, onboarding kits, event giveaways" },
    { id: "stainless-tumbler", name: "Stainless Travel Tumbler", category: "Drinkware", image: "/assets/image-12.jpg", colors: ["#111827", "#d9c7a3", "#e5e7eb", "#355070"], moq: "100 pcs", methods: "Laser engraving, UV print", fit: "Premium client kits, employee welcome sets" },
    { id: "soft-touch-bottle", name: "Soft Touch Water Bottle", category: "Drinkware", image: "/assets/image-13.jpg", colors: ["#0f172a", "#f8fafc", "#8aa29e", "#c2410c"], moq: "200 pcs", methods: "Silk screen, UV print", fit: "Trade shows, sports campaigns, campus events" },
    { id: "canvas-tote", name: "Heavy Canvas Tote", category: "Bags", image: "/assets/image-14.jpg", colors: ["#f3ead7", "#111827", "#475569", "#9a3412"], moq: "100 pcs", methods: "Screen print, embroidery, woven label", fit: "Event kits, retail-style gift bundles" },
    { id: "drawstring-bag", name: "Cotton Drawstring Pouch", category: "Bags", image: "/assets/image-15.jpg", colors: ["#efe7da", "#1f2937", "#7c2d12", "#6b7280"], moq: "300 pcs", methods: "Screen print, heat transfer", fit: "Packaging insert, small accessory kits" },
    { id: "tech-pouch", name: "Tech Organizer Pouch", category: "Bags", image: "/assets/image-16.jpg", colors: ["#111827", "#374151", "#d6d3d1", "#1e3a8a"], moq: "100 pcs", methods: "Embroidery, leather patch, heat transfer", fit: "Executive kits, travel kits, remote work kits" },
    { id: "notebook", name: "Hardcover Notebook", category: "Stationery", image: "/assets/image-17.jpg", colors: ["#111827", "#d6c7ae", "#7f1d1d", "#365314"], moq: "100 pcs", methods: "Foil stamp, deboss, UV print", fit: "Onboarding, conferences, sales kits" },
    { id: "metal-pen", name: "Metal Signature Pen", category: "Stationery", image: "/assets/image-18.jpg", colors: ["#111827", "#d6ad60", "#e5e7eb", "#0f766e"], moq: "300 pcs", methods: "Laser engraving, pad print", fit: "Notebook sets, executive boxes" },
    { id: "sticky-note-set", name: "Desk Memo Set", category: "Stationery", image: "/assets/image-19.jpg", colors: ["#f5f0e8", "#cbd5e1", "#fef3c7", "#d1fae5"], moq: "200 pcs", methods: "Full color print, belly band", fit: "Office kits, training kits, welcome packs" },
    { id: "cotton-cap", name: "Cotton Dad Cap", category: "Apparel", image: "/assets/image-20.jpg", colors: ["#111827", "#f5f0e8", "#4b5563", "#1d4ed8"], moq: "100 pcs", methods: "Embroidery, woven patch", fit: "Brand campaigns, outdoor events" },
    { id: "polo-shirt", name: "Performance Polo", category: "Apparel", image: "/assets/image-21.jpg", colors: ["#111827", "#ffffff", "#1e3a8a", "#475569"], moq: "100 pcs", methods: "Embroidery, heat transfer", fit: "Staff uniforms, trade show teams" },
    { id: "lanyard", name: "Event Lanyard", category: "Event Items", image: "/assets/image-22.jpg", colors: ["#111827", "#2563eb", "#dc2626", "#f97316"], moq: "500 pcs", methods: "Dye sublimation, woven logo", fit: "Conferences, concerts, badge kits" },
    { id: "keychain", name: "Soft PVC Keychain", category: "Event Items", image: "/assets/image-23.jpg", colors: ["#111827", "#2563eb", "#16a34a", "#f59e0b"], moq: "300 pcs", methods: "Molded PVC, metal charm", fit: "Giveaways, launch campaigns, merch drops" },
    { id: "sticker-sheet", name: "Custom Sticker Sheet", category: "Event Items", image: "/assets/image-24.jpg", colors: ["#ffffff", "#fef3c7", "#dbeafe", "#fee2e2"], moq: "300 pcs", methods: "Die cut, kiss cut, holographic finish", fit: "Brand campaigns, social kits, events" }
  ],
  packaging: [
    { id: "mailer-box", name: "Printed Mailer Box", image: "/assets/image-02.png", note: "Best for direct-to-recipient onboarding and event kits." },
    { id: "magnetic-box", name: "Magnetic Gift Box", image: "/assets/image-03.png", note: "Premium feel for VIP clients and executive programs." },
    { id: "kraft-box", name: "Kraft Eco Box", image: "/assets/image-04.png", note: "Natural and sustainable look for wellness or lifestyle kits." },
    { id: "tote-pack", name: "Tote-As-Packaging", image: "/assets/image-05.png", note: "Useful packaging that becomes part of the gift." }
  ],
  kitTemplates: [
    { id: "onboarding", name: "Employee Welcome Kit", products: ["notebook", "metal-pen", "stainless-tumbler", "canvas-tote"], packaging: "mailer-box" },
    { id: "client-premium", name: "Client Appreciation Kit", products: ["ceramic-mug", "tech-pouch", "notebook", "metal-pen"], packaging: "magnetic-box" },
    { id: "trade-show", name: "Trade Show Booth Kit", products: ["lanyard", "soft-touch-bottle", "sticker-sheet", "canvas-tote"], packaging: "tote-pack" },
    { id: "brand-campaign", name: "Brand Campaign Set", products: ["cotton-cap", "keychain", "sticker-sheet", "drawstring-bag"], packaging: "kraft-box" }
  ]
};
