import React from 'react';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { Header, Divider } from 'semantic-ui-react';

import PointDeck from './PointDeck';


const POLL_SUBSCRIPTION = gql`
  subscription onPollChanged($pollId: ID!) {
    pollChanged(pollId: $pollId) {
      id
    }
  }
`;
const CAST_VOTE = gql`
  mutation doCastVote($pollId: ID!, $authorId: ID!, $pointId: ID!) {
    castVote(pollId: $pollId, authorId: $authorId, pointId: $pointId) {
      castedAt
    }
  }
`;

const PollDetails = (props) => {
  return (
    <Mutation
      mutation={CAST_VOTE}
    >
      {(castVote, { data }) => (
      <Query
        fetchPolicy='network-only'
        query={gql`
          query queryPoll($pollId: ID!) {
            poll(id: $pollId) {
              id
              authorId
              description
              points {
                id
                title
                votes {
                  pollId
                  authorId
                  pointId
                  castedAt
                }
              }
            }
          }
        `}
        variables={{pollId: props.match.params.pollId}}
      >
        {({ subscribeToMore, refetch, loading, error, data, ...rest }) => {
          subscribeToMore({
            document:    POLL_SUBSCRIPTION,
            variables:   { pollId: props.match.params.pollId },
            updateQuery: (prev, { subscriptionData }) => {
              refetch();
            }
          })

          if (loading && !data.poll) return <p>Loading...</p>;
          if ((!loading && !data.poll) || error) return (
            <p>Poll could not be loaded</p>
          )

          const poll = data.poll;
          const { userAuthorId } = props;

          return (
            <div>
              <Header>
                <Header.Content>{poll.description}</Header.Content>
                <Header.Subheader>Posted by {poll.authorId}</Header.Subheader>
              </Header>
              <Divider />
              <PointDeck
                pointData={poll.points}
                userAuthorId={userAuthorId}
                onVote={(pointId) => {
                  castVote({
                    variables: {
                      pollId:   poll.id,
                      authorId: userAuthorId,
                      pointId:  pointId,
                    },
                  });
                }}
              />
            </div>
          )
        }}
      </Query>
      )}
    </Mutation>
  )
}

export default PollDetails;
