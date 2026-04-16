export interface Product {
  id: string
  name: string
  nameEs: string
  slug: string
  description: string
  descriptionEs: string
  price: number
  image: string
  images: string[]
  collection: 'premium' | 'fun' | 'limited'
  variants?: string[]
  featured?: boolean
  badges: string[] | null
  badge?: string
  badgeEs?: string
}

const IMG = "https://vrilcvnfwnjsmlkjmvol.supabase.co/storage/v1/object/public/product-images"

export const products: Product[] = [
  // Premium Collection
  {
    id: "1",
    name: "The Deployer Hoodie",
    nameEs: "Hoodie El Deployer",
    slug: "platzi-premium-hoodie",
    description: "Clean, minimal Platzi logo embroidered on premium heavyweight cotton. Dark tones, tailored fit. For those who deploy on Fridays.",
    descriptionEs: "Logo Platzi bordado en algod\u00f3n premium de alto gramaje. Tonos oscuros, corte ajustado. Para los que hacen deploy los viernes.",
    price: 89.99,
    image: `${IMG}/hoodie.png`,
    images: [`${IMG}/hoodie.png`],
    collection: "premium",
    variants: ["S", "M", "L", "XL", "XXL"],
    featured: true,
    badges: null,
    badge: "Best Seller",
    badgeEs: "M\u00e1s Vendido",
  },
  {
    id: "2",
    name: "The Clean Code Tee",
    nameEs: "Camiseta C\u00f3digo Limpio",
    slug: "platzi-essential-tshirt",
    description: "Soft fabric with subtle Platzi branding. Premium fit for everyday wear. As clean as your code should be.",
    descriptionEs: "Tela suave con branding sutil de Platzi. Corte premium para el d\u00eda a d\u00eda. Tan limpia como tu c\u00f3digo deber\u00eda ser.",
    price: 39.99,
    image: `${IMG}/tshirt.png`,
    images: [`${IMG}/tshirt.png`],
    collection: "premium",
    variants: ["S", "M", "L", "XL", "XXL"],
    featured: true,
    badges: null,
  },
  {
    id: "3",
    name: "La Funda Full Stack",
    nameEs: "La Funda Full Stack",
    slug: "platzi-laptop-sleeve",
    description: "Padded neoprene sleeve with embossed Platzi logo. Protects your machine like you protect your main branch.",
    descriptionEs: "Funda acolchada de neopreno con logo Platzi en relieve. Protege tu m\u00e1quina como proteges tu rama main.",
    price: 49.99,
    image: `${IMG}/computer-sleve.png`,
    images: [`${IMG}/computer-sleve.png`],
    collection: "premium",
    variants: ['13"', '15"', '16"'],
    badges: null,
  },
  {
    id: "4",
    name: "Hydrate & Iterate Bottle",
    nameEs: "Botella Hidrata & Itera",
    slug: "platzi-water-bottle",
    description: "Matte black finish with minimalist Platzi mark. Double-walled, keeps drinks cold 24hrs. Stay hydrated between commits.",
    descriptionEs: "Acabado negro mate con logo minimalista Platzi. Doble pared, mantiene bebidas fr\u00edas 24hrs. Hidr\u00e1tate entre commits.",
    price: 29.99,
    image: `${IMG}/bottle.png`,
    images: [`${IMG}/bottle.png`],
    collection: "premium",
    badges: null,
  },
  {
    id: "5",
    name: "El Cuaderno del Founder",
    nameEs: "El Cuaderno del Founder",
    slug: "platzi-developer-notebook",
    description: "Hardcover dot grid notebook with Platzi green accent spine. 192 pages to sketch your next unicorn.",
    descriptionEs: "Cuaderno tapa dura con grilla de puntos y lomo verde Platzi. 192 p\u00e1ginas para dise\u00f1ar tu pr\u00f3ximo unicornio.",
    price: 24.99,
    image: `${IMG}/notebook.png`,
    images: [`${IMG}/notebook.png`],
    collection: "premium",
    badges: null,
  },
  // Fun Collection
  {
    id: "6",
    name: "Medias CEO",
    nameEs: "Medias CEO",
    slug: "platzi-code-socks",
    description: "Colorful patterns with Platzi icons and coding motifs. Walk like a CEO, code like a senior.",
    descriptionEs: "Patrones coloridos con \u00edconos Platzi y motivos de c\u00f3digo. Camina como CEO, codea como senior.",
    price: 14.99,
    image: `${IMG}/socks.png`,
    images: [`${IMG}/socks.png`],
    collection: "fun",
    variants: ["S/M", "L/XL"],
    badges: null,
  },
  {
    id: "7",
    name: "Sticker Bomb Pack",
    nameEs: "Pack Sticker Bomb",
    slug: "platzi-stickers-pack",
    description: "Set of 12 premium vinyl stickers. Memes, dev culture, and Platzi pride for your laptop.",
    descriptionEs: "Set de 12 stickers de vinilo premium. Memes, cultura dev y orgullo Platzi para tu laptop.",
    price: 9.99,
    image: `${IMG}/stickers.png`,
    images: [`${IMG}/stickers.png`],
    collection: "fun",
    badges: null,
    badge: "Popular",
    badgeEs: "Popular",
  },
  {
    id: "8",
    name: "Chanclas Modo Debug",
    nameEs: "Chanclas Modo Debug",
    slug: "platzi-cozy-slippers",
    description: "Ultra-soft Platzi-branded slippers for late-night coding sessions. Memory foam for debugging marathons.",
    descriptionEs: "Chanclas ultra suaves con marca Platzi para sesiones nocturnas de c\u00f3digo. Espuma con memoria para maratones de debugging.",
    price: 34.99,
    image: `${IMG}/slippers.png`,
    images: [`${IMG}/slippers.png`],
    collection: "fun",
    variants: ["S", "M", "L", "XL"],
    badges: null,
  },
  {
    id: "9",
    name: "El Enter Destructor",
    nameEs: "El Enter Destructor",
    slug: "giant-enter-key-plushie",
    description: "Oversized Enter key you can slam on your desk. The ultimate stress reliever after a failed deploy.",
    descriptionEs: "Tecla Enter gigante que puedes golpear en tu escritorio. El anti-estr\u00e9s definitivo despu\u00e9s de un deploy fallido.",
    price: 44.99,
    image: `${IMG}/plushi.png`,
    images: [`${IMG}/plushi.png`],
    collection: "fun",
    badges: null,
    badge: "Hot",
    badgeEs: "Fire",
  },
  {
    id: "10",
    name: "Taza Nunca Pares de Codear",
    nameEs: "Taza Nunca Pares de Codear",
    slug: "platzi-coffee-mug",
    description: 'Ceramic mug with "Nunca Pares de Codear" tagline. 350ml of pure motivation.',
    descriptionEs: 'Taza de cer\u00e1mica con la frase "Nunca Pares de Codear". 350ml de pura motivaci\u00f3n.',
    price: 19.99,
    image: `${IMG}/cup.png`,
    images: [`${IMG}/cup.png`],
    collection: "fun",
    badges: null,
  },
  // Limited Edition
  {
    id: "11",
    name: "VCL Championship Cap",
    nameEs: "Gorra VCL Championship",
    slug: "vibe-coders-league-cap",
    description: "Limited edition structured cap with premium embroidered VCL logo. Only available March-April 2026. For champions only.",
    descriptionEs: "Gorra edici\u00f3n limitada con logo VCL bordado premium. Solo disponible marzo-abril 2026. Solo para campeones.",
    price: 54.99,
    image: `${IMG}/cap.png`,
    images: [`${IMG}/cap.png`],
    collection: "limited",
    variants: ["One Size"],
    featured: true,
    badges: ["Limited Edition", "March-April 2026"],
    badge: "Limited Edition",
    badgeEs: "Edici\u00f3n Limitada",
  },
  {
    id: "12",
    name: "Nunca Pares de Aprender — Gift",
    nameEs: "Nunca Pares de Aprender — Regalo",
    slug: "nunca-pares-gift-subscription",
    description: "Gift a 1-month Platzi subscription. Because the best gift is knowledge. Nunca pares.",
    descriptionEs: "Regala 1 mes de suscripci\u00f3n a Platzi. Porque el mejor regalo es el conocimiento. Nunca pares.",
    price: 49.99,
    image: `${IMG}/membership.png`,
    images: [`${IMG}/membership.png`],
    collection: "limited",
    badges: ["Gift"],
    badge: "Gift",
    badgeEs: "Regalo",
  },
  // Premium — Book
  {
    id: "13",
    name: "Control",
    nameEs: "Control",
    slug: "platzi-playbook",
    description: "The radical guide to mastering your life, your future, and your wealth.",
    descriptionEs: "La gu\u00eda radical para dominar tu vida, tu futuro y tu riqueza.",
    price: 34.99,
    image: `${IMG}/book.png`,
    images: [`${IMG}/book.png`],
    collection: "premium",
    badges: null,
    badge: "New",
    badgeEs: "Nuevo",
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

export function getLocalizedName(product: Product, locale: string): string {
  return locale === "es" ? product.nameEs : product.name
}

export function getLocalizedDescription(product: Product, locale: string): string {
  return locale === "es" ? product.descriptionEs : product.description
}

export function getLocalizedBadge(product: Product, locale: string): string | undefined {
  if (!product.badge) return undefined
  return locale === "es" ? (product.badgeEs || product.badge) : product.badge
}
