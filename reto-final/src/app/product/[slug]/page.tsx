import { notFound } from 'next/navigation'
import { getProductBySlug, products } from '@/lib/products'
import { ProductDetail } from '@/components/product-detail'
import { RelatedProducts } from '@/components/related-products'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return products.map(product => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return { title: 'Product Not Found | Platzi Store' }
  }

  return {
    title: `${product.name} | Platzi Store`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Get related products (same collection, excluding current)
  const relatedProducts = products
    .filter(p => p.collection === product.collection && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen">
      <ProductDetail product={product} />
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  )
}
