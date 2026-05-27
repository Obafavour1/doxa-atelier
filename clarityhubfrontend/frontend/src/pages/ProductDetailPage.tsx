import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ShoppingCart, 
  ChevronLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  Minus,
  Plus,
  Heart
} from "lucide-react";
import { productService } from "../services/product.service";
import { useAddToCart } from "../features/cart/api/hooks";
import type { Product } from "../types/api";
import { toast } from "react-hot-toast";

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

  const handleAddToCart = () => {
    if (product) {
      addToCartMutation.mutate(product.id, {
        onSuccess: () => toast.success("Added to cart"),
        onError: () => toast.error("Failed to add to cart")
      });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-2xl font-bold">Product not found</h1>
    <Link to="/" className="text-rose-500 hover:underline">Back to Shop</Link>
  </div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft size={20} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">
            <img 
              src={product.image || "https://placehold.co/600x600/png"} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-rose-500 transition-colors">
                <img src={product.image || "https://placehold.co/150x150/png"} alt={`View ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider mb-4">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill={i <= 4 ? "currentColor" : "none"} />)}
              </div>
              <span className="text-gray-400 text-sm">(4.8 • 120 Reviews)</span>
            </div>
          </div>

          <p className="text-3xl font-bold text-rose-400 tracking-tight">$ {product.price.toFixed(2)}</p>

          <p className="text-gray-400 leading-relaxed text-lg">
            {product.description || "Experience premium quality and sustainable fashion with this beautifully crafted piece. Designed for both comfort and style, it features eco-friendly materials that feel great and last long."}
          </p>

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
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-gray-400 hover:text-white transition-colors"
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

              <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-rose-500 transition-all">
                <Heart size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <ShieldCheck size={24} className="text-rose-500" />
                <div className="text-left">
                  <p className="text-sm font-bold">2 Year Warranty</p>
                  <p className="text-[10px] text-gray-400">Full protection included</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <Truck size={24} className="text-rose-500" />
                <div className="text-left">
                  <p className="text-sm font-bold">Free Shipping</p>
                  <p className="text-[10px] text-gray-400">On all orders over $100</p>
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
