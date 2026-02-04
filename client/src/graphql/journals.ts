import { gql } from "@apollo/client";

// Queries
export const GET_JOURNALS = gql`
  query GetJournals {
    getJournals {
      id
      topic
      body
      fontSettings {
        heading
        subheading
        body
        mono
      }
      images {
        id
        url
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_JOURNAL = gql`
  query GetJournal($id: ID!) {
    getJournal(id: $id) {
      id
      topic
      body
      fontSettings {
        heading
        subheading
        body
        mono
      }
      images {
        id
        url
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

// Mutations
export const CREATE_JOURNAL = gql`
  mutation CreateJournal($input: JournalInput!) {
    createJournal(input: $input) {
      id
      topic
      body
      fontSettings {
        heading
        subheading
        body
        mono
      }
      images {
        id
        url
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_JOURNAL = gql`
  mutation UpdateJournal($id: ID!, $input: JournalInput!) {
    updateJournal(id: $id, input: $input) {
      id
      topic
      body
      fontSettings {
        heading
        subheading
        body
        mono
      }
      images {
        id
        url
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_JOURNAL = gql`
  mutation DeleteJournal($id: ID!) {
    deleteJournal(id: $id)
  }
`;

// Types
export interface JournalImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface FontSettings {
  heading?: string;
  subheading?: string;
  body?: string;
  mono?: string;
}

export interface Journal {
  id: string;
  topic: string;
  body: string;
  fontSettings?: FontSettings;
  images: JournalImage[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalInput {
  topic: string;
  body: string;
  fontHeading?: string;
  fontSubheading?: string;
  fontBody?: string;
  fontMono?: string;
  imageUrls?: string[];
}
