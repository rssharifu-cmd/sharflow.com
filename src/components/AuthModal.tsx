import React, { useState } from "react";
import { X, Mail, Lock, User, CheckCircle, Flame, ShieldAlert, ArrowRight } from "lucide-react";
import { getStoredUsers, saveStoredUsers, saveStoredCurrentUser } from "../data/storage";
import { User as UserType } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  if (!isOpen) return null;

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const users = getStoredUsers();

    if (isLogin) {
      // Find user
      const foundUser = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        const loggedIn: UserType = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          isAdmin: foundUser.isAdmin,
          joinedAt: foundUser.joinedAt,
        };
        saveStoredCurrentUser(loggedIn);
        onLoginSuccess(loggedIn);
        onClose();
      } else {
        setErrorMsg("Invalid email address or password. Please try again.");
      }
    } else {
      // Registration flow
      if (!name.trim()) {
        setErrorMsg("Please write your name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg("Please provide a valid email structure.");
        return;
      }
      if (password.length < 4) {
        setErrorMsg("Password must be at least 4 characters.");
        return;
      }

      // Check if user already exists
      const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setErrorMsg("This e-mail is already registered with us.");
        return;
      }

      // Create new user
      const newUserObj = {
        id: "user-" + Date.now(),
        name: name,
        email: email,
        password: password,
        isAdmin: false,
        joinedAt: new Date().toISOString(),
      };

      users.push(newUserObj);
      saveStoredUsers(users);

      const sessUser: UserType = {
        id: newUserObj.id,
        name: newUserObj.name,
        email: newUserObj.email,
        isAdmin: newUserObj.isAdmin,
        joinedAt: newUserObj.joinedAt,
      };

      setSuccessMsg("Success! Creating your secure account...");
      setTimeout(() => {
        saveStoredCurrentUser(sessUser);
        onLoginSuccess(sessUser);
        onClose();
      }, 1000);
    }
  };

  // Quick Account Shortcuts
  const handleShortcutLogin = (shortcutEmail: string) => {
    setErrorMsg("");
    const users = getStoredUsers();
    const found = users.find((u: any) => u.email === shortcutEmail);
    if (found) {
      const loggedIn: UserType = {
        id: found.id,
        name: found.name,
        email: found.email,
        isAdmin: found.isAdmin,
        joinedAt: found.joinedAt,
      };
      saveStoredCurrentUser(loggedIn);
      onLoginSuccess(loggedIn);
      onClose();
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Absolute backdrop click out */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Modal Card container */}
      <div id="auth-modal" className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-10 p-6 md:p-8 animate-in scale-in duration-200">
        
        {/* Close trigger */}
        <button
          id="btn-close-auth"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal brand header */}
        <div className="text-center mb-6">
          <span className="text-2xl font-black tracking-tight text-gray-900 block mb-1">
            Shar<span className="text-emerald-700">flow</span>
          </span>
          <p className="text-xs text-gray-500 font-medium">
            {isLogin ? "Sign in to manage your cart, admin panel & orders" : "Create an account to start shopping"}
          </p>
        </div>

        {/* Error / Success feedback labels */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 font-medium">
            <ShieldAlert className="h-4 w-4 text-red-650 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 font-bold">
            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Your Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="e.g. RS Sharifu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">E-mail Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="auth-email-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-650 uppercase tracking-wide mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="auth-password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600"
                required
              />
            </div>
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-sm"
          >
            {isLogin ? "Log In to Sharflow" : "Sign up in Seconds"}
          </button>
        </form>

        {/* Change auth mode */}
        <div className="mt-4 text-center">
          <button
            id="btn-toggle-auth-mode"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer"
          >
            {isLogin ? "No account? Sign up as a new customer!" : "Already registered? Let's sign in!"}
          </button>
        </div>

        {/* Quick Testing Shortcuts section for frictionless reviews */}
        <div className="mt-6 border-t border-gray-150 pt-5">
          <div className="flex items-center gap-1.5 mb-3 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md text-[11px] font-bold w-fit">
            <Flame className="h-3.5 w-3.5 fill-amber-600 stroke-none" />
            Testing Accounts Shortcuts
          </div>
          <div className="space-y-2">
            <button
              id="shortcut-admin-login"
              onClick={() => handleShortcutLogin("admin@sharflow.com")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed border-amber-200 bg-amber-50/15 hover:bg-amber-50/30 text-left cursor-pointer transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-amber-950">Log In as Admin Developer</p>
                <p className="text-[10px] text-gray-500 font-medium">Access catalog CRUD / edit pricing / status admin controls</p>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-600 flex-shrink-0" />
            </button>

            <button
              id="shortcut-user-login"
              onClick={() => handleShortcutLogin("rssharifu@gmail.com")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed border-emerald-250 bg-emerald-50/15 hover:bg-emerald-50/30 text-left cursor-pointer transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-emerald-950">Log In as Sharifu</p>
                <p className="text-[10px] text-gray-500 font-medium">Standard customer account pre-configured in local metadata</p>
              </div>
              <ArrowRight className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
