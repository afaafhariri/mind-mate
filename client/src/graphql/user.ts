import { gql } from "@apollo/client";

// Queries
export const ME = gql`
  query Me {
    me {
      email
      firstName
      lastName
      dateOfBirth
      city
      country
      profession
      maritalStatus
    }
  }
`;

// Mutations
export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      email
      firstName
      lastName
      dateOfBirth
      city
      country
      profession
      maritalStatus
    }
  }
`;

export const REQUEST_EMAIL_CHANGE = gql`
  mutation RequestEmailChange($newEmail: String!) {
    requestEmailChange(newEmail: $newEmail)
  }
`;

export const CONFIRM_EMAIL_CHANGE = gql`
  mutation ConfirmEmailChange($newEmail: String!, $otp: String!) {
    confirmEmailChange(newEmail: $newEmail, otp: $otp) {
      email
      firstName
      lastName
    }
  }
`;

// Types
export interface User {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    city?: string;
    country?: string;
    profession?: string;
    maritalStatus?: string;
}

export interface UpdateUserInput {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    city?: string;
    country?: string;
    profession?: string;
    maritalStatus?: string;
}
