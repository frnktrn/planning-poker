import express from 'express';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { schema } from './schema';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

const server = express();
const WS_PORT = process.env.WS_PORT;
const WP_PORT = process.env.WP_PORT;

server.use('*', cors({ origin: `http://localhost:${WP_PORT}` }));

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${WS_PORT}/subscriptions`
}));

const srv = createServer(server);

srv.listen(WS_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${WS_PORT}`);

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: srv,
      path: '/subscriptions',
    },
  );
});
