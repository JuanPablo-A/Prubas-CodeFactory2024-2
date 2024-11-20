import { GraphQLClient } from "graphql-request";
import { AirplaneType, AirplaneTypePayload, Type } from "./types";

// You can replace this with your actual backend GraphQL API endpoint
const API_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_FLIGHT_MANAGEMENT_B_API_URL ||
  "http://localhost:4000/graphql";

export const gqlClient = new GraphQLClient(API_URL);

export const getAllAirplaneTypes = async () => {
  const query = `
    query {
      getAllAirplaneTypes {
        id
        type {
          id
          name
        }
        maxSeats
        seatsDistribution
      }
    }
  `;
  const response: {
    getAllAirplaneTypes: AirplaneType[];
  } = await gqlClient.request(query);
  return response.getAllAirplaneTypes;
};

export const getAirplaneTypeById = async (id: string) => {
  const query = `
    query($id: String!) {
      getAirplaneTypeById(id: $id) {
        id
        type {
          id
          name
        }
        maxSeats
        seatsDistribution
      }
    }
  `;
  const variables = { id };
  const response: {
    getAirplaneTypeById: AirplaneType;
  } = await gqlClient.request(query, variables);
  return response.getAirplaneTypeById;
};

export const getAllAirplaneFamilies = async () => {
  const query = `
    query {
      getAllFamilies {
        id
        name
      }
    }
  `;

  const response: {
    getAllFamilies: Type[];
  } = await gqlClient.request(query);
  return response.getAllFamilies;
};

export const createAirplaneType = async ({
  id,
  typeId,
  maxSeats,
  seatsDistribution,
}: AirplaneTypePayload) => {
  const mutation = `
    mutation CreateAirplaneType($id: String!, $typeId: Int!, $maxSeats: Int!, $seatsDistribution: String!) {
      createAirplaneType(
        id: $id,
        typeId: $typeId,
        maxSeats: $maxSeats,
        seatsDistribution: $seatsDistribution
      ) {
        id
        type {
          id
          name
        }
        maxSeats
        seatsDistribution
      }
    }
  `;

  const variables = { id, typeId, maxSeats, seatsDistribution };
  const response: {
    createAirplaneType: AirplaneType;
  } = await gqlClient.request(mutation, variables);

  return response.createAirplaneType;
};

export const updateAirplaneType = async ({
  id,
  typeId,
  maxSeats,
  seatsDistribution,
}: AirplaneTypePayload) => {
  const mutation = `
    mutation($id: String!, $typeId: ID!, $maxSeats: Int!, $seatsDistribution: String!) {
      updateAirplaneType(
        id: $id,
        typeId: $typeId,
        maxSeats: $maxSeats,
        seatsDistribution: $seatsDistribution
      ) {
        id
        type {
          id
          name
        }
        maxSeats
        seatsDistribution
      }
    }
  `;
  const variables = { id, typeId, maxSeats, seatsDistribution };
  const response: {
    updateAirplaneType: AirplaneType;
  } = await gqlClient.request(mutation, variables);
  return response.updateAirplaneType;
};

export const deleteAirplaneType = async (id: string) => {
  const mutation = `
    mutation($id: String!) {
      deleteAirplaneType(id: $id)
    }
  `;
  const variables = { id };
  const response: Record<string, string> = await gqlClient.request(
    mutation,
    variables
  );
  return response.deleteAirplaneType;
};
