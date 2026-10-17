import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <p className="text-sm font-semibold text-slate-500">Laboratorio 09 · Ejercicio 1.1</p>
        <h1 className="mt-3 text-4xl font-bold">PokeApp</h1>
        <p className="mt-4">Abre ambas páginas para comparar dónde se obtienen los datos del Pokémon.</p>
        <nav className="mt-8 flex flex-wrap gap-4">
          <Link href="/pokemon-csr" prefetch={false} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">Pokémon CSR</Link>
          <Link href="/pokemon-ssr" prefetch={false} className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white">Pokémon SSR</Link>
        </nav>
      </div>
    </main>
  );
}
