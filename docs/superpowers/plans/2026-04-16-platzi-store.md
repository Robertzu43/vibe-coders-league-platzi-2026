# Platzi Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Platzi Store — a fully functional merch e-commerce site with 12 products, Gemini chatbot, Make.com order automation, and launch campaign assets.

**Architecture:** Next.js app generated via v0, styled with Tailwind CSS using Platzi brand tokens. Supabase provides PostgreSQL for products/orders/discounts and Storage for HD product images. Gemini API powers the chatbot via a Next.js API route. Make.com webhook handles order confirmation emails. Cart is client-side React Context.

**Tech Stack:** Next.js (TypeScript), Tailwind CSS, Supabase (PostgreSQL + Storage), Gemini API, Make.com, Vercel, Midjourney, HeyGen

**Spec:** `docs/superpowers/specs/2026-04-16-platzi-store-design.md`

---

## File Structure

```
reto-final/
├── README.md
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── .env.local                          # SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY, MAKE_WEBHOOK_URL
├── public/
│   └── platzi-logo.svg                 # Platzi logo asset
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout — navbar, cart modal, chatbot widget, fonts
│   │   ├── page.tsx                    # Home page
│   │   ├── catalog/
│   │   │   └── page.tsx               # Catalog page — grid, filters, sorting
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Product detail page
│   │   ├── contact/
│   │   │   └── page.tsx               # Contact page — form + chatbot
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts           # Gemini chatbot API route
│   │       ├── order/
│   │       │   └── route.ts           # Place order — Supabase save + Make.com webhook
│   │       └── discount/
│   │           └── route.ts           # Validate discount code
│   ├── components/
│   │   ├── navbar.tsx                  # Top navigation bar + cart icon with count
│   │   ├── footer.tsx                  # Site footer
│   │   ├── hero-banner.tsx             # Home page hero section
│   │   ├── product-card.tsx            # Product card for grid views
│   │   ├── product-grid.tsx            # Grid layout with filter/sort controls
│   │   ├── collection-section.tsx      # Home page collection section (Premium/Fun)
│   │   ├── cart-modal.tsx              # Slide-over cart modal panel
│   │   ├── cart-item.tsx               # Individual item row inside cart
│   │   ├── order-summary.tsx           # Subtotal, discount, total display
│   │   ├── payment-methods.tsx         # Payment method selector (visual)
│   │   ├── discount-input.tsx          # Employee discount code input + validation
│   │   ├── checkout-form.tsx           # Customer name/email form + place order button
│   │   ├── order-success.tsx           # Post-order success screen
│   │   ├── chatbot-widget.tsx          # Floating chat widget (bottom-right)
│   │   ├── chatbot-panel.tsx           # Expanded chat panel with message history
│   │   ├── contact-form.tsx            # Contact page form
│   │   └── limited-badge.tsx           # "Limited Edition" badge component
│   ├── context/
│   │   └── cart-context.tsx            # Cart state — React Context + useReducer
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client initialization
│   │   ├── products.ts                # Product fetching functions
│   │   ├── orders.ts                  # Order creation + discount validation
│   │   └── types.ts                   # TypeScript types: Product, CartItem, Order, DiscountCode
│   └── data/
│       ├── products.json              # Seed data for all 12 products
│       ├── discount-codes.json        # Seed data for discount codes
│       └── chatbot-system-prompt.txt  # Gemini system prompt with catalog + policies
```

---

## Task 1: Project Scaffolding & Supabase Setup

**Files:**
- Create: `reto-final/.env.local`
- Create: `reto-final/src/lib/supabase.ts`
- Create: `reto-final/src/lib/types.ts`
- Create: `reto-final/src/data/products.json`
- Create: `reto-final/src/data/discount-codes.json`

**Context:** This task sets up the Next.js project (from v0 output), configures Supabase, defines TypeScript types, and creates seed data. The v0-generated code will be placed in `reto-final/` and adapted.

- [ ] **Step 1: Initialize Next.js project**

