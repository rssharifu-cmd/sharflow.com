import React from "react";
import { Product } from "../types";
import { ShoppingCart, Eye, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const hasDiscount = !!product.discountPrice;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      id={`prod-card-${product.id}`}
      className="group bg-white rounded-2xl border border-gray-150 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Target container for product image */}
      <div className="relative pt-[100%] overflow-hidden bg-gray-50 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600"}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
              <Tag className="h-3 w-3" />
              Sale
            </span>
          )}
          {isOutOfStock ? (
            <span className="bg-gray-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
              Only {product.stock} Left!
            </span>
          ) : null}
        </div>

        {/* Quick View Button Overlay on Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            id={`btn-quickview-${product.id}`}
            className="bg-white/95 backdrop-blur-xs text-gray-900 border border-gray-100 rounded-xl px-4 py-2 text-xs font-semibold shadow-md hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
          >
            <Eye className="h-4 w-4" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase mb-1.5">
          {product.category}
        </span>

        {/* Title */}
        <button
          id={`title-link-${product.id}`}
          onClick={() => onViewDetails(product)}
          className="text-left text-base font-bold text-gray-900 hover:text-emerald-700 transition-colors line-clamp-1 mb-1 focus:outline-none cursor-pointer"
        >
          {product.title}
        </button>

        {/* Description snippet */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Price and Cart Button area */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-gray-900">
                  ${product.discountPrice}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-lg font-extrabold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          <button
            id={`btn-add-cart-${product.id}`}
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
              isOutOfStock
                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700 shadow-xs"
            }`}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
