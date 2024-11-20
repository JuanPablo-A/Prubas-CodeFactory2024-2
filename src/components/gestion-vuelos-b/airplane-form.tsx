import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon, Plus, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { UseMutationResult, useQuery } from "react-query";
import { getAllAirplaneFamilies } from "@/services/gestion-vuelos-b/airplane-types";
import {
  AirplaneType,
  AirplaneTypePayload,
} from "@/services/gestion-vuelos-b/types";

interface IAirplaneFormProps {
  airplane?: AirplaneType;
  sendDataMutation: UseMutationResult<
    AirplaneType,
    unknown,
    AirplaneTypePayload
  >;
}

const MAX_ALLOWED_SEATS_ROWS = 8;

/**
 * This form is used to create or update an airplane type.
 * If the airplane prop is passed, the form will be used to update the airplane type.
 * Otherwise, the form will be used to create a new airplane type.
 *
 * @param { IAirplaneFormProps } { airplane, handleSubmit }
 * @param { AirplaneType } airplane The airplane type to update
 * @param { (event: React.FormEvent<HTMLFormElement>) => void } handleSubmit The function to handle the form submission
 * @returnss
 */
const AirplaneForm = ({ airplane, sendDataMutation }: IAirplaneFormProps) => {
  const [seatsDistribution, setSeatsDistribution] = useState<
    Record<number, number | null>
  >(
    airplane
      ? airplane.seatsDistribution.split("-").reduce((acc, cur, i) => {
          acc[i] = parseInt(cur);
          return acc;
        }, {} as Record<number, number | null>)
      : { 0: 1 }
  );
  const router = useRouter();

  const familiesQuery = useQuery({
    queryKey: "airplane-families",
    queryFn: getAllAirplaneFamilies,
  });

  const handleSeatsDistributionAdd = () => {
    if (Object.keys(seatsDistribution).length >= MAX_ALLOWED_SEATS_ROWS) {
      return;
    }
    setSeatsDistribution({
      ...seatsDistribution,
      [Math.max(...Object.keys(seatsDistribution).map(Number)) + 1]: 1,
    });
  };

  const handleSeatsDistributionChange = (index: number, value: string) => {
    setSeatsDistribution({
      ...seatsDistribution,
      [index]: value === "" ? null : parseInt(value),
    });
  };

  const handleSeatsDistributionRemove = (index: number) => {
    if (Object.keys(seatsDistribution).length === 1) {
      return;
    }

    const newSeatsDistribution = { ...seatsDistribution };
    delete newSeatsDistribution[index];
    setSeatsDistribution(newSeatsDistribution);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.values(seatsDistribution).some((x) => x === null)) {
      alert("Por favor, completa la distribución de asientos");
      return;
    }

    const form = new FormData(event.currentTarget);
    const name = form.get("name") as string;
    const familyId = form.get("family") as string;
    const maxSeats = parseInt(form.get("maxSeats") as string);

    sendDataMutation.mutate({
      id: airplane?.id ?? name,
      typeId: parseInt(familyId),
      maxSeats,
      seatsDistribution: Object.values(seatsDistribution).join("-"),
    });
  };

  return (
    <form className="grid w-full items-start gap-6" onSubmit={handleSubmit}>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Características del modelo
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Ej. A320"
            disabled={airplane !== undefined}
            defaultValue={airplane?.id}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-3">
            <Label htmlFor="family">Familia</Label>
            <Select
              name="family"
              defaultValue={airplane?.type.id.toString()}
              required
            >
              <SelectTrigger
                id="family"
                className="items-start [&_[data-description]]:hidden"
              >
                <SelectValue placeholder="Selecciona una familia" />
              </SelectTrigger>
              <SelectContent>
                {familiesQuery.isLoading ? (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                ) : familiesQuery.isError ? (
                  <SelectItem disabled value="error">
                    Error loading families
                  </SelectItem>
                ) : (
                  familiesQuery.data?.map((family) => (
                    <SelectItem
                      key={family.id}
                      value={family.id.toString()}
                      id={family.name}
                    >
                      {family.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="maxSeats">Número de asientos</Label>
            <Input
              id="maxSeats"
              name="maxSeats"
              type="number"
              placeholder="Ej. 100"
              min={1}
              max={10000}
              defaultValue={airplane?.maxSeats}
              required
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="seatsDistribution">
            Distribución de asientos:{" "}
            <span className="text-primary tracking-[0.5rem]">
              {Object.values(seatsDistribution)
                .map((x) => x ?? "X")
                .join("-")}
            </span>
          </Label>
          <Button
            id="add-seats-distribution-row"
            type="button"
            variant="default"
            onClick={handleSeatsDistributionAdd}
            className="justify-center w-fit"
            disabled={
              Object.keys(seatsDistribution).length >= MAX_ALLOWED_SEATS_ROWS
            }
          >
            <Plus size={24} /> Agregar fila
          </Button>
        </div>
        <div className="w-full flex gap-4 justify-between flex-wrap">
          {Object.entries(seatsDistribution).map(([index, value]) => (
            <div
              id={`seats-distribution-${index}`}
              key={index}
              className="flex-[1_1_12rem] flex flex-col items-center w-full gap-4"
            >
              <Input
                id={`seatsDistribution[${index}]`}
                type="number"
                min={1}
                max={10}
                placeholder="Ej. 3"
                value={value ?? ""}
                className="text-center text-2xl"
                onChange={(e) =>
                  handleSeatsDistributionChange(parseInt(index), e.target.value)
                }
                required
              />
              <Button
                type="button"
                variant="link"
                onClick={() => handleSeatsDistributionRemove(parseInt(index))}
                className="justify-center w-12 text-red-600"
                disabled={Object.keys(seatsDistribution).length === 1}
              >
                Eliminar fila
              </Button>
            </div>
          ))}
        </div>
      </fieldset>
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/gestion-vuelos-b/airplane-types")}
        >
          Cancelar
        </Button>
        <Button
          id="submit-airplane-form"
          type="submit"
          variant="default"
          disabled={sendDataMutation.isLoading}
        >
          {sendDataMutation.isLoading ? (
            <>
              <LoaderCircleIcon size={16} className="mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <SaveIcon size={16} className="mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AirplaneForm;
