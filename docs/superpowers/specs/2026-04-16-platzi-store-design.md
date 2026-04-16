# Platzi Store — Final Challenge Design Spec

**Date:** 2026-04-16
**Deadline:** 2026-04-16 5:30pm COT (Bogota)
**Author:** Roberto Zuniga
**Challenge:** Vibe Coders League Platzi 2026 — Reto Final

---

## Overview

Build the Platzi Store — a fully functional online merch store for Platzi's first official merchandise line. The store features 12 products across three categories, an AI-powered shopping assistant chatbot, automated order confirmation emails, and a professional launch campaign.

## Tech Stack

- **Framework:** Next.js (TypeScript), generated via v0
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL) — products, images, orders
- **Deployment:** Vercel
- **Chatbot:** Gemini API
- **Automation:** Make.com (webhook + email)
- **Product Images:** Midjourney (high resolution)
- **Promo Video:** HeyGen
- **Social Media Assets:** Midjourney

## Brand System

All design follows the official Platzi brand. Dark theme default.

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#0AE88A` | Buttons, CTAs, brand highlights |
| Hover Green | `#4FF7AD` | Hover states |
| Background Primary | `#141414` | Main page background |
| Background Secondary | `#1C1C1C` | Cards, surfaces |
| Text Primary | `#F7FAF7` | Main text (warm white) |
| Text Secondary | `#919996` | Muted/secondary text |
| Text on Buttons | `#141414` | Dark text on green buttons |
| Error | `#E63357` | Validation, errors |

The Platzi logo (interlocking diamond mark) appears in the navbar.

## Products (12 Total)

### Premium/Minimalist Collection (5)

| # | Product | Price (USD) | Description | Variants |
|---|---------|-------------|-------------|----------|
| 1 | Hoodie | $89.99 | Clean, minimal Platzi logo embroidered, dark tones | S, M, L, XL, XXL |
| 2 | T-Shirt | $39.99 | Soft fabric, subtle Platzi branding, premium fit | S, M, L, XL, XXL |
| 3 | Laptop Sleeve | $49.99 | Padded sleeve with embossed Platzi logo | 13", 15", 16" |
| 4 | Water Bottle | $29.99 | Matte finish, minimalist Platzi mark | — |
| 5 | Notebook | $24.99 | Hardcover, Platzi green accent spine, dot grid | — |

### Fun/Community Collection (5)

| # | Product | Price (USD) | Description | Variants |
|---|---------|-------------|-------------|----------|
| 6 | Socks | $14.99 | Colorful patterns with Platzi icons and coding motifs | S/M, L/XL |
| 7 | Stickers Pack | $9.99 | Set of 10+ stickers with Platzi memes and dev culture references | — |
| 8 | Slippers | $34.99 | Cozy Platzi-branded slippers for coding sessions | S, M, L, XL |
| 9 | Giant Enter Key Plushie | $44.99 | Oversized Enter key you can slam — a debugging stress reliever | — |
| 10 | Coffee Mug | $19.99 | Fun illustrations, "Nunca Pares de Codear" or similar tagline | — |

### Special / Limited Edition (2)

| # | Product | Price (USD) | Description | Variants |
|---|---------|-------------|-------------|----------|
| 11 | Vibe Coders League Cap | $54.99 | Limited edition, March-April 2026 only. Premium embroidered VCL logo, structured cap. Badge: "Limited Edition" | One Size |
| 12 | "Nunca Pares de Aprender" Gift Subscription | $49.99 | Buy a 1-month Platzi subscription as a gift. Beautifully designed gift card/voucher visual | — |

## Pages

### Home Page
- Hero banner: spotlight on VCL Cap (limited edition) and Gift Subscription
- Two collection sections: Premium/Minimalist and Fun/Community
- Featured products carousel or grid
- CTA buttons linking to catalog

### Catalog Page
- Grid view of all 12 products
- Filter by collection: Premium, Fun, Special/Limited
- Sort options (price, name)
- Product cards: image, name, price, collection badge

### Product Detail Page
- Large HD product image
- Product name, description, price
- Size/variant selector (where applicable)
- "Add to Cart" button
- Related products section
- Limited edition badge + availability note (for VCL Cap)

### Cart (Slide-Over Modal)
The cart is NOT a separate page — it's a slide-over modal panel that opens from the right side of the screen when the user clicks the cart icon in the navbar. Accessible from any page.

**Contents:**
- Product list with thumbnail images, name, variant, unit price
- Quantity controls (+/-)
- Item subtotals and order total (running sum)
- **Employee Discount section:** Input field for a discount code. Valid codes apply a percentage discount (e.g., `PLATZI-TEAM-20` for 20% off). Discount reflected in the total.
- **Order Summary:** Subtotal, discount (if applied), total
- **Payment Methods:** Visual selector showing accepted methods — Credit Card, PayPal, Platzi Credits (all simulated, no real payment processing)
- Customer info form (name, email) for order confirmation
- "Place Order" button (triggers Make.com webhook)
- Success screen after order: "Your order is confirmed! Check your email."
- Cart clears after successful order

### Contact Page
- Contact form (name, email, message)
- Embedded Gemini chatbot widget

## Data Architecture

### Database: Supabase (PostgreSQL)

**Why a database:** High-resolution product images need reliable hosting and fast CDN delivery. Supabase provides both a database for product/order data and Storage (S3-compatible) for HD images with automatic CDN.

**Tables:**

