import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useQuery } from "react-query";
import { getFlightById } from "@/services/gestion-vuelos-b/flights";
import { DialogClose } from "@radix-ui/react-dialog";
import { AlertTriangleIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface IFlightDetailsProps {
  flightId: string;
}

/**
 * Renders the flight details component.
 *
 * @component
 * @param {IFlightDetailsProps} props - The component props.
 * @param {string} props.flightId - The ID of the flight.
 * @returns {JSX.Element} The rendered FlightDetails component.
 */
const FlightDetails = ({ flightId }: IFlightDetailsProps) => {
  const router = useRouter();

  const {
    data: flight,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["flight", flightId],
    queryFn: () => getFlightById(flightId),
  });

  return (
    <DialogContent className="w-full p-4 sm:p-12 max-w-[min(90%,920px)]">
      <DialogTitle className="text-2xl font-bold">
        Detalle del vuelo
      </DialogTitle>
      <DialogDescription className="text-lg font-medium mt-4">
        {isLoading ? (
          <p>Cargando...</p>
        ) : isError ? (
          <p className="flex items-center gap-2 text-red-500">
            <AlertTriangleIcon /> Ocurrió un error al cargar el vuelo
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-full flex justify-between gap-4">
              <p className="text-xl font- semibold text-black">
                Vuelo {flight?.flightNumber}
              </p>
              <div className="inline-flex gap-2">
                <Button
                  variant="outline"
                  className="inline-flex gap-2"
                  onClick={() =>
                    router.push(`/gestion-vuelos-b/flights/edit/${flightId}`)
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
                <b>Estado:</b> {flight?.status.statusName}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Tipo de vuelo:</b> {flight?.flightType.name}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Origen:</b> {flight?.origin.iataCode}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Destino:</b> {flight?.destination.iataCode}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Fecha de salida:</b> {flight?.departureDate}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Hora de salida:</b> {flight?.departureTime}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Fecha de llegada:</b> {flight?.arrivalDate}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Hora de llegada:</b> {flight?.arrivalTime}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Tipo de avión:</b> {flight?.airplaneType.type.name}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Capacidad de pasajeros:</b> {flight?.airplaneType.maxSeats}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Precio:</b> {flight?.price}
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Impuesto:</b> {flight?.taxPercentage}%
              </p>
              <p className="text-lg font-medium mt-4">
                <b>Recargo:</b> {flight?.surchargePercentage}%
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

export default FlightDetails;
