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

fs.writeFileSync('index.html', html);
