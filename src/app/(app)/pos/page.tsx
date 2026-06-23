"use client";

import { useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  Check,
} from "lucide-react";

const products = [
  { id: 1, name: "Riz 5kg", price: 8.50, stock: 45 },
  { id: 2, name: "Huile végétale 1L", price: 4.20, stock: 2 },
  { id: 3, name: "Savon noir", price: 1.50, stock: 78 },
  { id: 4, name: "Pâte dentifrice", price: 2.80, stock: 32 },
  { id: 5, name: "Eau minérale 1.5L", price: 0.75, stock: 120 },
  { id: 6, name: "Jus d\'orange 1L", price: 2.00, stock: 3 },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mtn_momo" | "orange_money">("cash");
  const [showSuccess, setShowSuccess] = useState(false);

  const addToCart = (product: typeof products[0]) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handlePayment = () => {
    setShowPayment(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCart([]);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Products grid */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Point de Vente</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 flex-1 overflow-auto">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{product.name}</p>
              <p className="text-lg font-bold text-blue-600 mt-1">${product.price.toFixed(2)}</p>
              <p className={`text-xs mt-1 ${product.stock <= 5 ? "text-red-500" : "text-gray-400"}`}>
                Stock: {product.stock}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart sidebar */}
      <div className="w-96 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Panier</h2>
          <p className="text-sm text-gray-500">{cart.length} article(s)</p>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Panier vide</p>
              <p className="text-sm text-gray-400">Cliquez sur un produit pour l&apos;ajouter</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} unité</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-gray-900 w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total & Pay */}
        <div className="p-5 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-lg">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => cart.length > 0 && setShowPayment(true)}
            disabled={cart.length === 0}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Payer
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Choisir le paiement</h2>
              <button onClick={() => setShowPayment(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === "cash"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Cash</p>
                  <p className="text-sm text-gray-500">Paiement en espèces</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("mtn_momo")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === "mtn_momo"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">MTN Mobile Money</p>
                  <p className="text-sm text-gray-500">Payer par MoMo</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("orange_money")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === "orange_money"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Orange Money</p>
                  <p className="text-sm text-gray-500">Payer par Orange Money</p>
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total à payer</span>
                <span className="text-xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Confirmer le paiement
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">Vente enregistrée !</p>
            <p className="text-sm text-green-100">Paiement reçu avec succès</p>
          </div>
        </div>
      )}
    </div>
  );
}