| Table | Columns | Purpose |
|-------|---------|---------|
| `products` | id, name, slug, description, price, collection, variants (jsonb), badges (jsonb), image_url, created_at | All 12 products |
| `orders` | id, order_number, customer_name, customer_email, items (jsonb), subtotal, discount_code, discount_percent, total, payment_method, status, created_at | Order records |
| `discount_codes` | id, code, percent_off, active, description | Employee discount codes |

**Supabase Storage:**
- Bucket `product-images` — HD product images (Midjourney output uploaded here)
- Public URLs served via Supabase CDN for fast loading

**Cart State:** React Context with `useReducer` — add, remove, update quantity, clear. Client-side only.

**No real payments** — "Place Order" simulates a purchase. Payment method is recorded but not processed.

## Chatbot (Gemini API)

### Architecture
- **Backend:** Next.js API route at `/api/chat`
- **Frontend:** Floating chat widget, bottom-right corner, expandable panel
- **Styled:** Dark bubble with Platzi green accents, matches brand

### Capabilities
- Answer questions about all 12 products (prices, descriptions, sizing, availability)
- Recommend products based on user preferences ("something fun" → Fun collection)
- Explain the limited edition VCL Cap and its March-April 2026 window
- Answer general store questions (shipping, returns — fictional)
- Recommend relevant Platzi courses based on conversation context
- Highlight the Gift Subscription as a gifting option

### System Prompt
Pre-loaded with:
- Full product catalog JSON
- Store policies (fictional shipping, returns)
- Platzi course categories for recommendations
- Personality: friendly, casual, community-oriented, on-brand

### Boundaries
- Does NOT process orders or modify the cart
- Does NOT access external systems beyond Gemini API
- Shopping assistant only

## Make.com Automation

### Trigger
Webhook (always listening) at a Make.com URL.

### Flow
1. User clicks "Place Order" in cart modal
2. Next.js API route `POST /api/order`:
   a. Validates discount code (if provided) against Supabase `discount_codes` table
   b. Saves order to Supabase `orders` table
   c. Sends payload to Make.com webhook
3. Make.com scenario receives order data
4. Formats HTML confirmation email with Platzi branding
5. Sends email via Gmail/SMTP module to customer

### Order Payload
```json
{
  "customerName": "string",
  "customerEmail": "string",
  "items": [
    {
      "name": "string",
      "variant": "string | null",
      "quantity": 1,
      "price": 29.99,
      "image": "string"
    }
  ],
  "subtotal": 69.98,
  "discountCode": "string | null",
  "discountPercent": 20,
  "total": 55.98,
  "paymentMethod": "credit_card | paypal | platzi_credits",
  "orderNumber": "PLATZI-XXXX",
  "timestamp": "ISO 8601"
}
```

### Confirmation Email Contains
- Platzi Store logo and green branding
- Order number
- Itemized product list
- Total amount
- "Nunca Pares de Aprender" tagline

## Launch Campaign

### Promo Video (HeyGen)
- 30-60 second hype video
- AI avatar presenter introducing the Platzi Store
- Showcase both collections + VCL Cap + Gift Subscription
- Platzi green branding throughout
- CTA: "Visit the Platzi Store now"

### Social Media Images (Midjourney)
5 promotional images for Instagram/Twitter:

1. **Store Launch Announcement** — "Platzi Store is HERE" graphic
2. **Premium Collection Showcase** — Lifestyle shot of premium products
3. **Fun Collection Showcase** — Playful arrangement of fun products
4. **Limited Edition VCL Cap** — Urgency: "Only available through April 2026"
5. **Gift Subscription** — "Nunca Pares de Aprender" gift card visual

All images high resolution, Platzi-branded.

## Execution Timeline

| Block | Time (COT) | Task |
|-------|------------|------|
| 1 | 5:30am - 6:30am | Finalize spec and implementation plan |
| 2 | 6:30am - 7:30am | Generate Midjourney prompts, start image generation (parallel) |
| 3 | 6:30am - 9:30am | Build store in v0 — all pages, branding, 12 products |
| 4 | 9:30am - 11:00am | Pull v0 code into repo, integrate images, polish UI |
| 5 | 11:00am - 12:30pm | Build Gemini chatbot — API route, widget, system prompt |
| 6 | 12:30pm - 1:30pm | Build Make.com automation — webhook, email template, order flow |
| 7 | 1:30pm - 2:30pm | HeyGen promo video + social media images finalization |
| 8 | 2:30pm - 3:30pm | Deploy to Vercel, end-to-end testing |
| 9 | 3:30pm - 4:30pm | Bug fixes, polish, README documentation |
| 10 | 4:30pm - 5:30pm | Buffer — final touches, presentation prep |

Key: Midjourney and HeyGen run in parallel with coding. Never block on asset generation.

## Success Criteria

- Store is live on Vercel with a public URL
- All 12 products displayed with HD AI-generated images served from Supabase Storage CDN
- Products, orders, and discount codes stored in Supabase PostgreSQL
- Cart modal works: add, remove, update quantity, apply employee discount, select payment method, place order
- Order summary shows subtotal, discount, and total with running price calculations
- Employee discount codes validate and apply correctly
- Place order triggers Make.com webhook and sends confirmation email
- Gemini chatbot answers product questions and recommends Platzi courses
- VCL Cap shows as limited edition with urgency elements
- Gift Subscription is prominently featured
- Full Platzi branding (colors, logo, dark theme)
- Promo video and social media images completed
- README documents the project, tech stack, and links
