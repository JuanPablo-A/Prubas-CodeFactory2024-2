import Navbar from "@/components/navbar";
import { useMutation } from "react-query";
import { createAirplaneType } from "@/services/gestion-vuelos-b/airplane-types";
import { useRouter } from "next/navigation";
import AirplaneForm from "@/components/gestion-vuelos-b/airplane-form";
import {
  AirplaneType,
  AirplaneTypePayload,
} from "@/services/gestion-vuelos-b/types";
import { useToast } from "@/hooks/use-toast";

export default function CreateAirplaneTypePage() {
  const router = useRouter();
  const { toast } = useToast();

  const createAirplaneTypeMutation = useMutation<
    AirplaneType,
    unknown,
    AirplaneTypePayload
  >(createAirplaneType, {
    onSuccess: () => {
      toast({
        title: "Aeronave creada",
        description: "La aeronave ha sido creada exitosamente",
      });
      router.push("/gestion-vuelos-b/airplane-types");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Ocurrió un error al crear la aeronave",
      });
    },
  });

  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-6 w-full p-4 sm:p-12">
        <h1 className="text-4xl font-bold">Agregar aeronave</h1>
        <div
          className="flex relative flex-col items-start gap-8"
          x-chunk="dashboard-03-chunk-0"
        >
          <AirplaneForm sendDataMutation={createAirplaneTypeMutation} />
        </div>
      </main>
    </>
  );
}