Generate the store UI in v0 with the following prompt guidance:
- Dark theme, Platzi brand colors (#0AE88A primary green, #141414 background, #1C1C1C cards, #F7FAF7 text)
- E-commerce layout: home, catalog, product detail pages
- Request all pages in a single v0 generation

Place the output in `reto-final/`.

- [ ] **Step 2: Install dependencies**

```bash
cd reto-final
npm install @supabase/supabase-js @google/generative-ai
```

- [ ] **Step 3: Create TypeScript types**

Create `src/lib/types.ts`:

```typescript
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  collection: "premium" | "fun" | "limited";
  variants: string[] | null;
  badges: string[] | null;
  image_url: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string | null;
}

export interface DiscountCode {
  id: string;
  code: string;
  percent_off: number;
  active: boolean;
  description: string;
}

export interface Order {
  id?: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
  subtotal: number;
  discount_code: string | null;
  discount_percent: number;
  total: number;
  payment_method: "credit_card" | "paypal" | "platzi_credits";
  status: string;
  created_at?: string;
}

export interface OrderItem {
  name: string;
  variant: string | null;
  quantity: number;
  price: number;
  image: string;
}
```

- [ ] **Step 4: Create product seed data**

Create `src/data/products.json` with all 12 products:

```json
[
  {
    "id": "1",
    "name": "Platzi Premium Hoodie",
    "slug": "platzi-premium-hoodie",
    "description": "Clean, minimal Platzi logo embroidered on premium heavyweight cotton. Dark tones, tailored fit.",
    "price": 89.99,
    "collection": "premium",
    "variants": ["S", "M", "L", "XL", "XXL"],
    "badges": null,
    "image_url": ""
  },
  {
    "id": "2",
    "name": "Platzi Essential T-Shirt",
    "slug": "platzi-essential-tshirt",
    "description": "Soft fabric with subtle Platzi branding. Premium fit for everyday wear.",
    "price": 39.99,
    "collection": "premium",
    "variants": ["S", "M", "L", "XL", "XXL"],
    "badges": null,
    "image_url": ""
  },
  {
    "id": "3",
    "name": "Platzi Laptop Sleeve",
    "slug": "platzi-laptop-sleeve",
    "description": "Padded neoprene sleeve with embossed Platzi logo. Protects your gear in style.",
    "price": 49.99,
    "collection": "premium",
    "variants": ["13\"", "15\"", "16\""],
    "badges": null,
    "image_url": ""
  },
  {
    "id": "4",
    "name": "Platzi Water Bottle",
    "slug": "platzi-water-bottle",
    "description": "Matte black finish with minimalist Platzi mark. Double-walled, keeps drinks cold 24hrs.",
    "price": 29.99,
    "collection": "premium",
    "variants": null,
    "badges": null,
    "image_url": ""
  },
  {
    "id": "5",
    "name": "Platzi Developer Notebook",
    "slug": "platzi-developer-notebook",
    "description": "Hardcover dot grid notebook with Platzi green accent spine. 192 pages of ideas.",
    "price": 24.99,
    "collection": "premium",
    "variants": null,
    "badges": null,
    "image_url": ""
  },
  {
    "id": "6",
    "name": "Platzi Code Socks",
    "slug": "platzi-code-socks",
    "description": "Colorful patterns with Platzi icons and coding motifs. Comfort meets community.",
    "price": 14.99,
    "collection": "fun",
    "variants": ["S/M", "L/XL"],
    "badges": null,
    "image_url": ""
  },
  {
    "id": "7",
    "name": "Platzi Stickers Pack",
    "slug": "platzi-stickers-pack",
    "description": "Set of 12 premium vinyl stickers with Platzi memes and dev culture references.",
    "price": 9.99,
    "collection": "fun",
    "variants": null,
    "badges": null,
    "image_url": ""
  },
  {
    "id": "8",
    "name": "Platzi Cozy Slippers",
    "slug": "platzi-cozy-slippers",
    "description": "Ultra-soft Platzi-branded slippers for late-night coding sessions. Memory foam insole.",
    "price": 34.99,
    "collection": "fun",
    "variants": ["S", "M", "L", "XL"],
    "badges": null,
    "image_url": ""
  },
  {
    "id": "9",
    "name": "Giant Enter Key Plushie",
    "slug": "giant-enter-key-plushie",
    "description": "Oversized Enter key you can slam on your desk. The ultimate debugging stress reliever.",
    "price": 44.99,
    "collection": "fun",
    "variants": null,
    "badges": null,
    "image_url": ""
  },
  {
    "id": "10",
    "name": "Platzi Coffee Mug",
    "slug": "platzi-coffee-mug",
    "description": "Ceramic mug with fun illustrations and \"Nunca Pares de Codear\" tagline. 350ml.",
    "price": 19.99,
    "collection": "fun",
    "variants": null,
    "badges": null,
    "image_url": ""
  },
  {
    "id": "11",
    "name": "Vibe Coders League Cap",
    "slug": "vibe-coders-league-cap",
    "description": "Limited edition structured cap with premium embroidered VCL logo. Only available March-April 2026.",
    "price": 54.99,
    "collection": "limited",
    "variants": ["One Size"],
    "badges": ["Limited Edition", "March-April 2026"],
    "image_url": ""
  },
  {
    "id": "12",
    "name": "Nunca Pares de Aprender — Gift Subscription",
    "slug": "nunca-pares-gift-subscription",
    "description": "Gift a 1-month Platzi subscription to a friend or family member. Because learning never stops.",
    "price": 49.99,
    "collection": "limited",
    "variants": null,
    "badges": ["Gift"],
    "image_url": ""
  }
]
```

- [ ] **Step 5: Create discount codes seed data**

Create `src/data/discount-codes.json`:

```json
[
  {
    "id": "1",
    "code": "PLATZI-TEAM-20",
    "percent_off": 20,
    "active": true,
    "description": "Platzi employee discount — 20% off"
  },
  {
    "id": "2",
    "code": "VCL-FINALIST-15",
    "percent_off": 15,
    "active": true,
    "description": "Vibe Coders League finalist discount — 15% off"
  },
  {
    "id": "3",
    "code": "NUNCA-PARES-10",
    "percent_off": 10,
    "active": true,
    "description": "Community member discount — 10% off"
  }
]
```

- [ ] **Step 6: Create environment variables file**

Create `reto-final/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
MAKE_WEBHOOK_URL=your_make_webhook_url
```

- [ ] **Step 7: Create Supabase client**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 8: Set up Supabase project**

In the Supabase dashboard:

1. Create a new project called `platzi-store`
2. Run SQL to create tables:

```sql
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  collection text NOT NULL CHECK (collection IN ('premium', 'fun', 'limited')),
  variants jsonb,
  badges jsonb,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  items jsonb NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  discount_code text,
  discount_percent integer DEFAULT 0,
  total decimal(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('credit_card', 'paypal', 'platzi_credits')),
  status text DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE discount_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  percent_off integer NOT NULL,
  active boolean DEFAULT true,
  description text
);
```

3. Insert seed data from the JSON files into the tables
4. Create a Storage bucket called `product-images` (public)
5. Copy the project URL and anon key into `.env.local`

- [ ] **Step 9: Create product fetching functions**

Create `src/lib/products.ts`:

```typescript
import { supabase } from "./supabase";
import type { Product } from "./types";

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("collection", { ascending: true });

  if (error) throw error;
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("collection", collection);

  if (error) throw error;
  return data as Product[];
}
```

- [ ] **Step 10: Create order functions**

Create `src/lib/orders.ts`:

```typescript
import { supabase } from "./supabase";
import type { Order, DiscountCode } from "./types";

export async function validateDiscountCode(code: string): Promise<DiscountCode | null> {
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .single();

  if (error) return null;
  return data as DiscountCode;
}

export async function createOrder(order: Omit<Order, "id" | "created_at">): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PLATZI-${timestamp}-${random}`;
}
```

- [ ] **Step 11: Commit**

```bash
git add reto-final/
git commit -m "feat: scaffold project with Supabase, types, seed data, and data layer"
```

---

## Task 2: Tailwind Brand System & Layout Components

**Files:**
- Modify: `reto-final/tailwind.config.ts`
- Create: `reto-final/src/app/layout.tsx`
- Create: `reto-final/src/components/navbar.tsx`
- Create: `reto-final/src/components/footer.tsx`
- Create: `reto-final/public/platzi-logo.svg`

**Context:** Configure Tailwind with Platzi brand tokens and build the shared layout shell (navbar + footer) that wraps all pages. The Platzi logo SVG goes in public/.

- [ ] **Step 1: Configure Tailwind with Platzi brand colors**

Update `tailwind.config.ts` to extend the theme:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        platzi: {
          green: "#0AE88A",
          "green-hover": "#4FF7AD",
          "green-strong": "#05824D",
          bg: "#141414",
          "bg-secondary": "#1C1C1C",
          "bg-tertiary": "#292929",
          text: "#F7FAF7",
          "text-secondary": "#919996",
          "text-on-button": "#141414",
          error: "#E63357",
          info: "#0AB5E8",
          warning: "#F5D400",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Add Platzi logo SVG**

Save the Platzi logo SVG to `public/platzi-logo.svg`. Extract from the provided brand assets.

- [ ] **Step 3: Build the Navbar component**

Create `src/components/navbar.tsx`:

- Platzi logo (links to home)
- Navigation links: Home, Catalog, Contact
- Cart icon (shopping bag) with item count badge
- Clicking cart icon opens the cart slide-over modal
- Sticky top, dark background (`#141414`), green accents
- Mobile responsive with hamburger menu

