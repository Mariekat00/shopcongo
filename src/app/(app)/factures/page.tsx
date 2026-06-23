"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { generateInvoiceText, sendViaWhatsApp, sendViaSMS, copyToClipboard } from "@/lib/invoice";
import {
  FileText,
  Search,
  Download,
  Eye,
  Send,
  Filter,
  MessageCircle,
  Phone,
  Copy,
  Check,
  X,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Payée", color: "bg-green-50 text-green-700" },
  pending: { label: "En attente", color: "bg-amber-50 text-amber-700" },
  partial: { label: "Partiel", color: "bg-blue-50 text-blue-700" },
  cancelled: { label: "Annulée", color: "bg-red-50 text-red-700" },
};

export default function FacturesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showInvoice, setShowInvoice] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const sales = useQuery(
    api.sales.list,
    user ? { userId: user.id } : "skip"
  );

  const filtered = (sales ?? []).filter(
    (s: any) =>
      s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalVentes = (sales ?? [])
    .filter((s: any) => s.paymentStatus === "paid")
    .reduce((sum: number, s: any) => sum + s.total, 0);

  const getInvoiceText = (sale: any) => {
    return generateInvoiceText({
      invoiceNumber: sale.invoiceNumber,
      items: sale.items?.map((i: any) => ({
        name: i.name ?? "Produit",
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total,
      })) ?? [],
      total: sale.total,
      paymentMethod: sale.paymentMethod,
      date: new Date(sale._creationTime).toLocaleDateString("fr-FR"),
      businessName: user?.name,
    });
  };

  const handleCopy = async (sale: any) => {
    await copyToClipboard(getInvoiceText(sale));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
          <p className="text-gray-500">
            {sales?.length ?? 0} factures • Total vendu:{" "}
            <span className="font-semibold text-green-600">${totalVentes.toFixed(2)}</span>
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une facture..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Facture</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune facture</p>
                </td>
              </tr>
            ) : (
              filtered.map((sale: any) => (
                <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 font-mono">{sale.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-900">{sale.customer?.name ?? "Client"}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(sale._creationTime).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig[sale.paymentStatus]?.color ?? "bg-gray-50 text-gray-700"}`}>
                      {statusConfig[sale.paymentStatus]?.label ?? sale.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 text-right">${sale.total.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setShowInvoice(sale)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {sale.customer?.phone && (
                        <>
                          <button
                            onClick={() => sendViaWhatsApp(sale.customer.phone, getInvoiceText(sale))}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Envoyer WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => sendViaSMS(sale.customer.phone, getInvoiceText(sale))}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Envoyer SMS"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleCopy(sale)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Copier"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Facture {showInvoice.invoiceNumber}</h2>
              <button onClick={() => setShowInvoice(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="bg-gray-50 rounded-xl p-4 text-sm font-mono whitespace-pre-wrap text-gray-800">
              {getInvoiceText(showInvoice)}
            </pre>

            <div className="flex gap-3 mt-4">
              {showInvoice.customer?.phone && (
                <>
                  <button
                    onClick={() => sendViaWhatsApp(showInvoice.customer.phone, getInvoiceText(showInvoice))}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => sendViaSMS(showInvoice.customer.phone, getInvoiceText(showInvoice))}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    <Phone className="w-4 h-4" />
                    SMS
                  </button>
                </>
              )}
              <button
                onClick={() => handleCopy(showInvoice)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
