import Navbar from "@/components/navbar";
import { createFlight } from "@/services/gestion-vuelos-b/flights";
import { useMutation } from "react-query";
import { useToast } from "@/hooks/use-toast";
import {FlightForm} from "@/components/gestion-vuelos-b/flight-form";
import { useRouter } from "next/router";

export default function CreateFlightPage() {
  const { toast } = useToast();
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: createFlight,
    onSuccess: () => {
      toast({
        title: "¡Éxito!",
        description: "Vuelo creado exitosamente",
      });
      router.push("/gestion-vuelos-b/flights");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "¡Error!",
        description: "Ocurrió un error al crear el vuelo, verifica los datos",
      });
    },
  });

  return (
    <>
      <Navbar />
      <div className="w-full p-4 sm:p-12">
        <h1 className="text-4xl font-bold">Crear vuelo</h1>
      </div>
      <FlightForm sendDataMutation={mutation} />
    </>
  );
}
