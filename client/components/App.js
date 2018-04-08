import React from 'react';
import { BrowserRouter as Router, Route, withRouter, Redirect, Switch } from "react-router-dom";
import { hot } from 'react-hot-loader'

import Layout from './Layout';
import SignIn from './SignIn';
import PollManage from './PollManage';
import PollDetails from './PollDetails';

import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';


// Create an http link:
const httpLink = new HttpLink({
  uri: `http://localhost:${WS_PORT}/graphql`
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:${WS_PORT}/subscriptions`,
  options: {
    reconnect: true
  }
});
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);
const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    link,
  ]),
  cache: new InMemoryCache()
});


const PrivateRoute = ({ component: Component, ...rest }) => {
  const userAuthorId = window.localStorage.getItem("username");
  return (
    <Route {...rest} render={(renderProps) => (
      userAuthorId
      ? <Layout userAuthorId={userAuthorId}>
	  {(layoutProps) => <Component {...layoutProps} {...renderProps} />}
	</Layout>
      : <Redirect to={{
          pathname: '/sign-in',
          state: { from: renderProps.location }
        }} />
    )} />
  )
}

const App = (props) => (
  <ApolloProvider client={client}>
    <Router>
      <Switch>
	<Route exact path="/sign-in" component={SignIn} />
	<PrivateRoute exact path="/polls" component={PollManage} />
	<PrivateRoute exact path="/polls/:pollId" component={PollDetails} />
        <Redirect from="/" to="/polls" />
      </Switch>
    </Router>
  </ApolloProvider>
)

export default hot(module)(App);
