import React, { useState } from "react";
import { CartItem, ShippingAddress, PaymentMethod } from "../types";
import { ShieldCheck, Truck, CreditCard, Landmark, Check, AlertCircle } from "lucide-react";

interface CheckoutPageProps {
  cartItems: CartItem[];
  userEmail: string;
  onPlaceOrder: (address: ShippingAddress, payment: PaymentMethod) => void;
  onCancel: () => void;
}

export default function CheckoutPage({ cartItems, userEmail, onPlaceOrder, onCancel }: CheckoutPageProps) {
  const [fullName, setFullName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(userEmail || "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [validationError, setValidationError] = useState("");

  // Stripe Card simulator states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!fullName.trim() || !addressLine.trim() || !city.trim() || !postalCode.trim() || !phone.trim() || !email.trim()) {
      setValidationError("All shipping address details are strictly required to proceed.");
      return;
    }

    if (paymentMethod === "stripe") {
      if (!cardNumber.trim() || cardNumber.length < 12) {
        setValidationError("Please enter a valid credit card number.");
        return;
      }
      if (!cardExpiry.trim() || !cardExpiry.includes("/")) {
        setValidationError("Expiry date must be in MM/YY format.");
        return;
      }
      if (!cardCvc.trim() || cardCvc.length < 3) {
        setValidationError("Security code (CVC/CVV) is invalid.");
        return;
      }
    }

    // Call checkout trigger
    const address: ShippingAddress = {
      fullName,
      addressLine,
      city,
      postalCode,
      country,
      phone,
      email,
    };

    onPlaceOrder(address, paymentMethod);
  };

  return (
    <div id="checkout-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Title section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Complete Checkout</h1>
          <p className="text-sm text-gray-500">Provide your shipping address and finalize your secure transaction</p>
        </div>
        <button
          id="btn-checkout-cancel"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:shadow-xs transition-colors"
        >
          ← Return to Shopping Catalog
        </button>
      </div>

      {validationError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-850 font-medium">
          <AlertCircle className="h-5 w-5 text-red-650 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Form + Info grid layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Address form and payments */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Shipping Address container */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs">
            <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">1</span>
              Shipping Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Full Delivery Name</label>
                <input
                  id="checkout-fullname"
                  type="text"
                  placeholder="e.g. RS Sharifu"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Email Address</label>
                <input
                  id="checkout-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Mobile Contact Phone</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  placeholder="+1 (555) 0192"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Street Address</label>
                <input
                  id="checkout-address"
                  type="text"
                  placeholder="123 Sharflow Lane, Apartment 4B"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">City</label>
                <input
                  id="checkout-city"
                  type="text"
                  placeholder="e.g. San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Postal Code</label>
                  <input
                    id="checkout-zip"
                    type="text"
                    placeholder="94103"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Country</label>
                  <select
                    id="checkout-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-gray-50/50"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Payment details selection container */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs">
            <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">2</span>
              Payment Method Select
            </h3>

            {/* Methods Tabs selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                id="pm-stripe"
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`p-4 flex items-center justify-between border rounded-2xl text-left cursor-pointer transition-all ${
                  paymentMethod === "stripe"
                    ? "border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-500/15"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Stripe Secure</p>
                    <p className="text-[10px] text-gray-400 font-medium">Credit / Debit Card</p>
                  </div>
                </div>
                {paymentMethod === "stripe" && (
                  <div className="bg-emerald-600 text-white rounded-full p-0.5">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                )}
              </button>

              <button
                id="pm-paypal"
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`p-4 flex items-center justify-between border rounded-2xl text-left cursor-pointer transition-all ${
                  paymentMethod === "paypal"
                    ? "border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-500/15"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Landmark className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">PayPal Checkout</p>
                    <p className="text-[10px] text-gray-400 font-medium">Fast secure portal login</p>
                  </div>
                </div>
                {paymentMethod === "paypal" && (
                  <div className="bg-emerald-600 text-white rounded-full p-0.5">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                )}
              </button>

              <button
                id="pm-cod"
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 flex items-center justify-between border rounded-2xl text-left cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-500/15"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-[10px] text-gray-400 font-medium">Pay upon home arrival</p>
                  </div>
                </div>
                {paymentMethod === "cod" && (
                  <div className="bg-emerald-600 text-white rounded-full p-0.5">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                )}
              </button>
            </div>

            {/* Sub-form inputs for selected method */}
            {paymentMethod === "stripe" && (
              <div id="stripe-card-fields" className="p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-4 animate-in fade-in duration-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-650" />
                  Stripe Encrypted Card Gate
                </p>
                <div>
                  <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Credit Card Number</label>
                  <input
                    id="card-number-input"
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Expiration Date (MM/YY)</label>
                    <input
                      id="card-expiry-input"
                      type="text"
                      placeholder="12/28"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-white animate-fade-in"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Security Code (CVC)</label>
                    <input
                      id="card-cvc-input"
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 bg-white"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400">
                  Your payments are processed securely by Sharflow using SSL 256-bit encryption. No actual charges are posted.
                </p>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div id="paypal-info" className="p-5 bg-blue-50/20 border border-blue-100 rounded-2xl animate-in fade-in duration-200">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">PayPal API Wallet Setup</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Upon clicking submit, you will be and linked to a simulated PayPal verification portal. Enter your email key once prompted to complete transaction authorization.
                </p>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div id="cod-info" className="p-5 bg-indigo-50/15 border border-indigo-100 rounded-2xl animate-in fade-in duration-200">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">Cash on Delivery Policy</p>
                <p className="text-xs text-gray-650 leading-relaxed font-medium">
                  We collect cash or card payments directly at your shipping address during immediate drop-off. Please check order status updates regularly!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summaries & Action */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs sticky top-24 space-y-6">
            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              Order Details
            </h3>

            {/* List items thumbnail summary */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.product.id} className="flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 bg-gray-50 rounded-lg object-cover border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-950 truncate">{item.product.title}</p>
                      <p className="text-gray-400 font-semibold">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* Subtotal block */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal Items</span>
                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Secure Shipping</span>
                <span className="text-emerald-700 font-black uppercase text-xs">Free</span>
              </div>
              <hr className="border-gray-150" />
              <div className="flex justify-between text-base font-extrabold text-gray-950">
                <span>Total Amount Due</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Trigger button */}
            <button
              id="btn-checkout-submit"
              type="submit"
              className="w-full flex items-center justify-center py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-xl shadow-md transition-all cursor-pointer"
            >
              Finalize Secure Payment • ${subtotal.toFixed(2)}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-gray-400 uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Sharflow Encrypted Gateway
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
