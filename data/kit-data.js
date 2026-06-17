window.FY_KIT_DATA = {
  questions: [
    {
      id: "useCase",
      kicker: "Use case",
      title: "What occasion are you sourcing for?",
      options: [
        { value: "employee-onboarding", label: "Employee onboarding", note: "Welcome kits for new hires and internal teams" },
        { value: "client-appreciation", label: "Client appreciation", note: "Premium thank-you gifts and VIP programs" },
        { value: "trade-show-event", label: "Trade show or event", note: "Booth-ready kits for expos, conferences and live events" },
        { value: "brand-campaign", label: "Brand campaign", note: "Color-matched merch for launches and activations" },
        { value: "holiday-gifts", label: "Holiday gifting", note: "Warm seasonal kits for employees and clients" },
        { value: "wedding-party", label: "Wedding or party", note: "Personalized favors for private events" }
      ]
    },
    {
      id: "color",
      kicker: "Color story",
      title: "Which color direction fits your brand?",
      options: [
        { value: "match-scene", label: "Recommend by use case", note: "Use the best starter palette for this occasion" },
        { value: "black-gold", label: "Black & Gold", note: "Executive, premium, high perceived value" },
        { value: "navy-silver", label: "Navy & Silver", note: "Professional, modern, tech or finance friendly" },
        { value: "sage-kraft", label: "Sage & Kraft", note: "Natural, eco-aware, soft and practical" },
        { value: "teal-coral", label: "Teal & Coral", note: "Campaign-ready, bright and memorable" },
        { value: "ivory-champagne", label: "Ivory & Champagne", note: "Warm, celebratory and giftable" }
      ]
    },
    {
      id: "budget",
      kicker: "Budget",
      title: "Which budget direction should we quote around?",
      options: [
        { value: "starter", label: "Starter", note: "Efficient product mix and simple packaging" },
        { value: "standard", label: "Standard", note: "Balanced value, packaging and brand visibility" },
        { value: "premium", label: "Premium", note: "Giftable presentation and stronger perceived value" },
        { value: "vip", label: "VIP", note: "Higher-end presentation for selected recipients" }
      ]
    },
    {
      id: "quantity",
      kicker: "Quantity",
      title: "What order size are you planning?",
      options: [
        { value: "small-batch", label: "50-150 sets", note: "VIP lists, samples or smaller teams" },
        { value: "mid-batch", label: "150-500 sets", note: "Most corporate gift projects" },
        { value: "event-bulk", label: "500-2,000 pcs", note: "Events, trade shows and campaigns" },
        { value: "not-sure", label: "Not sure yet", note: "We can suggest MOQ by product mix" }
      ]
    }
  ],
  kits: [
    {
      id: "employee-onboarding-kits",
      name: "Employee Onboarding Kits",
      shortName: "Onboarding Kit",
      reason: "Warm welcome kits for new hires, internal teams and HR programs.",
      tags: ["employee-onboarding", "sage-kraft", "starter", "standard", "mid-batch", "small-batch"],
      heroImage: "../assets/kit-studio-final/employee-onboarding-kits-confirmed.jpg",
      visuals: {
        "match-scene": "../assets/kit-studio-final/employee-onboarding-kits-confirmed.jpg",
        "navy-silver": "../assets/kit-studio-usecase-baselines/employee-onboarding-kits-navy-silver.jpg",
        "sage-kraft": "../assets/kit-studio-usecase-baselines/employee-onboarding-kits-sage-kraft.jpg",
        "teal-coral": "../assets/kit-studio-usecase-baselines/employee-onboarding-kits-teal-coral.jpg",
        default: "../assets/kit-studio-final/employee-onboarding-kits-confirmed.jpg"
      },
      imageAlt: "Employee onboarding kit with backpack tote tumbler notebook cap and welcome card",
      logoAreas: ["Backpack front", "Tote panel", "Tumbler body", "Notebook cover", "Welcome card"],
      products: [
        { name: "PU Leather Notebook", image: "../assets/curated-products/D5-pu-leather-notebook.png" },
        { name: "Stainless Coffee Tumbler", image: "../assets/curated-products/A15-stainless-coffee-tumbler.png" },
        { name: "Metal Pen", image: "../assets/curated-products/B24-metal-pen.png" },
        { name: "MagSafe Card Wallet", image: "../assets/curated-products/D32-magsafe-card-wallet.png" }
      ],
      items: ["Backpack or tote", "Reusable tumbler", "Notebook", "Metal pen", "Welcome card"],
      moq: "100-500 sets",
      budget: "Starter to Premium",
      logoMethods: "Screen print, UV print, embroidery, laser engraving, debossing",
      packaging: "Kraft mailer, cotton tote, paper sleeve or welcome box",
      sampleTime: "5-8 days after artwork confirmation",
      productionTime: "10-18 days after sample approval",
      note: "Best for HR buyers who want useful onboarding gifts employees will keep.",
      visual: "two"
    },
    {
      id: "client-appreciation-gifts",
      name: "Client Appreciation Gifts",
      shortName: "Client Gift",
      reason: "Premium-looking gift sets for client thank-yous, VIP programs and year-end gifting.",
      tags: ["client-appreciation", "black-gold", "premium", "vip", "small-batch", "mid-batch"],
      heroImage: "../assets/kit-studio-final/client-appreciation-gifts-confirmed.jpg",
      visuals: {
        "match-scene": "../assets/kit-studio-final/client-appreciation-gifts-confirmed.jpg",
        "black-gold": "../assets/kit-studio-usecase-baselines/client-appreciation-gifts-black-gold.jpg",
        "navy-silver": "../assets/kit-studio-usecase-baselines/client-appreciation-gifts-navy-silver.jpg",
        "sage-kraft": "../assets/kit-studio-usecase-baselines/client-appreciation-gifts-sage-kraft.jpg",
        default: "../assets/kit-studio-final/client-appreciation-gifts-confirmed.jpg"
      },
      imageAlt: "Black and gold client appreciation gift set with tumbler mug glass notebook umbrella and keychain",
      logoAreas: ["Tumbler body", "Mug print area", "Notebook cover", "Keychain plate", "Gift card"],
      products: [
        { name: "Thank You Corporate Gift Kit", image: "../assets/curated-products/A6-thank-you-corporate-gift-kit.png" },
        { name: "Ceramic Mug Gift Set", image: "../assets/curated-products/A16-ceramic-mug-gift-set.png" },
        { name: "Whiskey Glass Gift Box", image: "../assets/curated-products/A19-whiskey-glass-gift-box.png" },
        { name: "Metal Leather Keychain", image: "../assets/curated-products/D4-metal-leather-keychain.png" }
      ],
      items: ["Tumbler", "Mug or glass", "Notebook", "Business accessory", "Rigid gift box"],
      moq: "100-300 sets depending on product mix",
      budget: "Standard to VIP",
      logoMethods: "UV print, screen print, laser engraving, debossing, card printing",
      packaging: "Rigid gift box, magnetic box, paper sleeve or custom insert card",
      sampleTime: "5-7 days after logo and item mix are confirmed",
      productionTime: "12-20 days after sample approval",
      note: "Use this when perceived value and presentation matter more than the lowest unit price.",
      visual: "one"
    },
    {
      id: "trade-show-event-kits",
      name: "Trade Show & Event Kits",
      shortName: "Event Kit",
      reason: "Booth-ready giveaway sets for expos, conferences, concerts and live events.",
      tags: ["trade-show-event", "teal-coral", "event-bulk", "starter", "standard"],
      heroImage: "../assets/kit-studio-final/trade-show-event-kits-confirmed.jpg",
      visuals: {
        "match-scene": "../assets/kit-studio-final/trade-show-event-kits-confirmed.jpg",
        "navy-silver": "../assets/kit-studio-usecase-baselines/trade-show-event-kits-navy-silver.jpg",
        "sage-kraft": "../assets/kit-studio-usecase-baselines/trade-show-event-kits-sage-kraft.jpg",
        "teal-coral": "../assets/kit-studio-usecase-baselines/trade-show-event-kits-teal-coral.jpg",
        default: "../assets/kit-studio-final/trade-show-event-kits-confirmed.jpg"
      },
      imageAlt: "Trade show event kit with tote drawstring bag bottle wristbands pen and event card",
      logoAreas: ["Tote panel", "Bottle body", "Drawstring bag", "Wristband surface", "Event card"],
      products: [
        { name: "Flight Tag Keychains", image: "../assets/curated-products/C34-flight-tag-keychains.png" },
        { name: "Silicone Wristbands", image: "../assets/curated-products/C19-silicone-wristbands.png" },
        { name: "Event Wristbands", image: "../assets/curated-products/D17-event-wristbands.png" },
        { name: "Metal Pen", image: "../assets/curated-products/B24-metal-pen.png" }
      ],
      items: ["Tote bag", "Drawstring bag", "Bottle", "Wristbands", "Pen", "Event card"],
      moq: "500-2,000 pcs depending on item",
      budget: "Starter to Standard",
      logoMethods: "Screen print, heat transfer, woven label, UV print, full-color card printing",
      packaging: "Bulk carton, individual polybag, tote-as-packaging or event-ready packs",
      sampleTime: "5-7 days for most custom event items",
      productionTime: "10-20 days after approval",
      note: "Best for high-visibility items that are easy to distribute at event booths.",
      visual: "three"
    },
    {
      id: "brand-campaign-giveaways",
      name: "Brand Campaign Giveaways",
      shortName: "Campaign Kit",
      reason: "Color-matched merch collections for launches, activations and social campaigns.",
      tags: ["brand-campaign", "navy-silver", "standard", "premium", "mid-batch", "event-bulk"],
      heroImage: "../assets/kit-studio-final/brand-campaign-giveaways-confirmed.jpg",
      visuals: {
        "match-scene": "../assets/kit-studio-final/brand-campaign-giveaways-confirmed.jpg",
        "black-gold": "../assets/kit-studio-usecase-baselines/brand-campaign-giveaways-black-gold.jpg",
        "navy-silver": "../assets/kit-studio-usecase-baselines/brand-campaign-giveaways-navy-silver.jpg",
        "teal-coral": "../assets/kit-studio-usecase-baselines/brand-campaign-giveaways-teal-coral.jpg",
        default: "../assets/kit-studio-final/brand-campaign-giveaways-confirmed.jpg"
      },
      imageAlt: "Brand campaign giveaway kit with apparel tote bottle mug cap and color cards",
      logoAreas: ["Apparel chest", "Cap front", "Tote panel", "Bottle body", "Mug print area"],
      products: [
        { name: "Sports Water Bottle", image: "../assets/curated-products/A17-sports-water-bottle.png" },
        { name: "Sublimation Mugs", image: "../assets/curated-products/D11-sublimation-mugs.png" },
        { name: "Metal Luggage Tags", image: "../assets/curated-products/C37-metal-luggage-tags.png" },
        { name: "Marble Metal Pen", image: "../assets/curated-products/C23-marble-metal-pen.png" }
      ],
      items: ["Apparel or cap", "Tote bag", "Bottle", "Mug", "Keychain or tag", "Color card"],
      moq: "300-1,000 pcs depending on product and print method",
      budget: "Standard to Premium",
      logoMethods: "Screen print, embroidery, heat transfer, sublimation, UV print, laser engraving",
      packaging: "Color-matched mailer, paper sleeve, tote-as-packaging or campaign carton",
      sampleTime: "5-8 days after artwork confirmation",
      productionTime: "10-18 days after sample approval",
      note: "Best when the brand color story is part of the campaign impact.",
      visual: "three"
    },
    {
      id: "christmas-holiday-gift-sets",
      name: "Christmas & Holiday Gift Sets",
      shortName: "Holiday Kit",
      reason: "Warm seasonal kits for employees, clients and year-end appreciation.",
      tags: ["holiday-gifts", "ivory-champagne", "premium", "standard", "small-batch", "mid-batch"],
      heroImage: "../assets/kit-studio-final/christmas-holiday-gift-sets-confirmed.jpg",
      visuals: {
        "match-scene": "../assets/kit-studio-final/christmas-holiday-gift-sets-confirmed.jpg",
        "black-gold": "../assets/kit-studio-usecase-baselines/christmas-holiday-gift-sets-black-gold.jpg",
        "sage-kraft": "../assets/kit-studio-usecase-baselines/christmas-holiday-gift-sets-sage-kraft.jpg",
        "ivory-champagne": "../assets/kit-studio-usecase-baselines/christmas-holiday-gift-sets-ivory-champagne.jpg",
        default: "../assets/kit-studio-final/christmas-holiday-gift-sets-confirmed.jpg"
      },
      imageAlt: "Holiday corporate gift set with blanket mug tumbler candle socks gift bag and card",
      logoAreas: ["Mug print area", "Tumbler body", "Gift bag", "Greeting card", "Box sleeve"],
      products: [
        { name: "Silk Sleep Care Set", image: "../assets/curated-products/A3-silk-sleep-care-set.png" },
        { name: "Colored Sleep Mask", image: "../assets/curated-products/D29-colored-sleep-mask.png" },
        { name: "Cork Base Ceramic Mug", image: "../assets/curated-products/B20-cork-base-ceramic-mug.png" },
        { name: "Transparent Gift Bag Packaging", image: "../assets/curated-products/A12-transparent-gift-bag-packaging.png" }
      ],
      items: ["Blanket or textile", "Mug", "Tumbler", "Candle or seasonal item", "Gift bag", "Greeting card"],
      moq: "100-300 sets",
      budget: "Standard to Premium",
      logoMethods: "Embroidery, woven label, UV print, screen print, card printing",
      packaging: "Gift bag, rigid box, tissue wrap, kraft insert or custom printed card",
      sampleTime: "6-9 days after artwork and packaging are confirmed",
      productionTime: "12-22 days after sample approval",
      note: "A warmer route for employee appreciation and seasonal client gifts.",
      visual: "two"
    },
    {
      id: "wedding-party-favors",
      name: "Wedding & Party Favors",
      shortName: "Party Favors",
      reason: "Personalized favors for weddings, birthdays, private parties and special events.",
      tags: ["wedding-party", "ivory-champagne", "standard", "premium", "small-batch", "mid-batch"],
      heroImage: "../assets/kit-studio-final/wedding-party-favors-confirmed.jpg",
      visuals: {
        "match-scene": "../assets/kit-studio-final/wedding-party-favors-confirmed.jpg",
        "sage-kraft": "../assets/kit-studio-usecase-baselines/wedding-party-favors-sage-kraft.jpg",
        "teal-coral": "../assets/kit-studio-usecase-baselines/wedding-party-favors-teal-coral.jpg",
        "ivory-champagne": "../assets/kit-studio-usecase-baselines/wedding-party-favors-ivory-blush.jpg",
        default: "../assets/kit-studio-final/wedding-party-favors-confirmed.jpg"
      },
      imageAlt: "Wedding party favor gift box with mug glass candle towel thank-you card and small soap box",
      logoAreas: ["Mug print area", "Glass cup", "Candle label", "Thank-you card", "Gift box lid"],
      products: [
        { name: "Glass Jar Mug", image: "../assets/curated-products/C44-glass-jar-mug.png" },
        { name: "Floral Ceramic Mugs", image: "../assets/curated-products/C4-floral-ceramic-mugs.png" },
        { name: "Transparent Gift Bag Packaging", image: "../assets/curated-products/A12-transparent-gift-bag-packaging.png" },
        { name: "Acrylic Bookmark", image: "../assets/curated-products/D33-acrylic-bookmark.png" }
      ],
      items: ["Small mug", "Glass cup", "Candle", "Soft towel", "Thank-you card", "Gift box"],
      moq: "100-500 sets depending on favor type",
      budget: "Standard to Premium",
      logoMethods: "UV print, screen print, label printing, card printing, laser engraving",
      packaging: "Rigid favor box, paper sleeve, transparent bag or personalized card",
      sampleTime: "5-8 days after artwork confirmation",
      productionTime: "10-18 days after sample approval",
      note: "Best for event planners who want cohesive favors with personalized packaging.",
      visual: "two"
    }
  ]
};
