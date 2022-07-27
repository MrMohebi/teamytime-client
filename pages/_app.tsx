import '../styles/globals.css'
import "/styles/rowCss/Calender.css"
import 'animate.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: '',
    cache: new InMemoryCache(),
  });

  return(
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
  )
}
export default MyApp
