import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

import productTshirt from '@/assets/product-tshirt.png';
import productMug from '@/assets/product-mug.png';
import productPhonecase from '@/assets/product-phonecase.png';
import productTotebag from '@/assets/product-totebag.png';
import productHoodie from '@/assets/product-hoodie.png';
import productStickers from '@/assets/product-stickers.png';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
}

const products: Product[] = [
  { id: 'tshirt-geo', name: 'Geometric Art T-Shirt', price: 499, originalPrice: 799, image: productTshirt, rating: 4.8, reviews: 124, badge: 'Bestseller', category: 'T-Shirts' },
  { id: 'mug-creative', name: 'Creative Print Mug', price: 299, originalPrice: 449, image: productMug, rating: 4.6, reviews: 89, category: 'Mugs' },
  { id: 'phonecase-art', name: 'Phoenix Art Phone Case', price: 399, originalPrice: 599, image: productPhonecase, rating: 4.9, reviews: 156, badge: 'Hot', category: 'Phone Cases' },
  { id: 'totebag-splash', name: 'Splash Art Tote Bag', price: 349, originalPrice: 499, image: productTotebag, rating: 4.7, reviews: 67, category: 'Bags' },
  { id: 'hoodie-street', name: 'Street Art Hoodie', price: 899, originalPrice: 1299, image: productHoodie, rating: 4.8, reviews: 203, badge: 'New', category: 'Hoodies' },
  { id: 'stickers-pack', name: 'Fun Sticker Pack', price: 149, originalPrice: 249, image: productStickers, rating: 4.5, reviews: 312, category: 'Stickers' },
];

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-foreground">
          {product.badge}
        </span>
      )}
      {discount > 0 && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-price px-2.5 py-1 text-[10px] font-bold text-price-foreground">
          -{discount}%
        </span>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{product.category}</span>
        <h3 className="mt-1 text-sm font-semibold leading-tight">{product.name}</h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }, (_, j) => (
            <Star key={j} size={11} className={j < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'} />
          ))}
          <span className="ml-1 text-[10px] text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price & CTA */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-price">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-[11px] font-bold text-accent-foreground transition-transform hover:scale-105"
          >
            <ShoppingCart size={13} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const BestSellers = () => (
  <section className="py-20" id="products">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-display font-bold uppercase tracking-widest text-primary">
          Top Picks
        </span>
        <h2 className="font-display text-3xl font-bold mb-3">Best <span className="text-gradient-brand">Selling</span> Products</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Our most loved designs — premium quality, vibrant prints, and unbeatable prices.</p>
      </motion.div>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <a href="/services" className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary">
          View All Products
        </a>
      </div>
    </div>
  </section>
);

export default BestSellers;
