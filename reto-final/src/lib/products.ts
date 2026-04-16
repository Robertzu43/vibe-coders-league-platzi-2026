export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  images: string[]
  collection: 'premium' | 'fun' | 'limited'
  variants?: string[]
  featured?: boolean
  badges: string[] | null
  badge?: string
}

export const products: Product[] = [
  // Premium Collection
  {
    id: "1",
    name: "Platzi Premium Hoodie",
    slug: "platzi-premium-hoodie",
    description: "Clean, minimal Platzi logo embroidered on premium heavyweight cotton. Dark tones, tailored fit.",
    price: 89.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "premium",
    variants: ["S", "M", "L", "XL", "XXL"],
    featured: true,
    badges: null,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Platzi Essential T-Shirt",
    slug: "platzi-essential-tshirt",
    description: "Soft fabric with subtle Platzi branding. Premium fit for everyday wear.",
    price: 39.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "premium",
    variants: ["S", "M", "L", "XL", "XXL"],
    featured: true,
    badges: null,
  },
  {
    id: "3",
    name: "Platzi Laptop Sleeve",
    slug: "platzi-laptop-sleeve",
    description: "Padded neoprene sleeve with embossed Platzi logo. Protects your gear in style.",
    price: 49.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "premium",
    variants: ['13"', '15"', '16"'],
    badges: null,
  },
  {
    id: "4",
    name: "Platzi Water Bottle",
    slug: "platzi-water-bottle",
    description: "Matte black finish with minimalist Platzi mark. Double-walled, keeps drinks cold 24hrs.",
    price: 29.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "premium",
    badges: null,
  },
  {
    id: "5",
    name: "Platzi Developer Notebook",
    slug: "platzi-developer-notebook",
    description: "Hardcover dot grid notebook with Platzi green accent spine. 192 pages of ideas.",
    price: 24.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "premium",
    badges: null,
  },
  // Fun Collection
  {
    id: "6",
    name: "Platzi Code Socks",
    slug: "platzi-code-socks",
    description: "Colorful patterns with Platzi icons and coding motifs. Comfort meets community.",
    price: 14.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "fun",
    variants: ["S/M", "L/XL"],
    badges: null,
  },
  {
    id: "7",
    name: "Platzi Stickers Pack",
    slug: "platzi-stickers-pack",
    description: "Set of 12 premium vinyl stickers with Platzi memes and dev culture references.",
    price: 9.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "fun",
    badges: null,
    badge: "Popular",
  },
  {
    id: "8",
    name: "Platzi Cozy Slippers",
    slug: "platzi-cozy-slippers",
    description: "Ultra-soft Platzi-branded slippers for late-night coding sessions. Memory foam insole.",
    price: 34.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "fun",
    variants: ["S", "M", "L", "XL"],
    badges: null,
  },
  {
    id: "9",
    name: "Giant Enter Key Plushie",
    slug: "giant-enter-key-plushie",
    description: "Oversized Enter key you can slam on your desk. The ultimate debugging stress reliever.",
    price: 44.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "fun",
    badges: null,
    badge: "Hot",
  },
  {
    id: "10",
    name: "Platzi Coffee Mug",
    slug: "platzi-coffee-mug",
    description: 'Ceramic mug with fun illustrations and "Nunca Pares de Codear" tagline. 350ml.',
    price: 19.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "fun",
    badges: null,
  },
  // Limited Edition
  {
    id: "11",
    name: "Vibe Coders League Cap",
    slug: "vibe-coders-league-cap",
    description: "Limited edition structured cap with premium embroidered VCL logo. Only available March-April 2026.",
    price: 54.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "limited",
    variants: ["One Size"],
    featured: true,
    badges: ["Limited Edition", "March-April 2026"],
    badge: "Limited Edition",
  },
  {
    id: "12",
    name: "Nunca Pares de Aprender — Gift Subscription",
    slug: "nunca-pares-gift-subscription",
    description: "Gift a 1-month Platzi subscription to a friend or family member. Because learning never stops.",
    price: 49.99,
    image: "/placeholder-product.svg",
    images: ["/placeholder-product.svg"],
    collection: "limited",
    badges: ["Gift"],
    badge: "Gift",
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}

export function getProductsByCollection(collection: 'premium' | 'fun' | 'limited'): Product[] {
  return products.filter(p => p.collection === collection)
}
