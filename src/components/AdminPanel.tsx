import React, { useState } from "react";
import { Product, Order, User } from "../types";
import { getStoredProducts, saveStoredProducts, getStoredOrders, saveStoredOrders, getStoredUsers } from "../data/storage";
import { LayoutDashboard, ShoppingCart, Percent, Box, RefreshCw, Plus, Edit2, Trash2, ArrowUpRight, DollarSign, Package, Users, CheckCircle, Clock, Truck, ShieldAlert } from "lucide-react";

interface AdminPanelProps {
  products: Product[];
  onProductsUpdate: (prods: Product[]) => void;
  orders: Order[];
  onOrdersUpdate: (orders: Order[]) => void;
}

export default function AdminPanel({
  products,
  onProductsUpdate,
  orders,
  onOrdersUpdate,
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<"stats" | "orders" | "catalog">("stats");

  // Product CRUD states
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Electronics");
  const [formPrice, setFormPrice] = useState("");
  const [formDiscountPrice, setFormDiscountPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formImage, setFormImage] = useState("");

  const [feedback, setFeedback] = useState("");

  // Retrieve user count
  const totalCustomers = getStoredUsers().length;

  // Calculable Stats based on all orders
  const totalRevenue = orders.reduce((sum, order) => {
    // Only count Shipped or Delivered orders towards real income stream
    if (order.status !== "Pending") {
      return sum + order.totalAmount;
    }
    return sum;
  }, 0);

  const pendingSales = orders.filter((o) => o.status === "Pending").length;
  const shippedSales = orders.filter((o) => o.status === "Shipped").length;
  const deliveredSales = orders.filter((o) => o.status === "Delivered").length;

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    onOrdersUpdate(updated);
    saveStoredOrders(updated);
    setFeedback("Order status successfully updated to " + newStatus);
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleEditProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setFormTitle(product.title);
    setFormDescription(product.description);
    setFormCategory(product.category);
    setFormPrice(String(product.price));
    setFormDiscountPrice(product.discountPrice ? String(product.discountPrice) : "");
    setFormStock(String(product.stock));
    setFormImage(product.images[0] || "");
    setIsEditingProduct(true);
  };

  const handleCreateProductClick = () => {
    setSelectedProductId(null);
    setFormTitle("");
    setFormDescription("");
    setFormCategory("Electronics");
    setFormPrice("");
    setFormDiscountPrice("");
    setFormStock("");
    setFormImage("");
    setIsEditingProduct(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");

    const priceNum = parseFloat(formPrice);
    const discNum = formDiscountPrice ? parseFloat(formDiscountPrice) : undefined;
    const stockNum = parseInt(formStock);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid product list price.");
      return;
    }

    if (discNum !== undefined && (isNaN(discNum) || discNum >= priceNum)) {
      alert("Discount price must be less than list price.");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      alert("Stock levels cannot be negative.");
      return;
    }

    // Suggested beautiful image if empty
    const finalImage = formImage.trim() || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800";

    if (selectedProductId) {
      // Edit
      const updated = products.map((p) => {
        if (p.id === selectedProductId) {
          return {
            ...p,
            title: formTitle,
            description: formDescription,
            category: formCategory,
            price: priceNum,
            discountPrice: discNum,
            stock: stockNum,
            images: [finalImage],
          };
        }
        return p;
      });
      onProductsUpdate(updated);
      saveStoredProducts(updated);
      setFeedback("Product catalog updated successfully!");
    } else {
      // Create
      const newProduct: Product = {
        id: "prod-" + Date.now(),
        title: formTitle,
        description: formDescription,
        category: formCategory,
        price: priceNum,
        discountPrice: discNum,
        stock: stockNum,
        images: [finalImage],
      };
      const updated = [newProduct, ...products];
      onProductsUpdate(updated);
      saveStoredProducts(updated);
      setFeedback("Premium product created successfully!");
    }

    setTimeout(() => setFeedback(""), 3000);
    setIsEditingProduct(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to permanently withdraw this product from sale?")) {
      const updated = products.filter((p) => p.id !== productId);
      onProductsUpdate(updated);
      saveStoredProducts(updated);
      setFeedback("Product completely removed from Sharflow.");
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  return (
    <div id="admin-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* Branding and Dashboard tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-150 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Admin Control Dashboard</h1>
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-50 rounded-lg px-2.5 py-0.5 mt-1.5 w-fit">
            Manager Console Authorized Mode
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button
            id="tab-admin-stats"
            onClick={() => {
              setAdminTab("stats");
              setIsEditingProduct(false);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              adminTab === "stats" ? "bg-white text-gray-900 shadow-sm" : "text-gray-550 hover:text-gray-900"
            }`}
          >
            Sales Overview
          </button>
          <button
            id="tab-admin-orders"
            onClick={() => {
              setAdminTab("orders");
              setIsEditingProduct(false);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              adminTab === "orders" ? "bg-white text-gray-900 shadow-sm" : "text-gray-550 hover:text-gray-900"
            }`}
          >
            Manage Orders ({orders.length})
          </button>
          <button
            id="tab-admin-catalog"
            onClick={() => {
              setAdminTab("catalog");
              setIsEditingProduct(false);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              adminTab === "catalog" ? "bg-white text-gray-900 shadow-sm" : "text-gray-550 hover:text-gray-900"
            }`}
          >
            Catalog Inventory
          </button>
        </div>
      </div>

      {feedback && (
        <div className="my-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold animate-pulse">
          {feedback}
        </div>
      )}

      {/* DASHBOARD SALES STATS TAB */}
      {adminTab === "stats" && (
        <div id="admin-analytics-view" className="space-y-8 mt-8">
          {/* Card list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 border rounded-2xl border-gray-150 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivered Revenue</p>
                <h3 className="text-2xl font-black text-gray-950">${totalRevenue.toFixed(2)}</h3>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1">Excludes pending transactions</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                <DollarSign className="h-6 w-6 stroke-[2.5]" />
              </div>
            </div>

            <div className="bg-white p-6 border rounded-2xl border-gray-150 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sales Record</p>
                <h3 className="text-2xl font-black text-gray-950">{orders.length} Orders</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-1">
                  {pendingSales} processing, {shippedSales + deliveredSales} completed
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <ShoppingCart className="h-6 w-6 stroke-[2.5]" />
              </div>
            </div>

            <div className="bg-white p-6 border rounded-2xl border-gray-150 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Customers</p>
                <h3 className="text-2xl font-black text-gray-950">{totalCustomers} Registered</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">Includes demo shortcut profiles</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                <Users className="h-6 w-6 stroke-[2.5]" />
              </div>
            </div>

            <div className="bg-white p-6 border rounded-2xl border-gray-150 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Catalog Count</p>
                <h3 className="text-2xl font-black text-gray-950">{products.length} Items</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">Under multiple categories</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                <Package className="h-6 w-6 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Detailed analysis summary grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 border rounded-2xl border-gray-150 space-y-4">
              <h4 className="font-extrabold text-gray-900 border-b pb-3 border-gray-100 flex items-center gap-1.5 text-base">
                <RefreshCw className="h-4.5 w-4.5 text-emerald-600" />
                Latest Transaction Logs
              </h4>

              {orders.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6 font-medium">No sales orders recorded yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-gray-800">{ord.shippingAddress.fullName}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">Ordered {ord.items.length} product units</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-gray-950">${ord.totalAmount.toFixed(2)}</p>
                        <span className="text-[9px] uppercase tracking-wide font-bold text-teal-700 bg-teal-50 px-1 rounded">
                          {ord.paymentMethod}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 border rounded-2xl border-gray-150 space-y-4">
              <h4 className="font-extrabold text-gray-900 border-b pb-3 border-gray-100 flex items-center gap-1.5 text-base">
                <Percent className="h-4.5 w-4.5 text-emerald-700" />
                Stock Availability Overview
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {products.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  const isLow = p.stock > 0 && p.stock <= 5;
                  return (
                    <div key={p.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-gray-50/50">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <img src={p.images[0]} referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover border" />
                        <span className="font-bold text-gray-800 truncate">{p.title}</span>
                      </div>
                      <div>
                        {isOutOfStock ? (
                          <span className="text-red-750 font-black bg-red-50 px-2 py-0.5 rounded text-[10px]">Out of Stock</span>
                        ) : isLow ? (
                          <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                            Low Stock Limit: {p.stock} Left
                          </span>
                        ) : (
                          <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                            {p.stock} units
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ORDERS MANAGEMENT TAB */}
      {adminTab === "orders" && (
        <div id="admin-orders-list-view" className="mt-8 bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-xs">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingCart className="h-5.5 w-5.5 text-emerald-600" />
            Active Customer Orders
          </h3>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No checkout transactions have occurred yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm divide-y divide-gray-150">
                <thead className="bg-gray-50">
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Buyer Address Details</th>
                    <th className="px-4 py-3">Placed Date</th>
                    <th className="px-4 py-3">Pricing sum</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {orders.map((order) => (
                    <tr id={`admin-tr-${order.id}`} key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* ID Column */}
                      <td className="px-4 py-4.5 font-bold text-emerald-800 text-xs uppercase select-all">
                        #{order.id.split("-")[1] || order.id}
                      </td>

                      {/* Recipient Details */}
                      <td className="px-4 py-4.5">
                        <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                        <p className="text-xs text-gray-500">{order.shippingAddress.addressLine}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{order.shippingAddress.phone}</p>
                      </td>

                      {/* Placed Date */}
                      <td className="px-4 py-4.5 text-xs text-gray-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      {/* Total Amount */}
                      <td className="px-4 py-4.5 font-extrabold text-gray-950">
                        ${order.totalAmount.toFixed(2)}
                      </td>

                      {/* Payment Method badge */}
                      <td className="px-4 py-4.5">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status Dropdown selector */}
                      <td className="px-4 py-4.5">
                        <select
                          id={`order-status-select-${order.id}`}
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order["status"])}
                          className={`text-xs font-bold px-2 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/15 cursor-pointer ${
                            order.status === "Pending"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : order.status === "Shipped"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-250"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADMIN PRODUCT CATALOG CONTROLS TAB */}
      {adminTab === "catalog" && (
        <div id="admin-product-catalog-view" className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Retail Product Catalog ({products.length})</h3>
            <button
              id="btn-add-product"
              onClick={handleCreateProductClick}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="h-4.5 w-4.5" />
              Add Premium Product
            </button>
          </div>

          {/* Inline Expandable Item Form for CRUD */}
          {isEditingProduct && (
            <div id="product-form-card" className="bg-white border rounded-2xl border-gray-150 p-6 md:p-8 shadow-md space-y-6 animate-in slide-in-from-top duration-300">
              <h4 className="text-lg font-extrabold text-gray-900 border-b border-gray-150 pb-2">
                {selectedProductId ? "Modify Product Details" : "Publish New Product Listing"}
              </h4>

              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Product Title</label>
                  <input
                    id="form-title"
                    type="text"
                    placeholder="e.g. Aura Premium Wireless Headphones"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Product Category</label>
                  <input
                    id="form-category"
                    type="text"
                    list="admin-existing-categories"
                    placeholder="Type brand new category or select existing..."
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                    required
                  />
                  <datalist id="admin-existing-categories">
                    {Array.from(new Set(products.map((p) => p.category).filter(Boolean))).map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Detailed Description</label>
                  <textarea
                    id="form-desc"
                    placeholder="Provide acoustic qualities, material specifications, battery life details..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 md:col-span-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Price ($)</label>
                    <input
                      id="form-price"
                      type="number"
                      step="0.01"
                      placeholder="List Price, e.g. 199"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Discount Price ($) (Optional)</label>
                    <input
                      id="form-discount"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 149"
                      value={formDiscountPrice}
                      onChange={(e) => setFormDiscountPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Stock Availability Count</label>
                    <input
                      id="form-stock"
                      type="number"
                      placeholder="e.g. 25"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Hot-linked Image URL</label>
                  <input
                    id="form-image"
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Tip: You can copy and paste any Unsplash photo link, or leave empty to default to a clean mockup placeholder.
                  </p>
                </div>

                <div className="flex gap-2.5 pt-3 md:col-span-2 justify-end border-t border-gray-100">
                  <button
                    id="btn-form-cancel"
                    type="button"
                    onClick={() => setIsEditingProduct(false)}
                    className="py-2.5 px-5 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Cancel Action
                  </button>
                  <button
                    id="btn-form-save"
                    type="submit"
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    {selectedProductId ? "Apply Details" : "Publish Listing"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product list catalog grid rows */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => {
                const isOutOfStock = p.stock <= 0;
                return (
                  <div key={p.id} className="border border-gray-150 rounded-xl p-4.5 flex gap-4 items-start relative hover:shadow-xs justify-between">
                    <div className="flex gap-3">
                      <img
                        src={p.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-emerald-800 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1 pr-4">{p.title}</h4>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-black text-gray-950">${p.discountPrice || p.price}</span>
                          {p.discountPrice && <span className="text-[10px] text-gray-400 line-through">${p.price}</span>}
                        </div>
                        <p className={`text-[10px] font-extrabold ${isOutOfStock ? "text-red-750" : "text-gray-450"}`}>
                          Stock: {p.stock} units
                        </p>
                      </div>
                    </div>

                    {/* Operational controls */}
                    <div className="flex flex-col gap-1.5 justify-center">
                      <button
                        id={`btn-cat-edit-${p.id}`}
                        onClick={() => handleEditProductClick(p)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-emerald-700 cursor-pointer"
                        title="Edit details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        id={`btn-cat-delete-${p.id}`}
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-450 hover:text-red-650 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
