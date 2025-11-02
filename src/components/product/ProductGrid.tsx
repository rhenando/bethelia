import ProductCard from "./ProductCard";
import { products } from "../../../data/products";

export default function ProductGrid() {
  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </section>
  );
}
