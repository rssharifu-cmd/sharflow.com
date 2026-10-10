import React, { useState } from "react";
import { User, Order } from "../types";
import { getStoredOrders, getStoredCurrentUser, saveStoredCurrentUser, getStoredUsers, saveStoredUsers } from "../data/storage";
import { History, UserCheck, Calendar, Shield, ShoppingBag, Eye, ChevronDown, ChevronUp, CheckCircle, Clock, Truck, ShieldAlert } from "lucide-react";

interface UserProfileProps {
  currentUser: User;
  onUpdateUser: (u: User) => void;
  onViewShop: () => void;
}

export default function UserProfile({ currentUser, onUpdateUser, onViewShop }: UserProfileProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Fetch only orders belonging to current logged in owner
  const allOrders = getStoredOrders();
  const userOrders = allOrders.filter((order) => order.userEmail === currentUser.email);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim()) {
      setMessage("Name and Email are required.");
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      name: name,
      email: email,
    };

    // Update globally in users list in localStorage
    const users = getStoredUsers();
    const index = users.findIndex((u: any) => u.id === currentUser.id);
    if (index !== -1) {
      users[index].name = name;
      users[index].email = email;
      saveStoredUsers(users);
    }

    saveStoredCurrentUser(updatedUser);
    onUpdateUser(updatedUser);
    setIsEditing(false);
    setMessage("Profile details saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3 animate-spin duration-3000" />
            Pending
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
            <Truck className="h-3 w-3" />
            Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="h-3 w-3" />
            Delivered
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="user-profile-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: User Details Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs">
            <div className="text-center pb-6 border-b border-gray-100">
              <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto text-3xl font-extrabold mb-4 select-none">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">{currentUser.name}</h2>
              <p className="text-xs text-gray-400 font-medium">Joined {new Date(currentUser.joinedAt).toLocaleDateString()}</p>
              
              {currentUser.isAdmin && (
                <span className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 bg-amber-50 rounded-full text-amber-800 font-bold text-xs border border-amber-200">
                  <Shield className="h-3.5 w-3.5" />
                  Administrator
                </span>
              )}
            </div>

            {message && (
              <div className="my-4 p-2.5 text-xs text-center font-bold text-emerald-800 bg-emerald-50 border border-emerald-250 rounded-xl">
                {message}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Your Name</label>
                  <input
                    id="edit-profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-55/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">E-mail Address</label>
                  <input
                    id="edit-profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-55/40"
                    required
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    id="btn-profile-save"
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    id="btn-profile-cancel"
                    type="button"
                    onClick={() => {
                      setName(currentUser.name);
                      setEmail(currentUser.email);
                      setIsEditing(false);
                    }}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">E-mail address</p>
                  <p className="text-sm font-semibold text-gray-800">{currentUser.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Security Clearance</p>
                  <p className="text-sm font-semibold text-gray-800">{currentUser.isAdmin ? "All Privileges Authorized" : "Customer"}</p>
                </div>
                <button
                  id="btn-profile-edit"
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2.5 mt-2 bg-gray-50 hover:bg-gray-100 border text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Edit Profile Information
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order History list */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <History className="h-5.5 w-5.5 text-emerald-600" />
              Your Order History
              <span className="text-xs bg-gray-100 text-gray-650 font-bold px-2 py-0.5 rounded-full">
                {userOrders.length} Completed
              </span>
            </h3>

            {userOrders.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">No orders placed yet</h4>
                <p className="text-xs text-gray-450 max-w-sm mx-auto mb-6">
                  Ready to experience absolute acoustic bliss or minimal carbon mechanical typing? Go start shopping now!
                </p>
                <button
                  id="btn-history-shop-now"
                  onClick={onViewShop}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Browse Store Selection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      id={`order-block-${order.id}`}
                      key={order.id}
                      className="border border-gray-150 rounded-xl overflow-hidden hover:shadow-xs transition-shadow"
                    >
                      {/* Summary clickable bar */}
                      <div
                        id={`order-summary-${order.id}`}
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="bg-gray-50/50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer select-none"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-gray-800">
                            Order <span className="text-emerald-700 uppercase">#{order.id.split("-")[1] || order.id}</span>
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">{formattedDate}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                          {getStatusBadge(order.status)}
                          <div>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Section Details */}
                      {isExpanded && (
                        <div className="p-4 border-t border-gray-100 bg-white space-y-4 animate-in slide-in-from-top duration-200">
                          
                          {/* Inner product list */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Purchased Products</h4>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 justify-between items-center bg-gray-50/50 p-2.5 rounded-lg border">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.title}
                                    referrerPolicy="no-referrer"
                                    className="w-10 h-10 object-cover rounded bg-white border"
                                  />
                                  <div>
                                    <p className="text-xs font-bold text-gray-900">{item.product.title}</p>
                                    <p className="text-[10px] text-gray-450 font-semibold uppercase">Category: {item.product.category}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-bold text-gray-900">
                                    ${(item.product.discountPrice || item.product.price).toFixed(2)}
                                  </p>
                                  <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Address & Payment Grid info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-gray-100">
                            <div className="space-y-1">
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shipping Details</h4>
                              <p className="text-xs font-bold text-gray-800">{order.shippingAddress.fullName}</p>
                              <p className="text-xs text-gray-600">{order.shippingAddress.addressLine}</p>
                              <p className="text-xs text-gray-600">
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                              </p>
                              <p className="text-xs text-gray-600">{order.shippingAddress.country}</p>
                              <p className="text-[10px] text-gray-450 font-semibold">{order.shippingAddress.phone}</p>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gateway Payment Information</h4>
                              <p className="text-xs font-bold text-gray-800 capitalize">
                                {order.paymentMethod === "stripe"
                                  ? "Stripe Secure Credit Card"
                                  : order.paymentMethod === "paypal"
                                  ? "PayPal Gateway Checkout"
                                  : "Cash On Delivery (COD)"}
                              </p>
                              <p className="text-xs text-gray-455 font-medium">Free delivery within 3-5 business days.</p>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
