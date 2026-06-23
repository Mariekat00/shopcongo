"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = useQuery(
    api.dashboard.stats,
    user ? { userId: user.id } : "skip"
  );
  const recentSales = useQuery(
    api.dashboard.recentSales,
    user ? { userId: user.id } : "skip"
  );
  const lowStockProducts = useQuery(
    api.dashboard.lowStockProducts,
    user ? { userId: user.id } : "skip"
  );

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Vue d&apos;ensemble de votre commerce</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ventes du jour</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats?.todayRevenue?.toFixed(2) ?? "0.00"}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              {stats?.todayTransactions ?? 0}
            </span>
            <span className="text-sm text-gray-400">transactions</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Produits</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalProducts ?? 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              {stats?.totalStock ?? 0}
            </span>
            <span className="text-sm text-gray-400">en stock</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.todayTransactions ?? 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-sm text-gray-400">aujourd&apos;hui</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalCustomers ?? 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-sm text-gray-400">enregistrés</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent sales */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Ventes récentes</h2>
            <Link
              href="/factures"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Voir tout
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(!recentSales || recentSales.length === 0) ? (
              <div className="p-12 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune vente encore</p>
                <p className="text-sm text-gray-400">Commencez par une vente !</p>
              </div>
            ) : (
              recentSales.map((sale: any) => (
                <div key={sale._id} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {sale.customer?.name?.charAt(0) ?? "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {sale.customer?.name ?? "Client"}
                      </p>
                      <p className="text-xs text-gray-500">{sale.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${sale.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{sale.paymentMethod}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low stock alert */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Stock bas</h2>
            <Link
              href="/stock"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Gérer
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {!lowStockProducts || lowStockProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tout va bien !</p>
                <p className="text-sm text-gray-400">Aucun stock bas</p>
              </div>
            ) : (
              lowStockProducts.map((product: any) => (
                <div key={product._id} className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      Seuil: {product.lowStockThreshold ?? 5}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                    {product.stock} restant{product.stock > 1 ? "s" : ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/pos"
          className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="w-8 h-8 mb-3" />
          <h3 className="font-semibold">Nouvelle vente</h3>
          <p className="text-blue-100 text-sm mt-1">Ouvrir le point de vente</p>
        </Link>
        <Link
          href="/stock"
          className="bg-white text-gray-900 rounded-xl p-5 border border-gray-100 shadow-sm hover:border-blue-300 transition-colors"
        >
          <Package className="w-8 h-8 mb-3 text-blue-600" />
          <h3 className="font-semibold">Ajouter un produit</h3>
          <p className="text-gray-500 text-sm mt-1">Gérer votre catalogue</p>
        </Link>
        <Link
          href="/paiements"
          className="bg-white text-gray-900 rounded-xl p-5 border border-gray-100 shadow-sm hover:border-blue-300 transition-colors"
        >
          <DollarSign className="w-8 h-8 mb-3 text-green-600" />
          <h3 className="font-semibold">Enregistrer un paiement</h3>
          <p className="text-gray-500 text-sm mt-1">Cash ou Mobile Money</p>
        </Link>
      </div>
    </div>
  );
}