- [ ] **Step 4: Build the Footer component**

Create `src/components/footer.tsx`:

- Platzi Store branding
- Links: Catalog, Contact, Platzi.com
- "Nunca Pares de Aprender" tagline
- Social media icon placeholders
- Dark background, subtle border top

- [ ] **Step 5: Build the Root Layout**

Update `src/app/layout.tsx`:

- Import and use Navbar and Footer
- Wrap children with CartProvider (from Task 3)
- Set HTML metadata: title "Platzi Store", description
- Apply global styles: `bg-platzi-bg text-platzi-text`
- Import fonts (Inter or similar clean sans-serif)

- [ ] **Step 6: Commit**

```bash
git add reto-final/
git commit -m "feat: add Platzi brand system, navbar, footer, and root layout"
```

---

## Task 3: Cart Context & Cart Modal

**Files:**
- Create: `reto-final/src/context/cart-context.tsx`
- Create: `reto-final/src/components/cart-modal.tsx`
- Create: `reto-final/src/components/cart-item.tsx`
- Create: `reto-final/src/components/order-summary.tsx`
- Create: `reto-final/src/components/payment-methods.tsx`
- Create: `reto-final/src/components/discount-input.tsx`
- Create: `reto-final/src/components/checkout-form.tsx`
- Create: `reto-final/src/components/order-success.tsx`

