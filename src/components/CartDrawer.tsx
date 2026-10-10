import React from "react";
import { CartItem } from "../types";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const isCartEmpty = cartItems.length === 0;

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Drawer Container */}
      <div id="cart-drawer" className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
            <span className="font-extrabold text-gray-900 text-lg">Your Shopping Cart</span>
            <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button
            id="btn-close-cart"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-950 hover:bg-gray-50 rounded-xl cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isCartEmpty ? (
            <div className="h-3/4 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Explore our catalog and add premium electronics, fashion, and oak desks to your cart!
              </p>
              <button
                id="btn-cart-empty-shop"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm hover:bg-emerald-700 cursor-pointer transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = item.product.discountPrice || item.product.price;
              const hasDiscount = !!item.product.discountPrice;
              const totalItemPrice = (itemPrice * item.quantity).toFixed(2);

              return (
                <div
                  id={`cart-item-${item.product.id}`}
                  key={item.product.id}
                  className="flex gap-3 p-3 border border-gray-150 rounded-xl hover:shadow-xs transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details column */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 capitalize font-medium">{item.product.category}</p>
                    </div>

                    {/* Quantity selectors & pricing */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/50 overflow-hidden">
                        <button
                          id={`btn-cart-minus-${item.product.id}`}
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateQuantity(item.product.id, item.quantity - 1);
                            } else {
                              onRemoveItem(item.product.id);
                            }
                          }}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span id={`cart-qty-${item.product.id}`} className="px-2 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          id={`btn-cart-plus-${item.product.id}`}
                          onClick={() => {
                            if (item.quantity < item.product.stock) {
                              onUpdateQuantity(item.product.id, item.quantity + 1);
                            }
                          }}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-gray-950">${totalItemPrice}</span>
                    </div>
                  </div>

                  {/* Detach single trash action */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      id={`btn-cart-remove-${item.product.id}`}
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions & pricing totals */}
        {!isCartEmpty && (
          <div className="p-4 border-t border-gray-150 bg-gray-50/50 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery Shipping</span>
                <span className="text-emerald-700 font-bold uppercase text-xs">Free</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-200/60 pt-2">
                <span>Total Amount</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="btn-cart-proceed"
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
