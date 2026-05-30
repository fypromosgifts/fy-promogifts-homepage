const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const description = 'FY PromoGifts provides custom promotional gifts, gift sets, OEM and ODM branding solutions for events, corporate buyers and global distributors.';
const meta = `
<link rel="canonical" href="https://www.fypromogifts.com/"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="https://www.fypromogifts.com/"/>
<meta property="og:title" content="FY PromoGifts - Custom Promotional Gifts & Gift Sets"/>
<meta property="og:description" content="${description}"/>
<meta property="og:image" content="https://www.fypromogifts.com/assets/image-01.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="FY PromoGifts - Custom Promotional Gifts & Gift Sets"/>
<meta name="twitter:description" content="${description}"/>
<meta name="twitter:image" content="https://www.fypromogifts.com/assets/image-01.png"/>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FY PromoGifts",
  "url": "https://www.fypromogifts.com/",
  "email": "sira@fypromogifts.com",
  "description": "${description}",
  "sameAs": ["https://wa.me/8615869117529"]
}
</script>`;

if (!html.includes('rel="canonical"')) {
  html = html.replace(
    /<meta content="FY PromoGifts provides custom promotional gifts, gift sets, OEM and ODM branding solutions for events, corporate buyers and global distributors\." name="description"\/>/,
    `<meta content="${description}" name="description"/>${meta}`
  );
}

if (!html.includes('href="/kit-builder/"')) {
  html = html.replace(
    '<a href="#home">Home</a><a href="#use-cases">Use Cases</a><a href="#customization">What We Do</a><a href="#products">Products</a><a href="#projects">Real Projects</a><a href="#contact">Contact</a>',
    '<a href="#home">Home</a><a href="/kit-builder/">Kit Builder</a><a href="/custom-products/">Single Products</a><a href="#use-cases">Use Cases</a><a href="#customization">What We Do</a><a href="#products">Products</a><a href="#projects">Real Projects</a><a href="#contact">Contact</a>'
  );
  html = html.replace(
    '<div class="hero-ctas"><a class="btn btn-gold" href="#contact">Start Your Gift Project</a><a class="btn btn-outline" href="https://wa.me/8615869117529" rel="noopener" target="_blank">Chat on WhatsApp</a></div>',
    '<div class="hero-ctas"><a class="btn btn-gold" href="/kit-builder/">Build Kit Online</a><a class="btn btn-outline" href="/custom-products/">Browse Products</a><a class="btn btn-outline" href="https://wa.me/8615869117529" rel="noopener" target="_blank">Chat on WhatsApp</a></div>'
  );
}

fs.writeFileSync('index.html', html);