**Context:** The cart is a client-side React Context with a slide-over modal. It includes discount code validation, payment method selection, order summary with running totals, and the checkout flow that triggers the Make.com webhook.

- [ ] **Step 1: Build Cart Context**

Create `src/context/cart-context.tsx`:

```typescript
"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; variant: string | null }
  | { type: "REMOVE_ITEM"; productId: string; variant: string | null }
  | { type: "UPDATE_QUANTITY"; productId: string; variant: string | null; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id && item.selectedVariant === action.variant
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id && item.selectedVariant === action.variant
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1, selectedVariant: action.variant }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.product.id === action.productId && item.selectedVariant === action.variant)
        ),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId && item.selectedVariant === action.variant
            ? { ...item, quantity: action.quantity }
            : item
        ).filter((item) => item.quantity > 0),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
```

- [ ] **Step 2: Build Cart Item component**

Create `src/components/cart-item.tsx`:

- Product thumbnail image, name, selected variant
- Unit price display
- Quantity controls (+/- buttons)
- Remove button (trash icon)
- Item subtotal (price x quantity)

- [ ] **Step 3: Build Order Summary component**

Create `src/components/order-summary.tsx`:

- Subtotal (sum of all item prices x quantities)
- Discount line (shows code and percentage if applied, with discounted amount)
- Total (subtotal minus discount)
- All values update reactively as cart changes

- [ ] **Step 4: Build Discount Input component**

Create `src/components/discount-input.tsx`:

- Text input for discount code
- "Apply" button
- Calls `POST /api/discount` to validate
- Shows success (green) with discount percentage or error (red) if invalid
- Stores validated discount in local state, passes up to cart modal

- [ ] **Step 5: Build Payment Methods component**

Create `src/components/payment-methods.tsx`:

- Three selectable cards: Credit Card, PayPal, Platzi Credits
- Each with an icon and label
- Radio-style selection — one active at a time
- Default: Credit Card
- Styled with Platzi brand — green border on selected

- [ ] **Step 6: Build Checkout Form component**

Create `src/components/checkout-form.tsx`:

- Customer name input (required)
- Customer email input (required, email validation)
- "Place Order" button — green, prominent
- On submit: calls `POST /api/order` with full order payload
- Shows loading state while processing
- On success: triggers order success screen

- [ ] **Step 7: Build Order Success component**

Create `src/components/order-success.tsx`:

- Checkmark icon animation
- "Your order is confirmed!"
- Order number display
- "Check your email for confirmation"
- "Continue Shopping" button that closes modal and clears cart

- [ ] **Step 8: Build Cart Modal (slide-over panel)**

Create `src/components/cart-modal.tsx`:

- Slide-over panel from right side of screen
- Dark overlay behind panel
- Header: "Your Cart" + close button
- If empty: "Your cart is empty" message + "Browse Products" CTA
- If has items: scrollable list of CartItem components
- Below items: DiscountInput, OrderSummary, PaymentMethods, CheckoutForm
- After order success: shows OrderSuccess component
- Accessible from any page via navbar cart icon

- [ ] **Step 9: Commit**

```bash
git add reto-final/
git commit -m "feat: add cart context, cart modal with discount, payment, and checkout flow"
```

---

## Task 4: Home Page

**Files:**
- Create: `reto-final/src/components/hero-banner.tsx`
- Create: `reto-final/src/components/collection-section.tsx`
- Create: `reto-final/src/components/product-card.tsx`
- Modify: `reto-final/src/app/page.tsx`

**Context:** The home page is the store's landing page. It spotlights the VCL Cap and Gift Subscription in the hero, then shows both product collections.

- [ ] **Step 1: Build Product Card component**

Create `src/components/product-card.tsx`:

- Product image (HD, from Supabase Storage URL)
- Product name
- Price
- Collection badge (small pill: "Premium", "Fun", "Limited Edition")
- Limited edition products get the special badge treatment
- Hover effect: subtle scale + green border glow
- Clicking links to `/product/[slug]`

