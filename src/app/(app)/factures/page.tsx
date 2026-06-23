"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Download,
  Eye,
  Send,
  Filter,
} from "lucide-react";

const mockInvoices = [
  { id: 1, number: "INV-001", client: "Marie Lukaku", total: 45.00, method: "MTN MoMo", status: "paid", date: "23/06/2026" },
  { id: 2, number: "INV-002", client: "Jean Kabongo", total: 120.00, method: "Cash", status: "paid", date: "23/06/2026" },
  { id: 3, number: "INV-003", client: "Sarah Mbuyi", total: 78.50, method: "Orange Money", status: "paid", date: "22/06/2026" },
  { id: 4, number: "INV-004", client: "Patrick Lunda", total: 32.00, method: "Cash", status: "pending", date: "22/06/2026" },
  { id: 5, number: "INV-005", client: "Grace Mutombo", total: 215.00, method: "MTN MoMo", status: "paid", date: "21/06/2026" },
  { id: 6, number: "INV-006", client: "David Tshisekedi", total: 65.00, method: "Cash", status: "cancelled", date: "21/06/2026" },
];

const statusConfig = {
  paid: { label: "Payée", color: "bg-green-50 text-green-700" },
  pending: { label: "En attente", color: "bg-amber-50 text-amber-700" },
  cancelled: { label: "Annulée", color: "bg-red-50 text-red-700" },
};

export default function FacturesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockInvoices.filter(
    (inv) =>
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.number.toLowerCase().includes(search.toLowerCase())
  );

  const totalVentes = mockInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
          <p className="text-gray-500">
            {mockInvoices.length} factures • Total vendu:{" "}
            <span className="font-semibold text-green-600">${totalVentes.toFixed(2)}</span>
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une facture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filtrer
        </button>
      </div>

      {/* Invoices table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Facture
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Client
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Date
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Paiement
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Statut
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Total
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 font-mono">
                      {invoice.number}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-900">{invoice.client}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{invoice.date}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{invoice.method}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      statusConfig[invoice.status as keyof typeof statusConfig].color
                    }`}
                  >
                    {statusConfig[invoice.status as keyof typeof statusConfig].label}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900 text-right">
                  ${invoice.total.toFixed(2)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
