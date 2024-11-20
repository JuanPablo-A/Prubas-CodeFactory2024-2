import { UseMutationResult, useQuery } from "react-query";
import { FormEvent, useState } from "react";
import { getAllAirplaneTypes } from "@/services/gestion-vuelos-b/airplane-types";
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
import { LoaderCircleIcon, SaveIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "next/router";

import type { Flight, FlightPayload } from "@/services/gestion-vuelos-b/types";

type FlightFormProps = {
  flight?: Flight;
  sendDataMutation: UseMutationResult<string, unknown, FlightPayload>;
};

/**
 * FlightForm component represents a form for managing flight details.
 *
 * @component
 * @example
 * ```tsx
 * <FlightForm
 *   flight={flightData}
 *   sendDataMutation={sendDataMutation}
 * />
 * ```
 */
export const FlightForm = (props: FlightFormProps) => {
  const router = useRouter();
  const airplaneTypesQuery = useQuery({
    queryFn: getAllAirplaneTypes,
    queryKey: "airplaneTypes",
  });

  const [flightNumber, setFlightNumber] = useState(
    props.flight?.flightNumber ?? ""
  );
  const [airplaneTypeId, setAirplaneTypeId] = useState(
    props.flight?.airplaneType.id ?? ""
  );
  const [flightTypeId, setFlightTypeId] = useState<"1" | "2">(
    (props.flight?.flightType.id as "1" | "2") ?? "1"
  );
  const [price, setPrice] = useState(props.flight?.price ?? 0);
  const [surchargePercentage, setSurchargePercentage] = useState(
    props.flight?.surchargePercentage ?? 0
  );
  const [taxPercentage, setTaxPercentage] = useState(
    props.flight?.taxPercentage ?? 0
  );

  const [departureDate, setDepartureDate] = useState(
    props.flight
      ? new Date(
          `${props.flight?.departureDate} ${props.flight?.departureTime}`
        )
          .toISOString()
          .slice(0, 16)
      : ""
  );
  const [arrivalDate, setArrivalDate] = useState(
    props.flight
      ? new Date(`${props.flight?.arrivalDate} ${props.flight?.arrivalTime}`)
          .toISOString()
          .slice(0, 16)
      : ""
  );
  const [originIata, setOriginIata] = useState(
    props.flight?.origin.iataCode ?? ""
  );
  const [destinationIata, setDestinationIata] = useState(
    props.flight?.destination.iataCode ?? ""
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.sendDataMutation.mutate({
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
    <form className="w-full p-4 pt-0 sm:p-12 sm:pt-0 flex flex-col gap-8">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Características del vuelo
        </legend>
        <div className="flex gap-8 [&>div]:flex-1">
          <div className="grid w-full items-center gap-1.5">
            <Label>Número de vuelo</Label>
            <Input
              id="flight-number"
              placeholder="SA1234"
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              maxLength={6}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label>Tipo de avión</Label>
            <Select value={airplaneTypeId} onValueChange={setAirplaneTypeId}>
              <SelectTrigger id="airplane-type-select">
                <SelectValue placeholder="Selecciona un tipo de avión" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {airplaneTypesQuery.data?.map((airplaneType) => (
                    <SelectItem
                      key={airplaneType.id}
                      value={airplaneType.id}
                      id={airplaneType.id}
                    >
                      {airplaneType.type.name} - {airplaneType.id}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid items-center justify-start gap-1.5">
            <Label>Tipo de vuelo</Label>
            <ToggleGroup
              type="single"
              defaultValue="1"
              value={flightTypeId}
              onValueChange={(e) => setFlightTypeId(e as "1" | "2")}
            >
              <ToggleGroupItem variant="outline" value="1" id="national-flight">
                Nacional
              </ToggleGroupItem>
              <ToggleGroupItem
                variant="outline"
                value="2"
                id="international-flight"
              >
                Internacional
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="flex gap-8 [&>div]:flex-1">
          <div className="grid w-full items-center gap-1.5">
            <Label>Precio</Label>
            <Input
              id="price"
              placeholder="0.00"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label>Porcentaje de sobrecargo</Label>
            <Input
              id="surcharge-percentage"
              placeholder="0%"
              type="number"
              min={0}
              value={surchargePercentage}
              onChange={(e) => setSurchargePercentage(Number(e.target.value))}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label>Porcentaje de impuestos</Label>
            <Input
              id="tax-percentage"
              placeholder="0%"
              type="number"
              min={0}
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex gap-8 [&>div]:flex-1">
          <div className="grid items-center gap-1.5">
            <Label>Salida</Label>
            <div className="flex gap-4">
              <Input
                id="departure-airport"
                placeholder="Aeropuerto (IATA)"
                type="text"
                min={0}
                value={originIata}
                onChange={(e) => setOriginIata(e.target.value)}
              />
              <Input
                id="departure-date"
                type="datetime-local"
                min={0}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid items-center gap-1.5">
            <Label>Llegada</Label>
            <div className="flex gap-4">
              <Input
                id="arrival-airport"
                placeholder="Aeropuerto (IATA)"
                type="text"
                min={0}
                value={destinationIata}
                onChange={(e) => setDestinationIata(e.target.value)}
              />
              <Input
                id="arrival-date"
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
      </fieldset>
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/gestion-vuelos-b/flights")}
        >
          Cancelar
        </Button>
        <Button
          id="save-changes"
          className="w-fit"
          onClick={handleSubmit}
          disabled={props.sendDataMutation.isLoading || !allFieldsFilled}
        >
          {props.sendDataMutation.isLoading ? (
            <>
              <LoaderCircleIcon className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <SaveIcon size={16} className="mr-2" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
