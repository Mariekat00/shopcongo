export function generateInvoiceText(invoice: {
  invoiceNumber: string;
  items: Array<{ name: string; quantity: number; unitPrice: number; total: number }>;
  total: number;
  paymentMethod: string;
  date: string;
  businessName?: string;
}): string {
  const lines: string[] = [];

  lines.push("=".repeat(32));
  lines.push(`  ${invoice.businessName || "SHOPCONGO"}`);
  lines.push("=".repeat(32));
  lines.push("");
  lines.push(`Facture: ${invoice.invoiceNumber}`);
  lines.push(`Date: ${invoice.date}`);
  lines.push(`Paiement: ${formatPaymentMethod(invoice.paymentMethod)}`);
  lines.push("");
  lines.push("-".repeat(32));
  lines.push("Articles:");
  lines.push("-".repeat(32));

  for (const item of invoice.items) {
    lines.push(`${item.name} x${item.quantity}`);
    lines.push(`  ${item.unitPrice.toFixed(2)} x ${item.quantity} = ${item.total.toFixed(2)} $`);
  }

  lines.push("-".repeat(32));
  lines.push(`TOTAL: ${invoice.total.toFixed(2)} $`);
  lines.push("=".repeat(32));
  lines.push("");
  lines.push("Merci pour votre achat !");
  lines.push("ShopCongo - Gestion PME");

  return lines.join("\n");
}

function formatPaymentMethod(method: string): string {
  const methods: Record<string, string> = {
    cash: "Cash",
    mtn_momo: "MTN Mobile Money",
    orange_money: "Orange Money",
    card: "Carte bancaire",
    credit: "Crédit",
  };
  return methods[method] || method;
}

export function sendViaWhatsApp(phone: string, text: string) {
  const cleaned = phone.replace(/[^0-9]/g, "");
  const formatted = cleaned.startsWith("243") ? cleaned : `243${cleaned}`;
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/${formatted}?text=${encoded}`, "_blank");
}

export function sendViaSMS(phone: string, text: string) {
  const cleaned = phone.replace(/[^0-9]/g, "");
  window.open(`sms:${cleaned}?body=${encodeURIComponent(text)}`, "_blank");
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
