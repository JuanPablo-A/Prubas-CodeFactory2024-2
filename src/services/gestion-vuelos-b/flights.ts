import { GraphQLClient } from "graphql-request";
import { Flight, FlightPayload, FlightUpdatePayload } from "./types.d";

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
  const response: {
    getFlightById: Flight;
  } = await gqlClient.request(query, variables);
  return response.getFlightById;
};

export const createFlight = async (input: FlightPayload) => {
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

export const updateFlight = async (input: FlightUpdatePayload) => {
  const mutation = `
    mutation(
      $id: ID!,
      $flightNumber: String,
      $originIata: String,
      $destinationIata: String,
      $departureDate: String,
      $arrivalDate: String,
      $departureTime: String,
      $arrivalTime: String,
      $price: Float,
      $taxPercentage: Float,
      $surchargePercentage: Float,
      $flightTypeId: ID,
      $airplaneTypeId: ID,
      $statusId: ID
    ) {
      updateFlight(
        id: $id,
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

  const variables = { ...input };
  
  const response: Record<string, string> = await gqlClient.request(mutation, variables);
  return response.updateFlight;
};

export const deleteFlight = async (id: string) => {
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
