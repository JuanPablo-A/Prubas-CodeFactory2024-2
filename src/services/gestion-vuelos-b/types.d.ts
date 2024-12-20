// City TypeScript Interface
interface City {
  iataCode: string;
  airportName: string;
  country: string;
}

// FlightType TypeScript Interface
interface FlightType {
  id: string;
  name: "Nacional" | "Internacional";
}

// Type TypeScript Interface
interface Type {
  id: string;
  name: string;
}

// AirplaneType TypeScript Interface
interface AirplaneType {
  id: string;
  type: Type; // Type of airplane
  maxSeats: number;
  seatsDistribution: string; // Example: "2-4-2", "3-3-3"
}

// AirplaneTypePayload TypeScript Interface
interface AirplaneTypePayload {
  id: string;
  typeId: number;
  maxSeats: number;
  seatsDistribution: string;
}

// Status TypeScript Interface
type Status = {
  id: string;
  statusName: "Scheduled" | "Completed" | "Cancelled";
};

// Flight TypeScript Interface
export type Flight = {
  id: string;
  flightNumber: string;
  origin: City;
  destination: City;
  price: number;
  taxPercentage: number;
  surchargePercentage: number;
  departureDate: string;
  arrivalDate: string;
  departureTime: string;
  arrivalTime: string;
  flightType: FlightType;
  airplaneType: AirplaneType;
  status: Status;
};

export type FlightPayload = {
  flightNumber: string;
  originIata: string;
  destinationIata: string;
  departureDate: string;
  arrivalDate: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  taxPercentage: number;
  surchargePercentage: number;
  flightTypeId: string;
  airplaneTypeId: string;
  statusId: string;
}
export type FlightUpdatePayload = FlightPayload & {
  id: string;
}