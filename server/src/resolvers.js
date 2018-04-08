import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
const uuid = require('uuid/v4');

const polls = [
  {
    id: uuid(),
    description: 'Implement graphql backend',
    authorId: 'frank',
    points: [
      { id: '1', title: '0'   },
      { id: '2', title: '1/2' },
      { id: '3', title: '1'   },
      { id: '4', title: '2'   },
      { id: '5', title: '3'   },
      { id: '6', title: '5'   },
      { id: '7', title: '8'   },
      { id: '8', title: '13'  },
    ],
  },
  {
    id: uuid(),
    description: 'Implement graphql client bindings',
    authorId: 'someoneelse',
    points: [
      { id: '1', title: '0'   },
      { id: '2', title: '1/2' },
      { id: '3', title: '1'   },
      { id: '4', title: '2'   },
      { id: '5', title: '3'   },
      { id: '6', title: '5'   },
      { id: '7', title: '8'   },
      { id: '8', title: '13'  },
    ],
  },
];

const votes = [];

const pubsub = new PubSub();

const sortVotesByDateDesc = (x, y) => {
  const xCast = Date.parse(x.castedAt);
  const yCast = Date.parse(y.castedAt);
  return xCast > yCast ? -1 : xCast < yCast ? 1 : 0;
}

const buildPollObj = (poll => {
  const pollVotes = votes
    .filter(vote => poll.id === vote.pollId)
    .sort(sortVotesByDateDesc)
    .reduce((acc, item) => { // One vote per person!
      if (!acc.find(x => x.authorId === item.authorId)) {
        acc.push(item);
      }
      return acc;
    }, []);

  //console.log(votes);
  //console.log(pollVotes);

  return {
    id:          poll.id,
    authorId:    poll.authorId,
    description: poll.description,
    points:      poll.points.map(point => {
      return {
        id:    point.id,
        title: point.title,
        votes: pollVotes.filter(vote => point.id === vote.pointId),
      }
    }),
  }
});

export const resolvers = {
  Query: {
    votesAll: () => {
      return votes;
    },
    votesByAuthor: (root, { authorId }) => {
      return votes.filter(vote => vote.authorId === authorId);
    },
    pollsAll: () => {
      return polls.map(poll => buildPollObj(poll));
    },
    pollsByAuthor: (root, { authorId }) => {
      return polls
        .filter(poll => poll.authorId === authorId)
        .map(poll => buildPollObj(poll));
    },
    pollsVotedByAuthor: (root, { authorId }) => {
      return votes
        .filter(vote => vote.authorId === authorId)
        .sort(sortVotesByDateDesc)
        .map(vote => polls.find(poll => poll.id === vote.pollId))
        .map(poll => buildPollObj(poll))
    },
    poll: (root, { id }) => {
      let poll = polls.find(poll => poll.id === id);
      if (poll) {
        poll = buildPollObj(poll);
      }
      return poll;
    },
  },
  Mutation: {
    addPoll: (root, args) => {
      const newPoll = {
        id:          uuid(),
        authorId:    args.authorId,
        description: args.description,
        points: [
          { id: '1', votes: [], title: '0'   },
          { id: '2', votes: [], title: '1/2' },
          { id: '3', votes: [], title: '1'   },
          { id: '4', votes: [], title: '2'   },
          { id: '5', votes: [], title: '3'   },
          { id: '6', votes: [], title: '5'   },
          { id: '7', votes: [], title: '8'   },
          { id: '8', votes: [], title: '13'  },
        ],
      };
      polls.push(newPoll);
      pubsub.publish('pollAdded', { pollAdded: newPoll, authorId: args.authorId });
      return newPoll;
    },
    castVote: (root, args) => {
      const poll = polls.find(poll => poll.id === args.pollId);
      if(!poll)
        throw new Error("Poll does not exist");

      const point = poll.points.find(point => point.id === args.pointId);
      if(!point)
        throw new Error("Point does not exist");

      const newVote = {
        pollId:   args.pollId,
        authorId: args.authorId,
        pointId:  args.pointId,
        castedAt: new Date().toISOString(),
      };
      votes.push(newVote);

      pubsub.publish('voteCasted',  { voteCasted:  newVote,            pollId: args.pollId });
      pubsub.publish('pollChanged', { pollChanged: buildPollObj(poll), pollId: args.pollId });

      return newVote;
    },
  },
  Subscription: {
    voteCasted: {
      subscribe: withFilter(() => pubsub.asyncIterator('voteCasted'), (payload, variables) => {
        return payload.pollId === variables.pollId;
      }),
    },
    pollAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('pollAdded'), (payload, variables) => {
        return payload.authorId === variables.authorId;
      }),
    },
    pollChanged: {
      subscribe: withFilter(() => pubsub.asyncIterator('pollChanged'), (payload, variables) => {
        return payload.pollId === variables.pollId;
      }),
    },
  },
};