- [ ] **Step 2: Build Hero Banner component**

Create `src/components/hero-banner.tsx`:

- Full-width hero section
- Headline: "Platzi Store" or "Welcome to the Platzi Store"
- Subheadline about the merch launch
- Two spotlight cards side by side:
  - VCL Cap with "Limited Edition — Only through April 2026" urgency
  - Gift Subscription with "Nunca Pares de Aprender" messaging
- CTA buttons linking to catalog and individual product pages
- Platzi green gradient or accent elements

- [ ] **Step 3: Build Collection Section component**

Create `src/components/collection-section.tsx`:

- Section title ("Premium Collection", "Fun Collection")
- Section description (one line about the collection vibe)
- Horizontal scroll or grid of ProductCard components
- "View All" link to catalog with filter pre-applied

- [ ] **Step 4: Build Home Page**

Update `src/app/page.tsx`:

- Fetch all products from Supabase (server component)
- Render: HeroBanner → Premium CollectionSection → Fun CollectionSection
- Pass products filtered by collection to each section

- [ ] **Step 5: Commit**

```bash
git add reto-final/
git commit -m "feat: add home page with hero banner and collection sections"
```

---

## Task 5: Catalog Page

**Files:**
- Create: `reto-final/src/components/product-grid.tsx`
- Create: `reto-final/src/app/catalog/page.tsx`

**Context:** The catalog shows all 12 products in a filterable, sortable grid.

- [ ] **Step 1: Build Product Grid component**

Create `src/components/product-grid.tsx`:

- Client component (needs state for filters/sorting)
- Filter bar: buttons for "All", "Premium", "Fun", "Limited" — active state highlighted green
- Sort dropdown: "Price: Low to High", "Price: High to Low", "Name: A-Z"
- Responsive grid: 1 col mobile, 2 col tablet, 3-4 col desktop
- Uses ProductCard component for each item
- Shows result count ("12 products" / "5 products")

- [ ] **Step 2: Build Catalog Page**

Create `src/app/catalog/page.tsx`:

- Server component that fetches all products from Supabase
- Page title: "All Products" or "Shop All"
- Passes products to ProductGrid client component
- Metadata: title "Catalog — Platzi Store"

- [ ] **Step 3: Commit**

```bash
git add reto-final/
git commit -m "feat: add catalog page with filterable product grid"
```

---

## Task 6: Product Detail Page

**Files:**
- Create: `reto-final/src/components/limited-badge.tsx`
- Create: `reto-final/src/app/product/[slug]/page.tsx`

**Context:** Dynamic page for each product showing full details with variant selection and add-to-cart functionality.

- [ ] **Step 1: Build Limited Badge component**

Create `src/components/limited-badge.tsx`:

- Animated or eye-catching badge for limited edition products
- Shows badge text (e.g., "Limited Edition", "March-April 2026")
- Green accent styling with subtle pulse or shimmer animation

- [ ] **Step 2: Build Product Detail Page**

Create `src/app/product/[slug]/page.tsx`:

- Server component that fetches product by slug from Supabase
- 404 if product not found (use `notFound()`)
- Layout: two columns on desktop — image left, details right
- Left: Large HD product image
- Right: Product name, collection badge, price (large), description
- Variant selector: buttons for each variant option (size, etc.), green highlight on selected
- "Add to Cart" button — large, green, opens cart modal after adding
- If limited edition: show LimitedBadge with availability note
- Related products section at bottom (same collection, excluding current product)
- Generate static params from all product slugs for SSG

- [ ] **Step 3: Commit**

```bash
git add reto-final/
git commit -m "feat: add product detail page with variant selection and add-to-cart"
```

---

## Task 7: Contact Page

**Files:**
- Create: `reto-final/src/components/contact-form.tsx`
- Create: `reto-final/src/app/contact/page.tsx`

**Context:** Simple contact page with a form and the chatbot widget prominently displayed.

- [ ] **Step 1: Build Contact Form component**

Create `src/components/contact-form.tsx`:

- Fields: Name, Email, Message (textarea)
- Submit button
- Client-side validation (required fields, email format)
- On submit: show success toast/message ("Thanks for reaching out!")
- UI-only — no backend needed for contact form

- [ ] **Step 2: Build Contact Page**

Create `src/app/contact/page.tsx`:

- Page title: "Contact Us"
- Subtitle: "Have questions? Chat with our AI assistant or send us a message."
- Two-column layout: contact form on left, chatbot callout on right
- Right column: visual prompt to use the chatbot widget (the floating widget from Task 8 is always available, but highlight it here)
- Metadata: title "Contact — Platzi Store"

- [ ] **Step 3: Commit**

```bash
git add reto-final/
git commit -m "feat: add contact page with form"
```

---

## Task 8: Gemini Chatbot

**Files:**
- Create: `reto-final/src/data/chatbot-system-prompt.txt`
- Create: `reto-final/src/app/api/chat/route.ts`
- Create: `reto-final/src/components/chatbot-widget.tsx`
- Create: `reto-final/src/components/chatbot-panel.tsx`

**Context:** AI shopping assistant powered by Gemini API. Floating widget accessible from all pages. Backend API route proxies requests to Gemini with system prompt containing the full product catalog.

- [ ] **Step 1: Write the chatbot system prompt**

Create `src/data/chatbot-system-prompt.txt`:

```
You are the Platzi Store Shopping Assistant. You help customers browse and discover products in the Platzi Store — Platzi's first official merchandise line.

## Your Personality
- Friendly, casual, and enthusiastic about tech and learning
- You speak like a Platzi community member — encouraging, positive
- Use some Spanish phrases naturally (e.g., "Nunca pares de aprender", "Excelente elección")
- Keep responses concise — 2-3 sentences max unless the customer asks for detail

## Products Available

### Premium/Minimalist Collection
1. Platzi Premium Hoodie — $89.99 (S, M, L, XL, XXL) — Clean, minimal embroidered logo, dark tones
2. Platzi Essential T-Shirt — $39.99 (S, M, L, XL, XXL) — Soft fabric, subtle branding, premium fit
3. Platzi Laptop Sleeve — $49.99 (13", 15", 16") — Padded with embossed logo
4. Platzi Water Bottle — $29.99 — Matte finish, double-walled, keeps drinks cold 24hrs
5. Platzi Developer Notebook — $24.99 — Hardcover dot grid, green accent spine

### Fun/Community Collection
6. Platzi Code Socks — $14.99 (S/M, L/XL) — Colorful patterns with coding motifs
7. Platzi Stickers Pack — $9.99 — 12 premium vinyl stickers, memes and dev culture
8. Platzi Cozy Slippers — $34.99 (S, M, L, XL) — Memory foam, for coding sessions
9. Giant Enter Key Plushie — $44.99 — Oversized, slamable, stress reliever
10. Platzi Coffee Mug — $19.99 — "Nunca Pares de Codear" tagline, 350ml

### Special / Limited Edition
11. Vibe Coders League Cap — $54.99 (One Size) — LIMITED EDITION: Only available March-April 2026. Embroidered VCL logo.
12. Nunca Pares de Aprender Gift Subscription — $49.99 — Gift a 1-month Platzi subscription

## Platzi Course Recommendations
When relevant, suggest Platzi courses:
- Web Development: "Curso de Next.js", "Curso de React"
- AI/ML: "Curso de Inteligencia Artificial", "Curso de Machine Learning"
- Design: "Curso de Diseño UI", "Curso de UX Research"
- Data: "Curso de Data Science", "Curso de SQL y Bases de Datos"
- Business: "Curso de Marketing Digital", "Curso de Startups"

## Store Policies (Fictional)
- Free shipping on orders over $75
- 30-day returns on all physical products
- Gift subscriptions are delivered digitally via email
- Employee discounts available with valid codes

## Boundaries
- You do NOT process orders or add items to the cart
- You do NOT know about specific customer orders
- If asked about things outside the store, politely redirect to store topics
- Never make up products that are not in the list above
```

- [ ] **Step 2: Build the Chat API route**

Create `src/app/api/chat/route.ts`:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const systemPrompt = fs.readFileSync(
  path.join(process.cwd(), "src/data/chatbot-system-prompt.txt"),
  "utf-8"
);

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response.text();

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Build Chatbot Widget (floating button)**

Create `src/components/chatbot-widget.tsx`:

- Floating circular button, bottom-right corner (fixed position)
- Green background with chat icon
- Click toggles the ChatbotPanel open/closed
- Shows unread indicator dot when there's a new response
- Positioned above any other floating elements
- z-index high enough to stay on top

- [ ] **Step 4: Build Chatbot Panel (expanded chat)**

Create `src/components/chatbot-panel.tsx`:

- Panel that slides up from the widget button
- Header: "Platzi Store Assistant" + close button
- Scrollable message area
- Messages styled: user (right-aligned, dark bg) / assistant (left-aligned, green-tinted bg)
- Text input at bottom with send button
- Loading indicator (typing dots) while waiting for API response
- Initial greeting message on first open: "Hey! Welcome to the Platzi Store. How can I help you find something today?"
- Styled to match Platzi brand: dark panel, green accents

- [ ] **Step 5: Add chatbot widget to root layout**

Update `src/app/layout.tsx` to include the ChatbotWidget component so it appears on every page.

- [ ] **Step 6: Commit**

```bash
git add reto-final/
git commit -m "feat: add Gemini chatbot with system prompt, API route, and floating widget"
```

