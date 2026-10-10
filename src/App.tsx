import React, { useState, useEffect } from "react";
import { Product, CartItem, Order, User, ShippingAddress, PaymentMethod } from "./types";
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredOrders,
  saveStoredOrders,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  initializeStorage,
} from "./data/storage";

// Sub-components
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CartDrawer from "./components/CartDrawer";
import AuthModal from "./components/AuthModal";
import CheckoutPage from "./components/CheckoutPage";
import UserProfile from "./components/UserProfile";
import AdminPanel from "./components/AdminPanel";

// Icons
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Truck,
  HelpCircle,
  Clock,
  Heart,
  Tag,
  ShieldCheck,
  PackageOpen,
} from "lucide-react";

export default function App() {
  // Initialize standard localStorage database keys on load
  useEffect(() => {
    initializeStorage();
  }, []);

  // Main global states
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredCurrentUser());

  // Navigation states
  const [activeTab, setActiveTab] = useState<string>("shop"); // shop | profile | admin | checkout | order-confirmed
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Shopping cart persistence state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const data = localStorage.getItem("sharflow_cart");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  });

  // Modal display overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  // Checkout post-order state
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);

  // Sync cart shifts
  useEffect(() => {
    localStorage.setItem("sharflow_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Dynamically compute the set of categories based on existing products in our catalog, so users can add custom ones
  const categories = React.useMemo(() => {
    const list = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(list)];
  }, [products]);

  // Cart Operation Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Enforce stock bounds
        const computed = existing.quantity + quantity;
        const validQty = Math.min(computed, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: validQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
    // Open cart automatically when adding as feedback
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleLogout = () => {
    saveStoredCurrentUser(null);
    setCurrentUser(null);
    setActiveTab("shop");
  };

  // Checkout Placement Handler
  const handlePlaceOrder = (address: ShippingAddress, payment: PaymentMethod) => {
    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce((acc, item) => {
      const price = item.product.discountPrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);

    const newOrder: Order = {
      id: "ord-" + Math.floor(Math.random() * 900000 + 100000),
      userEmail: address.email,
      items: [...cartItems],
      totalAmount: subtotal,
      shippingAddress: address,
      paymentMethod: payment,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    // 1. Save order
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    // 2. Reduce product stocks in catalog
    const updatedProducts = products.map((prod) => {
      const match = cartItems.find((item) => item.product.id === prod.id);
      if (match) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - match.quantity),
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);

    // 3. Clear shopping cart
    setCartItems([]);
    setLatestPlacedOrder(newOrder);
    setActiveTab("order-confirmed");
  };

  // Filter products by search terms and list categories
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = filteredProducts.filter((p) => p.isFeatured || p.price > 100).slice(0, 4);

  return (
    <div id="sharflow-root" className="min-h-screen flex flex-col bg-slate-50 text-gray-800 antialiased font-sans">
      {/* 1. Universal Store Header Navigation */}
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentSearch={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 2. Main content page routing */}
      <main className="flex-grow">
        
        {/* SHOP CATALOG PAGE (HOME SCREEN) */}
        {activeTab === "shop" && (
          <div id="shop-catalog-view" className="space-y-12">
            
            {/* Promo Hero Core Banner */}
            <div id="hero-banner" className="relative bg-neutral-950 text-white overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
              <div className="absolute inset-0 opacity-40">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
                  alt="Fine e-commerce background"
                  className="w-full h-full object-cover grayscale scale-105"
                />
              </div>

              {/* Text Area */}
              <div className="relative max-w-4xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  Exclusive Summer Sale Live
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight uppercase font-sans">
                  Sharflow Premium <br />
                  <span className="text-emerald-500">Aesthetic Store</span>
                </h1>
                
                <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
                  Engineered with perfection. Experience absolute hi-fidelity acoustics, luxury chronographs, tenkeyless brown switch typing, or sustainably sourced solid oak desks. Buy tomorrow's gear today.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <a
                    id="btn-hero-browse"
                    href="#shop-catalog"
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-sm transition-all text-center uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    View Collection Catalog
                    <ArrowRight className="h-4 w-4" />
                  </a>

                  {!currentUser && (
                    <button
                      id="btn-hero-register"
                      onClick={() => setIsAuthOpen(true)}
                      className="w-full sm:w-auto px-6 py-3 bg-transparent border border-gray-500 hover:border-white hover:bg-white/10 text-white font-bold rounded-xl text-center text-sm transition-all uppercase tracking-wide cursor-pointer"
                    >
                      Join Sharflow Club
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Core Product Catalog Selector Section */}
            <div id="shop-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
              
              {/* Category selector row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-gray-150">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Explore Our Inventory</h2>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Premium curated designer commodities</p>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {categories.map((cat) => (
                    <button
                      id={`cat-btn-${cat}`}
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex-shrink-0 cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-55"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Catalog grid products */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
                  <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No matching products found</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mb-4">
                    We couldn't locate any products matching "{searchQuery}" under "{selectedCategory}" category.
                  </p>
                  <button
                    id="btn-clear-search-zero"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl text-xs hover:bg-emerald-700 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 scroll-mt-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={handleAddToCart}
                      onViewDetails={setActiveDetailProduct}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Featured Section Banner details */}
            {searchQuery === "" && selectedCategory === "All" && (
              <div className="bg-emerald-50/45 py-12 border-y border-emerald-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-10">
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 rounded-full px-2.5 py-1 mb-2 inline-block">Best Sellers</span>
                    <h2 className="text-3.5xl font-black text-gray-900 tracking-tight">Popular at Sharflow Store</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {featuredProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onAddToCart={handleAddToCart}
                        onViewDetails={setActiveDetailProduct}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECURE CHECKOUT PAGE */}
        {activeTab === "checkout" && (
          <CheckoutPage
            cartItems={cartItems}
            userEmail={currentUser?.email || ""}
            onPlaceOrder={handlePlaceOrder}
            onCancel={() => setActiveTab("shop")}
          />
        )}

        {/* ORDER CONFIRMATION PAGE RECEIPT DISPLAY */}
        {activeTab === "order-confirmed" && latestPlacedOrder && (
          <div id="order-confirmed-view" className="max-w-3xl mx-auto px-4 py-16 text-center animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-150 p-8 md:p-12 shadow-2xl space-y-6">
              
              {/* Checkcircle illustration */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-9 w-9 stroke-[2.5]" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Order Confirmed!</h1>
                <p className="text-sm font-semibold text-emerald-700 mt-1">
                  Thank you for shopping with Sharflow, {latestPlacedOrder.shippingAddress.fullName}!
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  We've sent a detailed shipping reservation invoice receipt to <span className="font-bold text-gray-700">{latestPlacedOrder.shippingAddress.email}</span>
                </p>
              </div>

              {/* Order reference block */}
              <div className="p-4 bg-gray-50 rounded-xl border flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
                <div>
                  <p className="font-semibold text-left">
                    Receipt Transaction Reference: <span className="text-emerald-700 font-bold uppercase">#{latestPlacedOrder.id}</span>
                  </p>
                  <p className="font-medium text-left">
                    Payment selection: <span className="uppercase font-bold text-gray-800">{latestPlacedOrder.paymentMethod}</span>
                  </p>
                </div>
                <div className="text-right mt-1 sm:mt-0">
                  <p className="font-extrabold text-lg text-gray-950">${latestPlacedOrder.totalAmount.toFixed(2)} USD</p>
                  <p className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm">FREE SHIPPING</p>
                </div>
              </div>

              {/* Delivery ETA info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="text-left bg-gray-50/50 p-3 rounded-lg border border-gray-150">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1">Recieving Recipient</p>
                  <p className="font-extrabold text-gray-800">{latestPlacedOrder.shippingAddress.fullName}</p>
                  <p className="text-gray-500">{latestPlacedOrder.shippingAddress.addressLine}</p>
                  <p className="text-gray-500">{latestPlacedOrder.shippingAddress.city}, {latestPlacedOrder.shippingAddress.postalCode}</p>
                </div>

                <div className="text-left bg-gray-50/50 p-3 rounded-lg border border-gray-150">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1">Estimated delivery</p>
                  <p className="font-extrabold text-gray-800 flex items-center gap-1 mt-0.5">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    3 to 5 Business Days
                  </p>
                  <p className="text-gray-500 mt-1">Our dispatch team will process package routing immediately.</p>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-6 flex flex-col sm:flex-row gap-3">
                <button
                  id="btn-return-shop"
                  onClick={() => {
                    setLatestPlacedOrder(null);
                    setActiveTab("shop");
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Continue Shopping Catalog
                </button>
                <button
                  id="btn-view-order-history"
                  onClick={() => {
                    // Force log in default session if guest placed to view logs,
                    // otherwise direct them to profile.
                    if (!currentUser) {
                      const demoUser: User = {
                        id: "user-buyer",
                        email: latestPlacedOrder.shippingAddress.email,
                        name: latestPlacedOrder.shippingAddress.fullName,
                        isAdmin: false,
                        joinedAt: new Date().toISOString()
                      };
                      saveStoredCurrentUser(demoUser);
                      setCurrentUser(demoUser);
                    }
                    setLatestPlacedOrder(null);
                    setActiveTab("profile");
                  }}
                  className="flex-1 py-3 bg-gray-900 hover:bg-gray-850 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  View Order Status Historics
                </button>
              </div>

            </div>
          </div>
        )}

        {/* CUSTOMER USER PROFILE & ORDERS HISTORY PAGE */}
        {activeTab === "profile" && currentUser && (
          <UserProfile
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
            onViewShop={() => setActiveTab("shop")}
          />
        )}

        {/* ADMIN CONTROL PANEL */}
        {activeTab === "admin" && currentUser && currentUser.isAdmin && (
          <AdminPanel
            products={products}
            onProductsUpdate={setProducts}
            orders={orders}
            onOrdersUpdate={setOrders}
          />
        )}

      </main>

      {/* 3. Global footer */}
      <footer className="bg-neutral-950 text-gray-400 border-t border-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Slogan */}
          <div className="space-y-3">
            <span className="text-2xl font-black text-white tracking-tight">
              Shar<span className="text-emerald-500">flow</span>
            </span>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              The high-fidelity lifestyle companion. Curating peak performance, acoustics, typography and fine office oak fixtures globally.
            </p>
          </div>

          {/* Quick shop directories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Shop Collections</h4>
            <ul className="space-y-1.5 text-xs text-gray-400 font-semibold uppercase">
              <li><button onClick={() => { setSelectedCategory("Electronics"); setActiveTab("shop"); }} className="hover:text-white cursor-pointer hover:underline">Electronics Devices</button></li>
              <li><button onClick={() => { setSelectedCategory("Fashion"); setActiveTab("shop"); }} className="hover:text-white cursor-pointer hover:underline">Essential Fashion</button></li>
              <li><button onClick={() => { setSelectedCategory("Accessories"); setActiveTab("shop"); }} className="hover:text-white cursor-pointer hover:underline">Apex Leather Gears</button></li>
              <li><button onClick={() => { setSelectedCategory("Home & Living"); setActiveTab("shop"); }} className="hover:text-white cursor-pointer hover:underline">Home & Living Oak Desk</button></li>
            </ul>
          </div>

          {/* Guarantee Badges */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Store Gurantees</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Truck className="h-4 w-4 flex-shrink-0" />
                No-Fee Worldwide Shipping
              </p>
              <p className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                Gateway Secure Encrypted Card
              </p>
            </div>
          </div>

          {/* Info credits */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Customer Support</h4>
            <p className="text-xs">Need order reservation queries? Contact us 24/7 or write to <span className="text-emerald-400 font-semibold underline">support@sharflow.com</span></p>
            <p className="text-[10px] text-gray-500 mt-4 font-semibold">© {new Date().getFullYear()} Sharflow Corp. All Rights Reserved.</p>
          </div>

        </div>
      </footer>

      {/* 4. Overlay Modals */}
      
      {/* Dynamic Product Detail Modal */}
      <ProductDetailModal
        product={activeDetailProduct}
        onClose={() => setActiveDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Persistent Shopping Cart Slide Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          if (cartItems.length > 0) {
            setActiveTab("checkout");
          }
        }}
      />

      {/* Security Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          // Redirect standard to shop, admin to admin view automatically of convenience
          if (user.isAdmin) {
            setActiveTab("admin");
          } else {
            setActiveTab("shop");
          }
        }}
      />

    </div>
  );
}
