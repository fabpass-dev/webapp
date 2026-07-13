import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin/require-admin";
import { PedirMagicLink } from "@/components/PedirMagicLink";

export default async function AdminPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Admin FabPass</h1>
        <p>Necesitás loguearte con una cuenta de administrador.</p>
        <PedirMagicLink next="/admin" />
      </main>
    );
  }

  const admin = createAdminClient();
  const [{ count: ciudades }, { count: productos }, { count: atracciones }, { count: partners }, { count: pases }, { count: cupones }] =
    await Promise.all([
      admin.from("ciudades").select("*", { count: "exact", head: true }),
      admin.from("productos").select("*", { count: "exact", head: true }),
      admin.from("atracciones").select("*", { count: "exact", head: true }),
      admin.from("partners").select("*", { count: "exact", head: true }),
      admin.from("pases").select("*", { count: "exact", head: true }),
      admin.from("cupones").select("*", { count: "exact", head: true }),
    ]);

  return (
    <main className="p-8 max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Admin FabPass</h1>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Ciudades" value={ciudades} />
        <Stat label="Productos" value={productos} />
        <Stat label="Atracciones" value={atracciones} />
        <Stat label="Partners" value={partners} />
        <Stat label="Pases vendidos" value={pases} />
        <Stat label="Cupones" value={cupones} />
      </div>

      <nav className="flex flex-col gap-2">
        <Link className="underline" href="/admin/ciudades">
          Gestionar ciudades
        </Link>
        <Link className="underline" href="/admin/productos">
          Gestionar productos
        </Link>
        <Link className="underline" href="/admin/atracciones">
          Gestionar atracciones
        </Link>
        <Link className="underline" href="/admin/cupones">
          Gestionar cupones
        </Link>
        <Link className="underline" href="/admin/liquidaciones">
          Liquidaciones
        </Link>
      </nav>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="border rounded p-3 text-center">
      <p className="text-2xl font-bold">{value ?? 0}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