---

## Task 9: Order API & Make.com Integration

**Files:**
- Create: `reto-final/src/app/api/order/route.ts`
- Create: `reto-final/src/app/api/discount/route.ts`

**Context:** API routes for placing orders (saves to Supabase + fires Make.com webhook) and validating discount codes.

- [ ] **Step 1: Build Discount Validation API route**

Create `src/app/api/discount/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { validateDiscountCode } from "@/lib/orders";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Discount code is required" }, { status: 400 });
    }

    const discount = await validateDiscountCode(code);

    if (!discount) {
      return NextResponse.json({ error: "Invalid or expired discount code" }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      code: discount.code,
      percent_off: discount.percent_off,
      description: discount.description,
    });
  } catch (error) {
    console.error("Discount validation error:", error);
    return NextResponse.json({ error: "Failed to validate discount code" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Build Order API route**

Create `src/app/api/order/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createOrder, generateOrderNumber, validateDiscountCode } from "@/lib/orders";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, items, paymentMethod, discountCode } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !items?.length || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    // Validate discount if provided
    let discountPercent = 0;
    if (discountCode) {
      const discount = await validateDiscountCode(discountCode);
      if (discount) {
        discountPercent = discount.percent_off;
      }
    }

    // Calculate total
    const discountAmount = subtotal * (discountPercent / 100);
    const total = Math.round((subtotal - discountAmount) * 100) / 100;

    const orderNumber = generateOrderNumber();

    // Save to Supabase
    const order = await createOrder({
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      items,
      subtotal,
      discount_code: discountCode || null,
      discount_percent: discountPercent,
      total,
      payment_method: paymentMethod,
      status: "confirmed",
    });

    // Fire Make.com webhook
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items,
          subtotal,
          discountCode: discountCode || null,
          discountPercent,
          total,
          paymentMethod,
          orderNumber,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      total,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add reto-final/
git commit -m "feat: add order and discount API routes with Make.com webhook integration"
```

---

## Task 10: Make.com Scenario Setup

**Files:** None (external service configuration)

**Context:** Set up the Make.com scenario that listens for order webhooks and sends confirmation emails. This is done in the Make.com dashboard, not in code.

- [ ] **Step 1: Create Make.com scenario**

1. Create a new scenario in Make.com
2. Add a **Webhook** trigger module (Custom webhook)
3. Copy the webhook URL into `reto-final/.env.local` as `MAKE_WEBHOOK_URL`

- [ ] **Step 2: Add email module**

1. Add a **Gmail** (or SMTP) module after the webhook
2. Configure the email template:
   - **To:** `{{customerEmail}}`
   - **Subject:** `Platzi Store — Order Confirmed #{{orderNumber}}`
   - **Body:** HTML email with:
     - Platzi Store header (green branded)
     - "Thank you for your order, {{customerName}}!"
     - Order number
     - Itemized product list (loop through items array)
     - Subtotal, discount (if applied), total
     - "Nunca Pares de Aprender" footer tagline

- [ ] **Step 3: Test the scenario**

1. Turn on the scenario (set to "Immediately" scheduling)
2. Send a test POST to the webhook URL with sample order data
3. Verify the email is received with correct formatting

- [ ] **Step 4: Document the webhook URL**

Ensure `MAKE_WEBHOOK_URL` is set in `.env.local` and in Vercel environment variables.

---

## Task 11: Product Image Generation & Upload

**Files:** None (external tooling + Supabase Storage)

**Context:** Generate all 12 product images in Midjourney at high resolution, then upload to Supabase Storage and update the product records with image URLs.

- [ ] **Step 1: Generate Midjourney prompts**

