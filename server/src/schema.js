import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Poll {
  id: ID!
  authorId: ID!
  description: String!
  points: [Point]!
}

type Point {
  id: ID!
  title: String
  votes: [Vote]!
}

type Vote {
  pollId: ID!
  authorId: ID!
  pointId: ID!
  castedAt: String!
}

type Query {
  pollsAll: [Poll]
  pollsByAuthor(authorId: ID!): [Poll]
  pollsVotedByAuthor(authorId: ID!): [Poll]
  poll(id: ID!): Poll

  votesAll: [Vote]
  votesByAuthor(authorId: ID!): [Vote]
}

type Mutation {
  addPoll(description: String!, authorId: ID!): Poll
  castVote(pollId: ID!, authorId: ID!, pointId: ID!): Vote
}

type Subscription {
  voteCasted(pollId: ID!): Vote
  pollAdded(authorId: ID!): Poll
  pollChanged(pollId: ID!): Poll
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };

