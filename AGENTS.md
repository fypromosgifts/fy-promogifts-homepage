# AGENTS.md - FY PromoGifts Homepage

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
├── index.html          # The entire site: CSS, JS, and HTML in one file
├── assets/             # Image assets used by index.html
│   ├── image-01.png
│   ├── image-02.png
│   └── ... image-26.jpg
├── image-01.png        # Root-level image mirror kept for compatibility
├── image-02.png
├── ... image-26.jpg
├── README.md
└── AGENTS.md
```

---

## Critical Rules

1. **The restored homepage uses `assets/` image paths.** Keep `index.html` references as `src="assets/image-xx.ext"` unless the file structure is intentionally changed.

2. **Root-level image files are still present as a compatibility mirror.** Do not delete them unless Cloudflare and all HTML references have been checked.

3. **Everything is in `index.html`.** All CSS is in `<style>`, all JS is in `<script>` at the bottom. Do not create separate `.css` or `.js` files unless explicitly asked.

4. **Form backend.** The inquiry form submits to Formspree at `https://formspree.io/f/xgoqqrno`. Keep the form as a static HTML form with vanilla JS enhancement unless explicitly asked to change providers.

5. **Do not change contact info** without explicit instruction:
   - Email: `sira@fypromogifts.com`
   - WhatsApp: `+86 158 6911 7529` -> `https://wa.me/8615869117529`

6. **Deployment is automatic.** Cloudflare Pages is connected to this GitHub repo. Any push to `main` triggers a redeploy automatically.

---

## Design System

Core colors:

```css
--navy:   #071724
--cream:  #f6efe6
--gold:   #d99b38
--gold2:  #f0bf68
--ink:    #0b2034
--muted:  #68778a
--radius: 24px
```

Fonts: Georgia / Times New Roman for headings; system sans-serif for body.

---

## Page Sections

| Section | ID / class | Description |
|---------|------------|-------------|
| Nav | `.nav` | Logo + nav links + CTA buttons |
| Hero | `.hero` | Headline, sub-copy, 4 key points, CTA buttons, hero image |
| Use Cases | `#use-cases` | 6 use case cards with images |
| Risk / Why Us | `.risk-section` | Process tags and 6 guarantee cards |
| Customization | `#customization` | What We Do cards with images |
| Products | `#products` | Product category grid |
| Real Projects | `#projects` | Auto-scrolling project photo marquee |
| Reviews | `#reviews` | Review cards with expandable proof screenshots |
| Contact | `#contact` | Inquiry form and WhatsApp button |
| Footer | `.footer` | Brand info and contact links |

---

## Inquiry Form

Form submission posts to Formspree endpoint `https://formspree.io/f/xgoqqrno` with `multipart/form-data`. The key input IDs are `inqName`, `inqEmail`, `inqWhatsapp`, `inqCompany`, `inqUseCase`, `inqQuantity`, `inqDate`, `inqProducts`, `inqMessage`, and `logoUpload`.

---

## Recovery Notes

- The homepage layout was restored from commit `00c9a75`.
- The `assets/` folder was repopulated by pointing to the existing image blobs.
- Cloudflare Pages currently runs a build-time patch that upgrades the inquiry form to Formspree and updates the contact email.