Prepare prompts for all 12 products. Style guidelines:
- Premium collection: studio photography, dark backgrounds, matte textures, minimalist
- Fun collection: vibrant, playful, colorful backgrounds, lifestyle shots
- Limited edition: premium feel with urgency visual cues
- All products: Platzi green (#0AE88A) accents where natural
- Use `--ar 1:1 --v 6 --q 2` for square high-quality output

- [ ] **Step 2: Generate images in Midjourney**

Run all 12 prompts. Upscale the best results to maximum resolution.

- [ ] **Step 3: Upload to Supabase Storage**

1. In Supabase dashboard, go to Storage → `product-images` bucket
2. Upload all 12 images with descriptive filenames (e.g., `platzi-premium-hoodie.png`)
3. Copy the public URLs for each image

- [ ] **Step 4: Update product records**

Update the `image_url` field for each product in the Supabase `products` table with the corresponding Storage CDN URL.

- [ ] **Step 5: Verify images load in the app**

Start the dev server and confirm all product images render correctly on home, catalog, and product detail pages.

- [ ] **Step 6: Commit any code changes**

```bash
git add reto-final/
git commit -m "feat: integrate HD product images from Supabase Storage"
```

---

## Task 12: Launch Campaign Assets

**Files:** None (external tooling)

**Context:** Create the promotional video and social media images for the store launch.

- [ ] **Step 1: Generate social media images in Midjourney**

Create 5 promotional images:
1. Store Launch Announcement — "Platzi Store is HERE"
2. Premium Collection Showcase — lifestyle shot
3. Fun Collection Showcase — playful arrangement
4. Limited Edition VCL Cap — urgency messaging
5. Gift Subscription — "Nunca Pares de Aprender" visual

Use Platzi green branding, high resolution, social media aspect ratios (1:1 for Instagram, 16:9 for Twitter).

- [ ] **Step 2: Create HeyGen promo video**

1. Choose or create an AI avatar presenter
2. Write script (30-60 seconds):
   - "Introducing the Platzi Store — the first official Platzi merch collection..."
   - Showcase Premium and Fun collections
   - Highlight VCL Cap limited edition
   - Highlight Gift Subscription
   - CTA: "Visit the Platzi Store now"
3. Add Platzi branding overlays
4. Export in high quality

- [ ] **Step 3: Save assets to repo**

Save final campaign assets (or links to them) in `reto-final/campaign/` for documentation.

- [ ] **Step 4: Commit**

```bash
git add reto-final/
git commit -m "docs: add launch campaign assets and references"
```

---

## Task 13: Deploy to Vercel & End-to-End Testing

**Files:**
- Modify: `reto-final/.env.local` (verify all vars)

**Context:** Deploy the complete store to Vercel and run through all user flows.

- [ ] **Step 1: Deploy to Vercel**

```bash
cd reto-final
npx vercel --prod
```

Set all environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `MAKE_WEBHOOK_URL`

- [ ] **Step 2: Test Home Page**

- Hero banner loads with VCL Cap and Gift Subscription spotlights
- Both collection sections render with correct products
- Product images load from Supabase CDN (HD quality)
- All links work

- [ ] **Step 3: Test Catalog Page**

- All 12 products visible
- Filter by collection works (Premium, Fun, Limited)
- Sort by price and name works
- Product cards link to correct detail pages

- [ ] **Step 4: Test Product Detail Page**

- Product info displays correctly
- Variant selector works (sizes, laptop dimensions)
- "Add to Cart" adds product with selected variant
- Cart modal opens after adding
- Limited edition badge shows on VCL Cap
- Related products section shows correct items

- [ ] **Step 5: Test Cart Modal**

- Cart opens/closes from navbar icon
- Items display with correct info
- Quantity +/- works, updates totals
- Remove item works
- Discount code: test valid code (`PLATZI-TEAM-20`) — shows 20% discount
- Discount code: test invalid code — shows error
- Order summary math is correct (subtotal, discount, total)
- Payment method selection works

- [ ] **Step 6: Test Checkout Flow**

- Fill customer name and email
- Click "Place Order"
- Verify order saved in Supabase `orders` table
- Verify Make.com webhook fires
- Verify confirmation email received
- Success screen shows with order number
- Cart clears after order

- [ ] **Step 7: Test Chatbot**

- Widget appears on all pages
- Click opens chat panel
- Greeting message shows
- Ask about a product — get accurate response with correct price
- Ask for a recommendation — get relevant suggestion
- Ask about Platzi courses — get course recommendations
- Ask about something off-topic — get polite redirect

- [ ] **Step 8: Test Mobile Responsiveness**

- All pages render well on mobile
- Cart modal is usable on small screens
- Chatbot widget doesn't overlap important content
- Navigation hamburger menu works

- [ ] **Step 9: Fix any issues found**

Address bugs, broken layouts, or incorrect data discovered during testing.

- [ ] **Step 10: Commit fixes**

```bash
git add reto-final/
git commit -m "fix: address issues found during end-to-end testing"
```

---

## Task 14: README & Final Polish

**Files:**
- Create: `reto-final/README.md`

**Context:** Document the project for the Platzi community presentation.

- [ ] **Step 1: Write README**

Create `reto-final/README.md` covering:

- Project title: "Platzi Store — Reto Final VCL 2026"
- Description of the store
- Live URL (Vercel deployment)
- Screenshots/GIFs of key features
- Tech stack list
- Features list: 12 products, chatbot, order automation, campaign
- Differentiators: Gemini chatbot, Make.com automation
- How to run locally (env vars, npm install, npm run dev)
- Links to campaign assets (video, images)
- Author: Roberto Zuniga

- [ ] **Step 2: Final commit**

```bash
git add reto-final/
git commit -m "docs: add README and final project documentation"
```

- [ ] **Step 3: Push to remote**

```bash
git push origin main
```
