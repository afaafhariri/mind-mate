import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!) {
    login(email: $email)
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $dateOfBirth: String!
    $city: String!
    $country: String!
    $profession: String!
    $maritalStatus: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      dateOfBirth: $dateOfBirth
      city: $city
      country: $country
      profession: $profession
      maritalStatus: $maritalStatus
    )
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOTP($email: String!, $otp: String!) {
    verifyOTP(email: $email, otp: $otp) {
      token
      user {
        firstName
        lastName
        email
      }
    }
  }
`;
