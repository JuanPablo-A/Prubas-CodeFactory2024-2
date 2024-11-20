import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useQuery } from "react-query";
import { getAirplaneTypeById } from "@/services/gestion-vuelos-b/airplane-types";
import { DialogClose } from "@radix-ui/react-dialog";
import { AlertTriangleIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface IAirplaneDetailsProps {
  airplaneId: string;
}

/**
 * Component for displaying details of an airplane.
 *
 * @component
 * @example
 * ```tsx
 * <AirplaneDetails airplaneId={123} />
 * ```
 */
const AirplaneDetails = ({ airplaneId }: IAirplaneDetailsProps) => {
  const router = useRouter();

  const {
    data: airplane,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["airplane", airplaneId],
    queryFn: () => getAirplaneTypeById(airplaneId),
  });

  return (
    <DialogContent className="w-full p-4 sm:p-12 max-w-[min(90%,920px)]">
      <DialogTitle className="text-2xl font-bold">
        Detalle de la aeronave
      </DialogTitle>
      <DialogDescription className="text-lg font-medium mt-4">
        {isLoading ? (
          <p>Cargando...</p>
        ) : isError ? (
          <p className="flex items-center gap-2 text-red-500">
            <AlertTriangleIcon /> Ocurrió un error al cargar la aeronave
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-full flex justify-between gap-4">
              <p className="text-xl font- semibold text-black">
                Aeronave {airplane?.id}
              </p>
              <div className="inline-flex gap-2">
                <Button
                  variant="outline"
                  className="inline-flex gap-2"
                  onClick={() =>
                    router.push(
                      `/gestion-vuelos-b/airplane-types/edit/${airplaneId}`
                    )
                  }
                >
                  <PencilIcon /> Editar
                </Button>
                <Button variant="destructive" className="inline-flex gap-2">
                  <TrashIcon /> Eliminar
                </Button>
              </div>
            </div>
            <hr className="w-full border-t border-gray-300" />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-lg font-medium mt-4">
                <b>Familia:</b> {airplane?.type.name}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Modelo:</b> {airplane?.id}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Distribución de asientos:</b> {airplane?.seatsDistribution}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Capacidad de pasajeros:</b> {airplane?.maxSeats}
              </p>
            </div>
          </div>
        )}
      </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cerrar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default AirplaneDetails;
