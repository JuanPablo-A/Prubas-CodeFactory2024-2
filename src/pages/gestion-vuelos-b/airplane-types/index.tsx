import React from "react";
import {
  CaretSortIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteAirplaneType,
  getAllAirplaneTypes,
} from "@/services/gestion-vuelos-b/airplane-types";
import { useMutation, useQuery } from "react-query";
import type { AirplaneType } from "@/services/gestion-vuelos-b/types";
import { EyeIcon, PenIcon, Settings2Icon, TrashIcon } from "lucide-react";
import Navbar from "@/components/navbar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import AirplaneDetails from "@/components/gestion-vuelos-b/airplane-details";

export default function AirplaneTypesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [airplaneDetailsId, setAirplaneDetailsId] = React.useState<
    string | null
  >(null);

  const query = useQuery({
    queryFn: getAllAirplaneTypes,
    queryKey: "airplane-types",
  });

  const deleteMutation = useMutation(deleteAirplaneType, {
    onSuccess: () => {
      toast({
        title: "¡Éxito!",
        description: "Tipo de avión eliminado exitosamente",
      });
      query.refetch();
    },
    onError: () => {
      toast({
        title: "Algo salió mal",
        description: "No se pudo eliminar el tipo de avión",
      });
    },
  });

  const columns: ColumnDef<AirplaneType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      id: "modelo",
      header: () => <div className="text-center">Modelo</div>,
      cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
    },
    {
      accessorKey: "type.name",
      id: "family",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            Familia de avión
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.original.type.name}</div>
      ),
    },
    {
      accessorKey: "maxSeats",
      id: "número de asientos",
      header: () => <div className="text-center">Número de asientos</div>,
      cell: ({ row }) => {
        return <div className="text-center">{row.original.maxSeats}</div>;
      },
    },
    {
      accessorKey: "seatsDistribution",
      id: "distribución de asientos",
      header: () => <div className="text-center">Distribución de asientos</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.original.seatsDistribution}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        // TODO: Implementar la edición de tipos de aviones
        const airplaneType = row.original.id;
        const airplaneTypeFamily = row.original.type.name;

        return (
          <div className="flex justify-center">
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir Menu</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="inline-flex items-center w-full"
                    onClick={() =>
                      router.push(
                        `/gestion-vuelos-b/airplane-types/edit/${airplaneType}`
                      )
                    }
                  >
                    <PenIcon className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="inline-flex items-center w-full"
                    onClick={() => {
                      setAirplaneDetailsId(row.original.id);
                    }}
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                    <DropdownMenuItem className="inline-flex items-center w-full text-red-500 sm:hover:text-red-700 sm:hover:bg-red-100">
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <ConfirmDialog
                titleMessage="¿Estás seguro de eliminar este tipo de avión?"
                descriptionMessage={`Si seleccionas 'Eliminar', el tipo de avión '${airplaneTypeFamily} ${airplaneType}' será eliminado y no podrás recuperarlo.`}
                confirmLabel="Eliminar"
                onConfirm={() => {
                  deleteMutation.mutate(airplaneType);
                }}
                confirmButtonId="confirm-delete-airplane"
              />
            </Dialog>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: query.data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <Navbar />
      <div className="w-full p-4 sm:p-12">
        <h1 className="text-4xl font-bold">Aeronaves</h1>
        <div className="flex items-center py-4 gap-4 justify-between">
          <Input
            id="filter-airplane-type-model"
            placeholder="Filtrar por modelo"
            value={
              (table.getColumn("modelo")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("modelo")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex gap-4 items-center">
            <Button
              id="add-airplane-type"
              variant="default"
              className="inline-flex items-center gap-2"
              onClick={() =>
                router.push("/gestion-vuelos-b/airplane-types/create")
              }
            >
              <PlusIcon className="h-4 w-4" /> Agregar aeronave
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto gap-2">
                  <Settings2Icon className="h-4 w-4" /> Configurar vista
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.columnDef.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    id={row.original.id}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} id={cell.column.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {query.isLoading
                      ? "Cargando..."
                      : "No hay datos para mostrar."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s)
          </div>
          <div className="space-x-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    style={{
                      pointerEvents: table.getCanPreviousPage()
                        ? "auto"
                        : "none",
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    style={{
                      pointerEvents: table.getCanNextPage() ? "auto" : "none",
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      {airplaneDetailsId !== null && (
        <Dialog
          open={airplaneDetailsId !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setAirplaneDetailsId(null);
            }
          }}
        >
          <AirplaneDetails airplaneId={airplaneDetailsId} />
        </Dialog>
      )}
    </>
  );
}
