export const typeDefs = `#graphql
  type User {
    email: String!
    firstName: String!
    lastName: String!
    dateOfBirth: String
    city: String
    country: String
    profession: String
    maritalStatus: String
  }

  type Query {
    getUser(email: String!): User
  }

  type Mutation {
    signup(
      firstName: String!
      lastName: String!
      email: String!
      dateOfBirth: String!
      city: String!
      country: String!
      profession: String!
      maritalStatus: String!
    ): String

    verifyOTP(email: String!, otp: String!): Boolean
  }
`;