import { Product, CartItem } from "../types";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = "G-FKVQJ4ZE19";

/**
 * Custom event tracker for Google Analytics 4
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

/**
 * Log page view or active tab change in SPA
 */
export function trackPageView(pageTitle: string, pagePath: string = "/") {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath,
    });
  }
}

/**
 * Standard GA4 add_to_cart ecommerce event
 */
export function trackAddToCart(product: Product, quantity: number = 1) {
  trackEvent("add_to_cart", {
    currency: "USD",
    value: (product.discountPrice ?? product.price) * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
        price: product.discountPrice ?? product.price,
        quantity,
      },
    ],
  });
}

/**
 * Standard GA4 purchase ecommerce event
 */
export function trackPurchase(orderId: string, totalAmount: number, items: CartItem[]) {
  trackEvent("purchase", {
    transaction_id: orderId,
    value: totalAmount,
    currency: "USD",
    items: items.map((item) => ({
      item_id: item.product.id,
      item_name: item.product.title,
      item_category: item.product.category,
      price: item.product.discountPrice ?? item.product.price,
      quantity: item.quantity,
    })),
  });
}
