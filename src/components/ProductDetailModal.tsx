import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { X, Minus, Plus, ShoppingCart, ShieldCheck, Truck, RefreshCw } from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || "");
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const originalPrice = product.price;
  const currentPrice = product.discountPrice || product.price;
  const totalCost = (currentPrice * quantity).toFixed(2);

  return (
    <div id="product-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Backdrop closer */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Modal Container */}
      <div id="product-detail-content" className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto animate-in scale-in duration-300">
        
        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 border border-gray-100 text-gray-500 hover:text-gray-950 shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-gray-50 flex flex-col justify-between">
          <div className="relative pt-[85%] rounded-xl overflow-hidden bg-white border border-gray-200">
            <img
              src={selectedImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  id={`btn-thumb-${idx}`}
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 bg-white flex-shrink-0 cursor-pointer focus:outline-none ${
                    selectedImage === img ? "border-emerald-600 shadow-sm" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Info & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Category */}
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              {product.category}
            </span>

            {/* Title */}
            <h2 id="modal-product-title" className="text-2xl font-black text-gray-900 tracking-tight leading-tight mb-2">
              {product.title}
            </h2>

            {/* Price Tags */}
            <div className="flex items-baseline gap-2.5 mb-5">
              <span id="modal-product-price" className="text-3xl font-extrabold text-gray-950">
                ${currentPrice}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-4 mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">About the Product</h4>
              <p id="modal-product-desc" className="text-gray-650 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Brand Guarantees */}
            <div className="grid grid-cols-3 gap-2 py-3 px-4 border rounded-xl bg-gray-50/50 mb-6 border-gray-150">
              <div className="flex flex-col items-center text-center">
                <Truck className="h-4 w-4 text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold text-gray-700">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center border-x border-gray-200">
                <RefreshCw className="h-4 w-4 text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold text-gray-700">30 Day Return</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="h-4 w-4 text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold text-gray-700">Official Warranty</span>
              </div>
            </div>
          </div>

          <div>
            {/* Stock Level Warning */}
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="font-medium text-gray-650">Availability Status</span>
              {isOutOfStock ? (
                <span className="text-red-750 font-bold bg-red-50 px-2 py-0.5 rounded-lg">Out of stock</span>
              ) : (
                <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">
                  {product.stock} units in stock
                </span>
              )}
            </div>

            {/* Interactive Quantity Selector & Cart Button */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-5">
                <span className="text-sm font-semibold text-gray-700">Select Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 overflow-hidden">
                  <button
                    id="btn-qty-minus"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="p-2 px-3 text-gray-600 hover:bg-gray-150 disabled:opacity-40 cursor-pointer focus:outline-none"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span id="qty-indicator" className="w-10 text-center font-bold text-gray-850 text-sm">
                    {quantity}
                  </span>
                  <button
                    id="btn-qty-plus"
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock}
                    className="p-2 px-3 text-gray-600 hover:bg-gray-150 disabled:opacity-40 cursor-pointer focus:outline-none"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Total price simulator logic and add to cart */}
            {isOutOfStock ? (
              <button
                id="btn-modal-add-disabled"
                disabled
                className="w-full py-3.5 bg-gray-150 border border-gray-250 text-gray-400 font-bold rounded-xl text-center cursor-not-allowed"
              >
                No Stock Available
              </button>
            ) : (
              <button
                id="btn-modal-add-cart"
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart • ${totalCost}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
