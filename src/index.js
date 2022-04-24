import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import "./styles/App.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";

const client = new ApolloClient({

  link: new WebSocketLink({
    uri: 'wss://assignment-kloudmate.hasura.app/v1/graphql',
    options: {
      reconnect: true,
    },
  }),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
