import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

// main GraphQL API Endpoint
const linkToHttp = createHttpLink({
  uri: "/graphql",
});

// request middleware which will add the token to every request
const authorizationLink = setContext((_, { headers }) => {
  // get the authentication token if exists
  const token = localStorage.getItem("id_token");
  // return headers to context so they can be read
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const newClient = new ApolloClient({
  link: authorizationLink.concat(linkToHttp),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={newClient}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
