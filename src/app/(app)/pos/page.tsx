"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { savePendingSale } from "@/lib/offline";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Banknote,
  Smartphone,
  X,
  Check,
  WifiOff,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function POSPage() {
  const { user } = useAuth();
  const { isOnline } = useOnlineStatus();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mtn_momo" | "orange_money">("cash");
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const products = useQuery(
    api.products.list,
    user ? { userId: user.id } : "skip"
  );

  const createSale = useMutation(api.sales.create);

  const addToCart = (product: any) => {
    if (product.stock <= 0) return;
    const existing = cart.find((item) => item.id === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(
        cart.map((item) =>
          item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { id: product._id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
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

  const handlePayment = async () => {
    const txRef = `shopcongo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    if (paymentMethod === "cash") {
      if (!isOnline) {
        await savePendingSale({
          id: txRef,
          userId: user?.id ?? "",
          items: cart.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            total: item.price * item.quantity,
          })),
          subtotal,
          total,
          paymentMethod: "cash",
          invoiceNumber,
        });
        setPendingCount((c) => c + 1);
      } else {
        await createSale({
          userId: user?.id ?? "",
          invoiceNumber,
          subtotal,
          total,
          paymentMethod: "cash",
          paymentStatus: "paid",
          amountPaid: total,
          items: cart.map((item) => ({
            productId: item.id as any,
            quantity: item.quantity,
            unitPrice: item.price,
            total: item.price * item.quantity,
          })),
        });
      }

      setShowPayment(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCart([]);
      }, 2000);
      return;
    }

    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          email: "client@shopcongo.cd",
          tx_ref: txRef,
          payment_method: paymentMethod,
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || "Erreur de paiement");
      }
    } catch (error) {
      alert("Erreur de connexion au serveur de paiement");
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Offline banner */}
      {!isOnline && (
        <div className="fixed top-16 left-64 right-0 z-40 bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-700">
            Hors-ligne — Les ventes seront synchronisées plus tard
            {pendingCount > 0 && ` (${pendingCount} en attente)`}
          </span>
        </div>
      )}

      {/* Products grid */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Point de Vente</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 flex-1 overflow-auto">
          {(!products || products.length === 0) ? (
            <div className="col-span-full p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun produit</p>
              <p className="text-sm text-gray-400">Ajoutez des produits dans Stock d&apos;abord</p>
            </div>
          ) : (
            products.map((product: any) => (
              <button
                key={product._id}
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
            ))
          )}
        </div>
      </div>

      {/* Cart sidebar */}
      <div className="w-96 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Panier</h2>
          <p className="text-sm text-gray-500">{cart.length} article(s)</p>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Panier vide</p>
              <p className="text-sm text-gray-400">Cliquez sur un produit</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} /unité</p>
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

        <div className="p-5 border-t border-gray-100 space-y-3">
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
              <h2 className="text-lg font-bold text-gray-900">Paiement</h2>
              <button onClick={() => setShowPayment(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === "cash" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
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
                  paymentMethod === "mtn_momo" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
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
                  paymentMethod === "orange_money" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
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
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total</span>
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
            <p className="text-sm text-green-100">
              {isOnline ? "Paiement reçu" : "Sera synchronisé plus tard"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
