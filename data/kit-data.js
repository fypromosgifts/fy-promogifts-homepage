window.FY_KIT_DATA = {
  questions: [
    {
      id: "useCase",
      kicker: "Use case",
      title: "Who is this kit for?",
      options: [
        { value: "employees", label: "Employees", note: "Onboarding, internal teams" },
        { value: "clients", label: "Clients", note: "Appreciation, retention" },
        { value: "events", label: "Event guests", note: "Trade shows, conferences" },
        { value: "holiday", label: "Holiday recipients", note: "Seasonal gifting" },
        { value: "campaign", label: "Brand campaign", note: "Launches, activations" }
      ]
    },
    {
      id: "style",
      kicker: "Style",
      title: "What should it feel like?",
      options: [
        { value: "executive", label: "Executive / Business", note: "Polished, premium, composed" },
        { value: "modern", label: "Modern / Minimal", note: "Clean, simple, brand-neutral" },
        { value: "natural", label: "Natural / Eco", note: "Organic, kraft, soft neutrals" },
        { value: "warm", label: "Warm / Lifestyle", note: "Personal, cozy, giftable" },
        { value: "bold", label: "Bold / Event", note: "Visible, colorful, campaign-ready" }
      ]
    },
    {
      id: "budget",
      kicker: "Budget",
      title: "What budget direction?",
      options: [
        { value: "starter", label: "Starter", note: "Simple, useful, efficient" },
        { value: "standard", label: "Standard", note: "Balanced and polished" },
        { value: "premium", label: "Premium", note: "Higher perceived value" },
        { value: "vip", label: "VIP", note: "Executive-level presentation" }
      ]
    },
    {
      id: "color",
      kicker: "Color",
      title: "Any color direction in mind?",
      options: [
        { value: "no-preference", label: "No preference", note: "Recommend the best fit" },
        { value: "brand-color", label: "Match my brand colors", note: "Logo-color ready" },
        { value: "neutral-clean", label: "Neutral and clean", note: "Black, white, gray" },
        { value: "natural-soft", label: "Natural and soft", note: "Ivory, kraft, sage" },
        { value: "bold-campaign", label: "Bold campaign colors", note: "High-visibility palette" }
      ]
    }
  ],
  kits: [
    {
      id: "employee-welcome-modern",
      name: "Employee Welcome Kit",
      reason: "Best for polished onboarding that feels useful from day one.",
      tags: ["employees", "modern", "standard", "premium", "neutral-clean", "brand-color"],
      items: ["Notebook", "Travel tumbler", "Canvas tote", "Metal pen", "Tech pouch"],
      packaging: "Soft mailer box",
      visual: "one"
    },
    {
      id: "client-appreciation-executive",
      name: "Client Appreciation Kit",
      reason: "Best for thank-you gifts where perceived value matters.",
      tags: ["clients", "executive", "premium", "vip", "neutral-clean", "brand-color"],
      items: ["Ceramic mug", "Tumbler", "Notebook", "Pen", "Tech organizer"],
      packaging: "Magnetic gift box",
      visual: "two"
    },
    {
      id: "trade-show-bold",
      name: "Trade Show Kit",
      reason: "Best for booth visibility, giveaways and brand recall.",
      tags: ["events", "campaign", "bold", "starter", "standard", "bold-campaign", "brand-color"],
      items: ["Bottle", "Tote", "Lanyard", "Sticker sheet", "Keychain"],
      packaging: "Tote-as-packaging",
      visual: "three"
    },
    {
      id: "holiday-lifestyle",
      name: "Holiday Gift Set",
      reason: "Best for warm seasonal gifting without feeling generic.",
      tags: ["holiday", "warm", "premium", "natural-soft", "no-preference"],
      items: ["Mug", "Blanket", "Candle", "Greeting card", "Gift box"],
      packaging: "Rigid gift box",
      visual: "two"
    },
    {
      id: "eco-welcome",
      name: "Natural Welcome Kit",
      reason: "Best for teams that prefer soft, sustainable materials.",
      tags: ["employees", "natural", "standard", "natural-soft", "brand-color"],
      items: ["Kraft notebook", "Cotton tote", "Wood pen", "Pouch", "Bottle"],
      packaging: "Kraft eco box",
      visual: "one"
    },
    {
      id: "launch-campaign",
      name: "Brand Launch Kit",
      reason: "Best when the kit needs to follow a strong campaign color.",
      tags: ["campaign", "events", "bold", "standard", "premium", "bold-campaign", "brand-color"],
      items: ["Tote", "Cap", "Bottle", "Sticker sheet", "Keychain"],
      packaging: "Printed mailer box",
      visual: "three"
    },
    {
      id: "vip-executive",
      name: "VIP Executive Kit",
      reason: "Best for high-touch clients and executive-level presentation.",
      tags: ["clients", "executive", "vip", "premium", "neutral-clean", "brand-color"],
      items: ["Premium tumbler", "Leather-look notebook", "Metal pen", "Tech pouch", "Card"],
      packaging: "Magnetic gift box",
      visual: "two"
    },
    {
      id: "minimal-saas",
      name: "Modern Desk Kit",
      reason: "Best for tech, SaaS and modern service brands.",
      tags: ["clients", "employees", "modern", "standard", "premium", "neutral-clean", "brand-color"],
      items: ["Notebook", "Desk memo set", "Pen", "Tumbler", "Cable pouch"],
      packaging: "Minimal mailer box",
      visual: "one"
    }
  ]
};
