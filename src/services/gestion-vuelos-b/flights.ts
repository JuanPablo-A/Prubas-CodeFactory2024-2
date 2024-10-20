import { GraphQLClient } from "graphql-request";
import { Flight } from "./types.d";

// You can replace this with your actual backend GraphQL API endpoint
const API_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_FLIGHT_MANAGEMENT_B_API_URL ||
  "http://localhost:4000/graphql";

export const gqlClient = new GraphQLClient(API_URL);

export const getAllFlights = async () => {
  const query = `
    query {
      getAllFlights {
        id
        flightNumber
        origin {
          iataCode
          airportName
          country
        }
        destination {
          iataCode
          airportName
          country
        }
        price
        taxPercentage
        surchargePercentage
        departureDate
        arrivalDate
        departureTime
        arrivalTime
        flightType {
          id
          name
        }
        airplaneType {
          id
          type {
            id
            name
          }
          maxSeats
          seatsDistribution
        }
        status {
          id
          statusName
        }
      }
    }
  `;
  const response: {
    getAllFlights: Partial<Flight>[];
  } = await gqlClient.request(query);
  return response.getAllFlights;
};

export const getFlightById = async (id: string) => {
  const query = `
    query($id: ID!) {
      getFlightById(id: $id) {
        id
        flightNumber
        origin {
          iataCode
          airportName
          country
        }
        destination {
          iataCode
          airportName
          country
        }
        price
        taxPercentage
        surchargePercentage
        departureDate
        arrivalDate
        departureTime
        arrivalTime
        flightType {
          id
          name
        }
        airplaneType {
          id
          type {
            id
            name
          }
          maxSeats
          seatsDistribution
        }
        status {
          id
          statusName
        }
      }
    }
  `;
  const variables = { id };
  const response: Record<string, string> = await gqlClient.request(
    query,
    variables
  );
  return response.getFlightById;
};

export const createFlight = async (input: {
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
}) => {
  const mutation = `
    mutation(
      $flightNumber: String!, 
      $originIata: String!, 
      $destinationIata: String!, 
      $departureDate: String!, 
      $arrivalDate: String!, 
      $departureTime: String!, 
      $arrivalTime: String!, 
      $price: Float!, 
      $taxPercentage: Float!, 
      $surchargePercentage: Float!, 
      $flightTypeId: ID!, 
      $airplaneTypeId: ID!, 
      $statusId: ID!
    ) {
      createFlight(
        flightNumber: $flightNumber,
        originIata: $originIata,
        destinationIata: $destinationIata,
        departureDate: $departureDate,
        arrivalDate: $arrivalDate,
        departureTime: $departureTime,
        arrivalTime: $arrivalTime,
        price: $price,
        taxPercentage: $taxPercentage,
        surchargePercentage: $surchargePercentage,
        flightTypeId: $flightTypeId,
        airplaneTypeId: $airplaneTypeId,
        statusId: $statusId
      ) {
        id
        flightNumber
        origin {
          iataCode
          airportName
          country
        }
        destination {
          iataCode
          airportName
          country
        }
        price
        taxPercentage
        surchargePercentage
        departureDate
        arrivalDate
        departureTime
        arrivalTime
        flightType {
          id
          name
        }
        airplaneType {
          id
          type {
            id
            name
          }
          maxSeats
          seatsDistribution
        }
        status {
          id
          statusName
        }
      }
    }
  `;
  const response: Record<string, string> = await gqlClient.request(
    mutation,
    input
  );
  return response.createFlight;
};

export const updateFlight = async (input: string) => {
  const mutation = `
    mutation($input: UpdateFlightInput!) {
      updateFlight(
        id: $input.id,
        flightNumber: $input.flightNumber,
        originIata: $input.originIata,
        destinationIata: $input.destinationIata,
        departureDate: $input.departureDate,
        arrivalDate: $input.arrivalDate,
        departureTime: $input.departureTime,
        arrivalTime: $input.arrivalTime,
        price: $input.price,
        taxPercentage: $input.taxPercentage,
        surchargePercentage: $input.surchargePercentage,
        flightTypeId: $input.flightTypeId,
        airplaneTypeId: $input.airplaneTypeId,
        statusId: $input.statusId
      ) {
        id
        flightNumber
        origin {
          iataCode
          airportName
          country
        }
        destination {
          iataCode
          airportName
          country
        }
        price
        taxPercentage
        surchargePercentage
        departureDate
        arrivalDate
        departureTime
        arrivalTime
        flightType {
          id
          name
        }
        airplaneType {
          id
          type {
            id
            name
          }
          maxSeats
          seatsDistribution
        }
        status {
          id
          statusName
        }
      }
    }
  `;
  const variables = { input };
  const response: Record<string, string> = await gqlClient.request(
    mutation,
    variables
  );
  return response.updateFlight;
};

export const deleteFlight = async (id: number) => {
  const mutation = `
    mutation($id: ID!) {
      deleteFlight(id: $id)
    }
  `;
  const variables = { id };
  const response: Record<string, string> = await gqlClient.request(
    mutation,
    variables
  );
  return response.deleteFlight;
};
