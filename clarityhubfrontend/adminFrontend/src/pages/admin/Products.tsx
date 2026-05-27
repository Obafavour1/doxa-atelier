import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Package, 
  MoreVertical,
  Edit3,
  Trash2,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  X,
  CheckSquare,
  Star
} from "lucide-react";
import { productService } from "../../services/product.service";
import type { Product } from "../../types/api";
import { toast } from "react-hot-toast";

const StockIndicator = ({ stock }: { stock: number }) => {
  const isLow = stock <= 10 && stock > 0;
  const isOut = stock === 0;

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-[var(--surface-hover)] overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${isOut ? 'bg-rose-500 w-0' : isLow ? 'bg-amber-500 w-1/4' : 'bg-rose-500 w-full'}`}
          style={{ width: `${Math.min(100, (stock / 50) * 100)}%` }}
        />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${isOut ? 'text-rose-500' : isLow ? 'text-amber-500' : 'text-[var(--text-tertiary)]'}`}>
        {isOut ? 'Out of Stock' : stock}
      </span>
    </div>
  );
};

const AdminProducts = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'low-stock'>('all');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let data = [];
      if (filterMode === 'low-stock') {
        data = await productService.getLowStock();
      } else {
        data = await productService.getAll();
      }
      setProducts(data);
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterMode]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(products.map(p => p.id || (p as any)._id).filter(Boolean));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleDeleteParams = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.delete(id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleBulkDelete = async () => {
    if(selectedIds.size === 0 || !window.confirm(`Delete ${selectedIds.size} products?`)) return;
    try {
      await productService.bulkDelete(Array.from(selectedIds));
      toast.success(`${selectedIds.size} products deleted`);
      fetchProducts();
    } catch {
      toast.error("Failed to execute bulk delete");
    }
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: 0, stock: 0, category: "", image: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id || (editingProduct as any)._id, formData);
        toast.success("Product updated");
      } else {
        await productService.create(formData);
        toast.success("Product created");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch {
      toast.error("Failed to save product");
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await productService.toggleFeatured(id);
      setProducts(products.map(p => (p.id || (p as any)._id) === id ? { ...p, isFeatured: !currentStatus } : p));
      toast.success("Featured status updated");
    } catch (error) {
      toast.error("Failed to toggle featured status");
    }
  };

  return (
    <div className="space-y-8 relative">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
            <Package size={14} className="text-[var(--primary)]" /> Inventory
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">Product Catalog</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Create, edit, and organize your store's merchandising.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="admin-btn bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
             <Upload size={18} /> Bulk Import
           </button>
           <button onClick={openNewProductModal} className="admin-btn bg-rose-500 text-black border border-rose-500 hover:bg-rose-400 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
             <Plus size={18} /> Add New Product
           </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-[var(--bg-sidebar)]/30 rounded-2xl border border-[var(--border-subtle)]">
         <div className="flex items-center gap-3 flex-grow max-w-2xl px-2">
            <div className="flex items-center gap-2 bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-subtle)]">
               <button 
                 onClick={() => setFilterMode('all')}
                 className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterMode === 'all' ? 'bg-[var(--primary)] text-black' : 'text-[var(--text-secondary)] hover:text-white'}`}
               >
                 All
               </button>
               <button 
                 onClick={() => setFilterMode('low-stock')}
                 className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterMode === 'low-stock' ? 'bg-rose-500 text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}
               >
                 Low Stock
               </button>
            </div>
            <div className="w-[1px] h-6 bg-[var(--border-subtle)] mx-1"></div>
            <div className="relative flex-grow group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within:text-[var(--primary)] transition-colors" size={16} />
               <input 
                 type="text" 
                 placeholder="Search products..." 
                 className="w-full outline-none bg-transparent pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] transition-all"
               />
            </div>
         </div>
         <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 px-3 animate-fade-in">
                <span className="text-xs font-bold text-rose-500">{selectedIds.size} Selected</span>
                <button onClick={handleBulkDelete} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">
                   <Trash2 size={16} />
                </button>
              </div>
            )}
            <div className="w-[1px] h-6 bg-[var(--border-subtle)] mr-1"></div>
            <div className="flex items-center bg-[var(--bg-main)] rounded-xl border border-[var(--border-subtle)] p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[var(--primary)] text-black shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[var(--primary)] text-black shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>
         </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[var(--border-subtle)] rounded-3xl bg-[var(--bg-sidebar)]/20">
          <Package className="mx-auto text-[var(--text-tertiary)] mb-4" size={48} />
          <h3 className="text-lg font-bold">No products found</h3>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Get started by creating your first product.</p>
          <button onClick={openNewProductModal} className="mt-6 px-6 py-2 bg-rose-500 text-black font-bold rounded-xl hover:bg-rose-400">Create Product</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => {
            const pId = product.id || (product as any)._id;
            const isSelected = selectedIds.has(pId);
            return (
            <div key={pId} className={`admin-card group hover:scale-[1.02] active:scale-[0.98] transition-all relative ${isSelected ? 'ring-2 ring-rose-500' : ''}`}>
              <div className="absolute z-10 top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => handleSelect(pId)}
                  className="w-5 h-5 rounded border-gray-600 text-rose-500 focus:ring-rose-500/20 bg-black/50 cursor-pointer"
                />
              </div>
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-[calc(var(--radius-lg)-1px)] bg-[var(--bg-sidebar)]">
                <img src={product.image || `https://placehold.co/400x300/png?text=${encodeURIComponent(product.name)}`} className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-110 opacity-70' : 'group-hover:scale-110'}`} />
                
                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button onClick={() => openEditModal(product)} className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[var(--primary)] hover:text-black shadow-lg">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDeleteParams(pId)} className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[var(--danger)] shadow-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                   <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-white tracking-widest">
                     {product.category}
                   </span>
                </div>
                {product.isFeatured && (
                  <div className="absolute top-4 right-4 translate-x-0 opacity-100 group-hover:opacity-0 transition-all">
                     <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg"><Star size={14} fill="currentColor" /></span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] leading-tight truncate">{product.name}</h3>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-1 truncate">ID: {pId}</p>
                </div>
                <div className="flex items-center justify-between align-baseline">
                   <p className="text-xl font-black text-rose-500">${product.price.toLocaleString()}</p>
                   <StockIndicator stock={product.stock} />
                </div>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-[var(--bg-sidebar)]/30 border-b border-[var(--border-subtle)] text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                   <th className="px-6 py-4 w-12">
                     <input 
                       type="checkbox" 
                       checked={selectedIds.size === products.length && products.length > 0}
                       onChange={handleSelectAll}
                       className="w-4 h-4 rounded border-gray-600 text-rose-500 bg-transparent cursor-pointer"
                     />
                   </th>
                   <th className="px-4 py-4">Product</th>
                   <th className="px-4 py-4">Category</th>
                   <th className="px-4 py-4">Price</th>
                   <th className="px-4 py-4">Stock</th>
                   <th className="px-4 py-4 text-center">Featured</th>
                   <th className="px-4 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                 {products.map(product => {
                    const pId = product.id || (product as any)._id;
                    const isSelected = selectedIds.has(pId);
                    return (
                   <tr key={pId} className={`hover:bg-[var(--surface-hover)] transition-all ${isSelected ? 'bg-rose-500/5' : ''}`}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleSelect(pId)}
                          className="w-4 h-4 rounded border-gray-600 text-rose-500 bg-transparent cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-[var(--border-subtle)] shrink-0">
                             <img src={product.image || `https://placehold.co/100x100/png?text=${encodeURIComponent(product.name)}`} className="w-full h-full object-cover" />
                           </div>
                           <div className="min-w-0">
                             <p className="text-sm font-bold text-[var(--text-primary)] truncate">{product.name}</p>
                             <p className="text-[10px] text-[var(--text-tertiary)] font-bold truncate">{pId}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-[var(--text-secondary)]">{product.category}</td>
                      <td className="px-4 py-4 text-sm font-black text-[var(--text-primary)]">${product.price.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <StockIndicator stock={product.stock} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={() => toggleFeatured(pId, product.isFeatured)} 
                          className={`p-1.5 rounded-lg transition-colors ${product.isFeatured ? 'text-amber-500 hover:bg-amber-500/10' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                        >
                          <Star size={16} fill={product.isFeatured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => openEditModal(product)} className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-[var(--primary)] hover:text-black transition-colors border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                             <Edit3 size={14} />
                           </button>
                           <button onClick={() => handleDeleteParams(pId)} className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-rose-500 hover:text-white transition-colors border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                             <Trash2 size={14} />
                           </button>
                        </div>
                      </td>
                   </tr>
                 )})}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* Pagination View */}
      {!loading && products.length > 0 && (
        <footer className="flex items-center justify-between pt-4">
          <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Showing {products.length} items</p>
          <div className="flex items-center gap-3">
              <button className="admin-btn bg-[var(--bg-sidebar)] border border-[var(--border-subtle)] text-[var(--text-secondary)] px-3 text-xs opacity-50 cursor-not-allowed">
                <ChevronLeft size={16} /> Previous
              </button>
              <button className="admin-btn bg-[var(--bg-sidebar)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-3 text-xs opacity-50 cursor-not-allowed">
                Next <ChevronRight size={16} />
              </button>
          </div>
        </footer>
      )}

      {/* Modal / Slider */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md h-full bg-[#0A0A0A] border-l border-white/10 flex flex-col animate-slide-left shadow-2xl">
             <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
               <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "New Product"}</h2>
               <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                 <X size={20} className="text-gray-400 hover:text-white" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
               <form id="productForm" onSubmit={handleSaveProduct} className="space-y-5">
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Product Name</label>
                   <input required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500/50 outline-none transition-colors" placeholder="e.g. Ergonomic Keyboard" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Price ($)</label>
                     <input required type="number" step="0.01" min="0" value={formData.price} onChange={(e)=>setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500/50 outline-none transition-colors" placeholder="0.00" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Stock qty</label>
                     <input required type="number" min="0" value={formData.stock} onChange={(e)=>setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500/50 outline-none transition-colors" placeholder="0" />
                   </div>
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Category</label>
                   <input required value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500/50 outline-none transition-colors" placeholder="e.g. Electronics, Furniture..." />
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Description</label>
                   <textarea required rows={4} value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500/50 outline-none transition-colors resize-none" placeholder="Provide product details..." />
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Image URL (Optional)</label>
                   <input type="url" value={formData.image} onChange={(e)=>setFormData({...formData, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500/50 outline-none transition-colors" placeholder="https://..." />
                 </div>
               </form>
             </div>

             <div className="p-6 border-t border-white/10 bg-black/20 flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" form="productForm" className="flex-1 px-4 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-bold transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
