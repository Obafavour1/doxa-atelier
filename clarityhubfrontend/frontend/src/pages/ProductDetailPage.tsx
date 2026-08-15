import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ShoppingCart, 
  ChevronLeft, 
  ShieldCheck, 
  Minus,
  Plus,
  Gift,
  PackageCheck,
} from "lucide-react";
import { productService } from "../services/product.service";
import { useAddToCart } from "../features/cart/api/hooks";
import type { Product } from "../types/api";
import { toast } from "react-hot-toast";
import Seo from "../shared/components/Seo";
import LoadingSpinner from "../shared/components/LoadingSpinner";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const addToCartMutation = useAddToCart();

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const data = await productService.getBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (product) {
      const productId = product._id || product.id;
      try {
        for (let count = 0; count < quantity; count += 1) {
          await addToCartMutation.mutateAsync(productId);
        }
        toast.success(`${quantity} ${quantity === 1 ? "item" : "items"} added to your cart`);
      } catch {
        toast.error("Failed to add product to cart");
      }
    }
  };

  if (loading) return <LoadingSpinner label="Unwrapping this gift" />;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-2xl font-bold">Product not found</h1>
    <Link to="/" className="text-rose-500 hover:underline">Back to Shop</Link>
  </div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <Seo title={product.name} description={product.description || `Shop ${product.name}, thoughtfully curated by DOXA Atelier.`} image={product.image} type="product" />
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft size={20} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[var(--petal)] text-[var(--primary)]"><Gift size={42} /><span className="text-sm font-semibold">Image coming soon</span></div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider mb-4">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{product.name}</h1>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">Live catalogue item · {product.stock} currently in stock</p>
          </div>

          <p className="text-3xl font-bold text-rose-400 tracking-tight">$ {product.price.toFixed(2)}</p>

          <p className="text-gray-400 leading-relaxed text-lg">{product.description}</p>

          <div className="space-y-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-3 text-gray-400 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="flex-1 flex items-center justify-center gap-3 bg-rose-500 text-black font-black py-4 rounded-2xl hover:bg-rose-400 transition-all shadow-xl shadow-rose-500/20 disabled:opacity-50"
              >
                <ShoppingCart size={24} /> {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <ShieldCheck size={24} className="text-rose-500" />
                <div className="text-left">
                  <p className="text-sm font-bold">Secure checkout</p>
                  <p className="text-[10px] text-gray-400">Choose Stripe or Paystack</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <PackageCheck size={24} className="text-rose-500" />
                <div className="text-left">
                  <p className="text-sm font-bold">Live availability</p>
                  <p className="text-[10px] text-gray-400">{product.stock} available to order</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products would go here */}
    </div>
  );
};

export default ProductDetailPage;
