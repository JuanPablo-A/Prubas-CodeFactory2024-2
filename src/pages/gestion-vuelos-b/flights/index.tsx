import React from "react";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";

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
import { getAllFlights } from "@/services/gestion-vuelos-b/flights";
import { useQuery } from "react-query";
import type { Flight } from "@/services/gestion-vuelos-b/types";
import {
  EyeIcon,
  PenIcon,
  PlusIcon,
  Settings2Icon,
  TrashIcon,
} from "lucide-react";
import Navbar from "@/components/navbar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columns: ColumnDef<Flight>[] = [
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
    accessorKey: "flightNumber",
    id: "número de vuelo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Número de vuelo
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.original.flightNumber}</div>
    ),
  },
  {
    accessorKey: "status",
    id: "estado",
    header: () => <div className="text-right">Estado</div>,
    cell: ({ row }) => {
      return (
        <div className="w-full inline-flex justify-end">
          <Badge variant="secondary">{row.original.status.statusName}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "flightType",
    id: "tipo de vuelo",
    header: () => <div className="text-right">Tipo de vuelo</div>,
    cell: ({ row }) => {
      return (
        <div className="w-full inline-flex justify-end">
          <Badge>{row.original.flightType.name}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "origin.airportName",
    id: "origen",
    header: () => <div className="text-right">Origen</div>,
    cell: ({ row }) => {
      return <div className="text-right">{row.original.origin.iataCode}</div>;
    },
  },
  {
    accessorKey: "destination.airportName",
    id: "destino",
    header: () => <div className="text-right">Destino</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">{row.original.destination.iataCode}</div>
      );
    },
  },
  {
    accessorKey: "departureDate",
    id: "fecha de salida",
    header: () => <div className="text-right">Fecha de salida</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {new Intl.DateTimeFormat("es", {
            month: "short",
            day: "2-digit",
          }).format(new Date(row.original.departureDate))}{" "}
          {row.original.departureTime}
        </div>
      );
    },
  },
  {
    accessorKey: "arrivalDate",
    id: "fecha de llegada",
    header: () => <div className="text-right">Fecha de llegada</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {new Intl.DateTimeFormat("es", {
            month: "short",
            day: "2-digit",
          }).format(new Date(row.original.arrivalDate))}{" "}
          {row.original.arrivalTime}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({}) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir Menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem className="inline-flex items-center w-full">
              <PenIcon className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="inline-flex items-center w-full">
              <EyeIcon className="h-4 w-4 mr-2" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="inline-flex items-center w-full text-red-500 sm:hover:text-red-700 sm:hover:bg-red-100">
              <TrashIcon className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function FlightsPage() {
  const query = useQuery({
    queryKey: "flights",
    queryFn: getAllFlights,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: query.data ?? [],
    columns: columns as ColumnDef<Partial<Flight>>[],
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
        <h1 className="text-4xl font-bold">Vuelos</h1>
        <div className="flex items-center py-4 w-full justify-between">
          <Input
            placeholder="Filtrar por número de vuelo"
            value={
              (table
                .getColumn("número de vuelo")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("número de vuelo")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex gap-4 items-center">
            <Link href="flights/create">
              <Button
                variant="default"
                className="inline-flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" /> Crear vuelo
              </Button>
            </Link>
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
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                    No hay datos para mostrar.
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
    </>
  );
}
