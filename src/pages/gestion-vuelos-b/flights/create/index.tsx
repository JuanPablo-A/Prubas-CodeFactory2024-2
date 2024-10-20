import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { getAllAirplaneTypes } from "@/services/gestion-vuelos-b/airplane-types";
import { createFlight } from "@/services/gestion-vuelos-b/flights";
import { LoaderCircleIcon, SaveIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "react-query";

export default function CreateFlightPage() {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createFlight,
    onSuccess: () => {
      toast({
        title: "¡Éxito!",
        description: "Vuelo creado exitosamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "¡Error!",
        description: "Ocurrió un error al crear el vuelo, verifica los datos",
      });
    },
  });

  const airplaneTypesQuery = useQuery({
    queryFn: getAllAirplaneTypes,
    queryKey: "airplaneTypes",
  });

  const [flightNumber, setFlightNumber] = useState("");
  const [airplaneTypeId, setAirplaneTypeId] = useState("");
  const [flightTypeId, setFlightTypeId] = useState<"1" | "2">("1");
  const [price, setPrice] = useState(0);
  const [surchargePercentage, setSurchargePercentage] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [originIata, setOriginIata] = useState("");
  const [destinationIata, setDestinationIata] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      airplaneTypeId: airplaneTypeId,
      arrivalDate: arrivalDate.split("T")[0],
      arrivalTime: arrivalDate.split("T")[1],
      departureDate: departureDate.split("T")[0],
      departureTime: departureDate.split("T")[1],
      destinationIata: destinationIata,
      flightNumber: flightNumber,
      flightTypeId: flightTypeId,
      originIata: originIata,
      price,
      statusId: "1",
      surchargePercentage: surchargePercentage,
      taxPercentage: taxPercentage,
    });
  };

  const allFieldsFilled = [
    flightNumber,
    airplaneTypeId,
    flightTypeId,
    price,
    surchargePercentage,
    taxPercentage,
    departureDate,
    arrivalDate,
    originIata,
    destinationIata,
  ].every((field) => field !== "");

  return (
    <>
      <Navbar />
      <div className="w-full p-4 sm:p-12">
        <h1 className="text-4xl font-bold">Crear vuelo</h1>
      </div>
      <form className="w-full p-4 pt-0 sm:p-12 sm:pt-0 flex flex-col gap-8">
        <div className="flex gap-8">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Número de vuelo</Label>
            <Input
              placeholder="SA1234"
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              maxLength={6}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Tipo de avión</Label>
            <Select value={airplaneTypeId} onValueChange={setAirplaneTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo de avión" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {airplaneTypesQuery.data?.map((airplaneType) => (
                    <SelectItem key={airplaneType.id} value={airplaneType.id}>
                      {airplaneType.type.name} - {airplaneType.id}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid max-w-sm items-center gap-1.5">
            <Label>Tipo de vuelo</Label>
            <ToggleGroup
              type="single"
              defaultValue="1"
              value={flightTypeId}
              onValueChange={(e) => setFlightTypeId(e as "1" | "2")}
            >
              <ToggleGroupItem variant="outline" value="1">
                Nacional
              </ToggleGroupItem>
              <ToggleGroupItem variant="outline" value="2">
                Internacional
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Precio</Label>
            <Input
              placeholder="0.00"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Porcentaje de sobrecargo</Label>
            <Input
              placeholder="0%"
              type="number"
              min={0}
              value={surchargePercentage}
              onChange={(e) => setSurchargePercentage(Number(e.target.value))}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Porcentaje de impuestos</Label>
            <Input
              placeholder="0%"
              type="number"
              min={0}
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex gap-8">
          <div className="grid max-w-sm items-center gap-1.5">
            <Label>Salida</Label>
            <div className="flex gap-4">
              <Input
                placeholder="Aeropuerto (IATA)"
                type="text"
                min={0}
                value={originIata}
                onChange={(e) => setOriginIata(e.target.value)}
              />
              <Input
                type="datetime-local"
                min={0}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid max-w-sm items-center gap-1.5">
            <Label>Llegada</Label>
            <div className="flex gap-4">
              <Input
                placeholder="Aeropuerto (IATA)"
                type="text"
                min={0}
                value={destinationIata}
                onChange={(e) => setDestinationIata(e.target.value)}
              />
              <Input
                type="datetime-local"
                min={0}
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        {!allFieldsFilled && (
          <p className="text-red-500 text-sm">
            Todos los campos son requeridos
          </p>
        )}
        <Button
          className="w-fit"
          onClick={handleSubmit}
          disabled={mutation.isLoading || !allFieldsFilled}
        >
          {mutation.isLoading ? (
            <>
              <LoaderCircleIcon className="animate-spin" />
              Creando...
            </>
          ) : (
            <>
              <SaveIcon size={16} className="mr-2" />
              Crear vuelo
            </>
          )}
        </Button>
      </form>
    </>
  );
}
