import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Connexion</h2>
      <p className="text-gray-500 text-sm mb-6">Accédez à votre espace de gestion</p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="votre@email.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded border-gray-300" />
            Se souvenir de moi
          </label>
          <Link href="/auth/forgot" className="text-sm text-blue-600 hover:text-blue-700">
            Mot de passe oublié ?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Se connecter
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Pas encore de compte ?{" "}
        <Link href="/auth/register" className="text-blue-600 font-medium hover:text-blue-700">
          Créer un compte gratuit
        </Link>
      </p>
    </div>
  );
}
