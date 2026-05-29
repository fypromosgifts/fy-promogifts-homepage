# AGENTS.md — FY PromoGifts Homepage

Context file for AI agents. Read this before making any changes to the project.

---

## Project Overview

Single-page static inquiry landing page for **FY PromoGifts** (fypromogifts.com).  
Target audience: overseas ad agencies and event planning companies.  
Goal: capture B2B inquiries (name, email, WhatsApp, company, quantity, products).

**Stack:** Pure HTML + CSS + vanilla JS. No build tools, no frameworks, no dependencies.

---

## Repository Structure

```
/
├── index.html          # The entire site — all CSS, JS, and HTML in one file
├── image-01.png        # Hero product shot
├── image-02.png        # Use case: Employee Onboarding Kits
├── image-03.png        # Use case: Client Appreciation Gifts
├── image-04.png        # Use case: Trade Show & Event Kits
├── image-05.png        # Use case: Brand Campaign Giveaways
├── image-06.png        # Use case: Christmas & Holiday Gift Sets
├── image-07.png        # Use case: Wedding & Party Favors
├── image-08.jpg        # Custom logo printing methods
├── image-09.png        # DIY custom gift set matching
├── image-10.jpg        # Small batch customization (MOQ 30 pcs)
├── image-11.jpg        # Free mockup and logo support
├── image-12.jpg        # Samples before bulk production
├── image-13.jpg        # Flexible payment terms
├── image-14.jpg        # Real project photo 1
├── image-15.jpg        # Real project photo 2
├── image-16.jpg        # Real project photo 3
├── image-17.jpg        # Real project photo 4
├── image-18.jpg        # Real project photo 5
├── image-19.jpg        # Real project photo 6
├── image-20.jpg        # Real project photo 7
├── image-21.jpg        # Real project photo 8
├── image-22.jpg        # Real project photo 9
├── image-23.jpg        # Real project photo 10
├── image-24.jpg        # Alibaba review screenshot (Spain)
├── image-25.jpg        # Alibaba review screenshot (United States)
├── image-26.jpg        # Alibaba review screenshot (Italy)
├── assets/             # Empty folder (reserved, not in use)
├── README.md
└── AGENTS.md           # This file
```

---

## Critical Rules

1. **All images live in the root directory.** Never use `assets/` prefix in `src` attributes. Always write `src="image-xx.jpg"`, never `src="assets/image-xx.jpg"`.

2. **Everything is in `index.html`.** All CSS is in `<style>`, all JS is in `<script>` at the bottom. Do not create separate `.css` or `.js` files unless explicitly asked.

3. **No backend.** The inquiry form submits via `mailto:` (opens the user's email client). There is no server, no API, no form service currently integrated.

4. **Do not change contact info** without explicit instruction:
   - Email: `sirazheng@gmail.com`
   - WhatsApp: `+86 158 6911 7529` → `https://wa.me/8615869117529`

5. **Deployment is automatic.** Cloudflare Pages is connected to this GitHub repo. Any push to `main` triggers a redeploy automatically. No manual deploy steps needed.

---

## Design System (CSS Variables)

```css
--navy:   #071724   /* dark background */
--cream:  #f6efe6   /* light background */
--gold:   #d99b38   /* primary accent */
--gold2:  #f0bf68   /* lighter gold, used in headings */
--ink:    #0b2034   /* body text */
--muted:  #68778a   /* secondary text */
--radius: 24px
```

Fonts: `Georgia / Times New Roman` (serif) for headings; system sans-serif for body.

---

## Page Sections (in order)

| Section | ID / class | Description |
|---------|-----------|-------------|
| Nav | `.nav` | Logo + nav links + CTA buttons |
| Hero | `.hero` | Headline, sub-copy, 4 key points, CTA buttons, hero image |
| Use Cases | `#use-cases` | 6 use case cards with images |
| Risk / Why Us | `.risk-section` | Left: company intro + process tags; Right: 6 guarantee cards |
| Customization Methods | `#customization` | 6 method cards with images |
| Products | `#products` | Product category grid (text-only cards, no images) |
| Real Projects | `#projects` | Auto-scrolling marquee of project photos (image-14 to image-23) |
| Reviews | `#reviews` | 3 review cards with expandable original proof screenshots |
| Contact / Inquiry Form | `#contact` | Inquiry form (mailto) + side card + WhatsApp button |
| Footer | `.footer` | Brand info, contact links, nav links |

---

## Inquiry Form Fields

| Field | Input ID | Required |
|-------|----------|---------|
| Full Name | `inqName` | Yes |
| Email | `inqEmail` | Yes |
| WhatsApp | `inqWhatsapp` | No |
| Company | `inqCompany` | No |
| Gift Use Case | `inqUseCase` | No |
| Estimated Quantity | `inqQuantity` | Yes |
| Need-by Date | `inqDate` | Yes |
| Products Interested In | `inqProducts` | No |
| Message | `inqMessage` | No |
| Logo / Artwork Upload | `logoUpload` | No |

Form submission opens `mailto:sirazheng@gmail.com` with pre-filled subject and body.

---

## Known Issues / History

- Images were originally referenced as `src="assets/image-xx"` which broke on Cloudflare Pages. Fixed to `src="image-xx"` (root-level paths). Do not reintroduce the `assets/` prefix.
- The `assets/` folder exists in the repo but only contains `.gitkeep`. It is intentionally empty.
- Line 4818 contains a garbled character (`5鈥?0 days`) — this is a copy encoding artifact. The correct text should be `5–10 days`.
