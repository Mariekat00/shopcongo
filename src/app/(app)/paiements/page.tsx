"use client";

import {
  CreditCard,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Smartphone,
} from "lucide-react";

const mockPayments = [
  { id: 1, client: "Marie Lukaku", amount: 45.00, method: "mtn_momo", type: "income", ref: "MTN-78945", date: "23/06/2026 14:30" },
  { id: 2, client: "Jean Kabongo", amount: 120.00, method: "cash", type: "income", ref: null, date: "23/06/2026 11:15" },
  { id: 3, client: "Fournisseur Tshilombo", amount: 85.00, method: "orange_money", type: "expense", ref: "OM-12345", date: "22/06/2026 16:00" },
  { id: 4, client: "Sarah Mbuyi", amount: 78.50, method: "orange_money", type: "income", ref: "OM-67890", date: "22/06/2026 10:45" },
  { id: 5, client: "Patrick Lunda", amount: 32.00, method: "cash", type: "income", ref: null, date: "22/06/2026 09:20" },
  { id: 6, client: "Fournisseur Kasapa", amount: 200.00, method: "mtn_momo", type: "expense", ref: "MTN-11223", date: "21/06/2026 15:30" },
];

export default function PaiementsPage() {
  const totalIncome = mockPayments.filter((p) => p.type === "income").reduce((s, p) => s + p.amount, 0);
  const totalExpense = mockPayments.filter((p) => p.type === "expense").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-500">Suivi des entrées et sorties</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nouveau paiement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Entrées</p>
              <p className="text-xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sorties</p>
              <p className="text-xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Solde net</p>
              <p className="text-xl font-bold text-blue-600">${(totalIncome - totalExpense).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un paiement..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {mockPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${payment.method === "cash" ? "bg-green-100" : payment.method === "mtn_momo" ? "bg-yellow-100" : "bg-orange-100"}`}>
                  {payment.method === "cash" ? (
                    <Banknote className="w-5 h-5 text-green-600" />
                  ) : (
                    <Smartphone className={`w-5 h-5 ${payment.method === "mtn_momo" ? "text-yellow-600" : "text-orange-600"}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.client}</p>
                  <p className="text-xs text-gray-500">{payment.date}{payment.ref ? ` • ${payment.ref}` : ""}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${payment.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {payment.type === "income" ? "+" : "-"}${payment.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 capitalize">{payment.method.replace("_", " ")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
