import Navbar from "@/components/navbar";
import Link from "next/link";
import {
  GlobeIcon,
  PlaneIcon
} from "lucide-react";

export default function FlightManagement() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl my-4 font-bold">Gestión de Vuelos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Link
            href="/gestion-vuelos-b/flights"
            className="relative overflow-hidden p-4 rounded-lg flex items-center gap-4 text-gray-700 border border-gray-300 hover:border-primary hover:shadow-lg hover:shadow-blue-100 transition-all"
          >
            <GlobeIcon className="absolute top-2 right-2 h-32 w-32 text-primary opacity-30 rotate-12" />
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold">Vuelos</h2>
              <p className="text-sm font-normal text-gray-500">
                Gestiona los vuelos disponibles para los pasajeros
              </p>
            </div>
          </Link>
          <Link
            href="/gestion-vuelos-b/airplane-types"
            className="relative overflow-hidden p-4 rounded-lg flex items-center gap-4 text-gray-700 border border-gray-300 hover:border-primary hover:shadow-lg hover:shadow-blue-100 transition-all"
          >
            <PlaneIcon className="absolute top-2 right-2 h-32 w-32 text-primary opacity-30" />
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold">Aeronaves</h2>
              <p className="text-sm font-normal text-gray-500">
                Gestiona los modelos de aeronaves disponibles para los vuelos
              </p>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
