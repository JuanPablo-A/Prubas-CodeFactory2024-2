import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import {
  CalendarIcon,
  Compass,
  GlobeIcon,
  Menu,
  PlaneIcon,
  Search,
  UserIcon,
} from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex w-screen items-center justify-between top-0 h-20 gap-4 border-b bg-primary text-white px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Mostrar menú de navegación</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-12">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="inline-flex items-center gap-4 mb-4 text-lg font-semibold"
            >
              <Compass className="h-6 w-6" />
              <span className="font-bold text-2xl">Singapur Airlines</span>
            </Link>
            <div className="relative">
              <Search className="h-4 w-4 absolute top-1/2 left-2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
            <Link
              href="/account"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-4"
            >
              <UserIcon className="h-6 w-6" />
              Mi cuenta
            </Link>
            <Link
              href="/gestion-vuelos-b/airplane-types"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-4"
            >
              <PlaneIcon className="h-6 w-6" />
              Aeronaves
            </Link>
            <Link
              href="/gestion-vuelos-b/flights"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-4"
            >
              <GlobeIcon className="h-6 w-6" />
              Vuelos
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-4"
            >
              <CalendarIcon className="h-6 w-6" />
              Reservas
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Compass className="h-6 w-6" />
        <h1 className="relative bottom-[2px] text-2xl font-medium">
          Singapur Airlines
        </h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="rounded-full">
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="rounded-full"
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Ajustes</DropdownMenuItem>
          <DropdownMenuItem>Soporte</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Navbar;
