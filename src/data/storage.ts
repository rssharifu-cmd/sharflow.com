import { Product, Order, User } from "../types";
import { INITIAL_PRODUCTS } from "./initialProducts";

// Keys for localStorage
const PRODUCTS_KEY = "sharflow_products";
const USERS_KEY = "sharflow_users";
const ORDERS_KEY = "sharflow_orders";
const CURRENT_USER_KEY = "sharflow_current_user";

// Seed data
const SEED_USERS = [
  {
    id: "user-admin",
    name: "Sharflow Admin",
    email: "admin@sharflow.com",
    password: "admin",
    isAdmin: true,
    joinedAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "user-standard",
    name: "Sharifu",
    email: "rssharifu@gmail.com",
    password: "user",
    isAdmin: false,
    joinedAt: "2026-06-14T10:54:00-07:00"
  },
  {
    id: "user-demo",
    name: "Demo Customer",
    email: "demo@sharflow.com",
    password: "demo",
    isAdmin: false,
    joinedAt: "2026-05-10T12:00:00Z"
  }
];

// Initalize localStorage
export const initializeStorage = () => {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  }
};

// Retrieve products
export const getStoredProducts = (): Product[] => {
  initializeStorage();
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
};

// Save products
export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Retrieve users
export const getStoredUsers = () => {
  initializeStorage();
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : SEED_USERS;
  } catch (e) {
    return SEED_USERS;
  }
};

// Save users
export const saveStoredUsers = (users: any[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Retrieve orders
export const getStoredOrders = (): Order[] => {
  initializeStorage();
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Save orders
export const saveStoredOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

// Current Session User
export const getStoredCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveStoredCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
