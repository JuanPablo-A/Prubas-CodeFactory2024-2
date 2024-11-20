import Navbar from "@/components/navbar";

import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { useToast } from "@/hooks/use-toast";

import {
  updateAirplaneType,
  getAirplaneTypeById,
} from "@/services/gestion-vuelos-b/airplane-types";
import AirplaneForm from "@/components/gestion-vuelos-b/airplane-form";
import {
  AirplaneType,
  AirplaneTypePayload,
} from "@/services/gestion-vuelos-b/types";
import { LoaderCircleIcon } from "lucide-react";

/**
 * Page used to edit an airplane type, this page receives the airplaneTypeId as a path parameter
 * and fetches the airplane type data to populate the form.
 *
 * @returns page component to edit an airplane type
 */
export default function EditAirplaneTypePage() {
  const router = useRouter();
  const { toast } = useToast();

  const { airplaneTypeId } = router.query;

  const { data: airplaneType, isLoading } = useQuery({
    queryKey: ["airplane-type", airplaneTypeId],
    queryFn: () => getAirplaneTypeById(airplaneTypeId as string),
  });

  /**
   * Mutation used to update the airplane type data
   * This mutation is triggered when the form is submitted
   *
   * @param { AirplaneTypePayload } airplaneTypePayload The data to update the airplane type
   */
  const updateAirplaneTypeMutation = useMutation<
    AirplaneType,
    unknown,
    AirplaneTypePayload
  >(updateAirplaneType, {
    onSuccess: () => {
      toast({
        title: "Tipo de aeronave actualizado",
        description: "El tipo de aeronave ha sido actualizado exitosamente",
      });
      router.push("/gestion-vuelos-b/airplane-types");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el tipo de aeronave",
      });
    },
  });

  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-6 w-full p-4 sm:p-12">
        <h1 className="text-4xl font-bold">Editar tipo de aeronave</h1>
        <div
          className="flex relative flex-col items-start gap-8"
          x-chunk="dashboard-03-chunk-0"
        >
          {isLoading ? (
            <div className="w-full flex justify-center items-center py-8">
              <LoaderCircleIcon size={16} className="animate-spin mr-2" />
              <p>Cargando...</p>
            </div>
          ) : (
            <AirplaneForm
              airplane={airplaneType}
              sendDataMutation={updateAirplaneTypeMutation}
            />
          )}
        </div>
      </main>
    </>
  );
}
