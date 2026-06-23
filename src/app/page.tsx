import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Store className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">ShopCongo</h1>
        <p className="text-blue-100 text-lg mb-8">
          Gérez votre commerce simplement. Stock, ventes et paiements Mobile Money.
        </p>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 w-full bg-white text-blue-700 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Se connecter
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/register"
            className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-400 transition-colors border border-blue-400"
          >
            Créer un compte gratuit
          </Link>
        </div>

        {/* Footer */}
        <p className="text-blue-200 text-sm mt-8">
          Gratuit pendant 30 jours. Aucune carte bancaire requise.
        </p>
      </div>
    </div>
  );
}
