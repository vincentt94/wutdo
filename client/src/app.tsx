import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { Outlet } from "react-router-dom";

import Header from "./components/header.tsx";
import Footer from "./components/footer.tsx";

import ParticlesBackground from "./components/particlesbackground";

/* OLD SETUP:
const httpLink = createHttpLink({
  uri: '/graphql',
});
*/


// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  // link: authLink.concat(httpLink), // OLD SETUP
  link: authLink.concat(createUploadLink({ uri: "/graphql" })),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ParticlesBackground />
      {/* Wrapper for a warm semi-transparent backdrop */}
      <div
        style={{
          position: "relative",
          zIndex: 0,
          minHeight: "100vh",
          backgroundColor: "rgba(245, 236, 222, 0.75)"
                }}
      >
        <Header />
        <Outlet />
      </div>
      <Footer />
    </ApolloProvider>
  );
}
export default App;


