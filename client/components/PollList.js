import React from 'react';
import { Button, Form, Segment, List } from 'semantic-ui-react';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";


const POLL_SUBSCRIPTION = gql`
  subscription onPollAdded($authorId: ID!) {
    pollAdded(authorId: $authorId) {
      id
    }
  }
`;

const PollList = (props) => {
  return (
    <div>
      <h2>Your existing polls</h2>
      <Query
	query={gql`
	  query queryPollsByAuthor($authorId: ID!) {
	    pollsByAuthor(authorId: $authorId) {
	      id
	      description
	      authorId
	    }
	  }
	`}
        variables={{authorId: props.userAuthorId}}
      >
	{({ subscribeToMore, refetch, loading, error, data, ...rest }) => {
	  subscribeToMore({
	    document:    POLL_SUBSCRIPTION,
            variables:   { authorId: window.localStorage.getItem("username") },
	    updateQuery: (prev, { subscriptionData }) => {
              refetch();
            }
          })

	  if (loading) return <p>Loading...</p>;
	  if (error) return <p>Error :(</p>;

	  const listItems = data.pollsByAuthor.map(({ id, description, authorId }) => (
            <List.Item key={id}>
              <Link
                to={`/polls/${id}`}
              >{description}</Link>
            </List.Item>
          ));
          return (
            <List>
              {listItems}
            </List>
          )
	}}
      </Query>
    </div>
  )
}

export default PollList;
