import React, { useState } from "react";
import { ShoppingBag, User, Search, Menu, X, Settings, LogOut, ShieldAlert } from "lucide-react";
import { User as UserType } from "../types";

interface HeaderProps {
  currentUser: UserType | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  currentSearch: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (val: string) => void;
  categories: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({
  currentUser,
  onOpenAuth,
  onLogout,
  cartCount,
  onOpenCart,
  currentSearch,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header id="sf-header" className="sticky top-0 z-40 bg-white border-b border-gray-150 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              id="btn-logo"
              onClick={() => {
                setActiveTab("shop");
                onSelectCategory("All");
                onSearchChange("");
              }}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <div className="bg-emerald-600 text-white p-2 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 stroke-[2.5]" />
              </div>
              <span className="font-sans text-2xl font-extrabold tracking-tight text-gray-900">
                Shar<span className="text-emerald-600">flow</span>
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                id="search-input-desktop"
                type="text"
                placeholder="Search premium products..."
                value={currentSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-gray-50/50"
              />
              {currentSearch && (
                <button
                  id="search-clear-desktop"
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="hidden md:flex items-center gap-1">
            <button
              id="nav-shop"
              onClick={() => setActiveTab("shop")}
              className={`px-4 py-2 text-sm font-medium rounded-xl cursor-pointer transition-colors ${
                activeTab === "shop"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Shop Catalog
            </button>

            {currentUser && currentUser.isAdmin && (
              <button
                id="nav-admin"
                onClick={() => setActiveTab("admin")}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl cursor-pointer transition-colors ${
                  activeTab === "admin"
                    ? "bg-amber-50 text-amber-800"
                    : "text-amber-700 hover:text-amber-900 hover:bg-amber-50/50"
                }`}
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </button>
            )}

            {currentUser && (
              <button
                id="nav-profile"
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 text-sm font-medium rounded-xl cursor-pointer transition-colors ${
                  activeTab === "profile"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Orders & Profile
              </button>
            )}
          </div>

          {/* User Signin & Cart Actions */}
          <div className="flex items-center gap-2">
            <button
              id="header-cart-trigger"
              onClick={onOpenCart}
              className="relative p-2 text-gray-700 hover:text-emerald-700 hover:bg-gray-50 rounded-xl cursor-pointer focus:outline-none transition-colors"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 border-l border-gray-150 pl-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400 font-medium">Hello,</p>
                  <p className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">{currentUser.name}</p>
                </div>
                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-gray-500 hover:text-red-650 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                id="header-auth-trigger"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-850 text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs"
              >
                <User className="h-4 w-4" />
                Log In
              </button>
            )}

            {/* Mobile Menu Icon */}
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-650 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Options */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-3 shadow-md animate-in slide-in-from-top duration-200">
          
          {/* Mobile search */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              id="search-input-mobile"
              type="text"
              placeholder="Search products..."
              value={currentSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
            />
            {currentSearch && (
              <button
                id="search-clear-mobile"
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <button
              id="mobile-nav-shop"
              onClick={() => {
                setActiveTab("shop");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                activeTab === "shop" ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-55"
              }`}
            >
              Shop Catalog
            </button>

            {currentUser && currentUser.isAdmin && (
              <button
                id="mobile-nav-admin"
                onClick={() => {
                  setActiveTab("admin");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold ${
                  activeTab === "admin" ? "bg-amber-50 text-amber-800" : "text-amber-800 hover:bg-amber-50/20"
                }`}
              >
                <Settings className="h-4 w-4" />
                Admin Panel Dashboard
              </button>
            )}

            {currentUser && (
              <button
                id="mobile-nav-profile"
                onClick={() => {
                  setActiveTab("profile");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === "profile" ? "bg-emerald-50 text-emerald-700" : "text-gray-750 hover:bg-gray-55"
                }`}
              >
                Order History & Profile
              </button>
            )}
          </div>

          {/* Categories Selector in Mobile */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  id={`mobile-cat-${cat}`}
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setActiveTab("shop");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1-5 text-xs font-medium rounded-full cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
