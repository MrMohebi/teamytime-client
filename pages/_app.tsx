import '../styles/globals.css'
import "/styles/rowCss/Calender.css"
import 'animate.css'
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import type {AppProps} from 'next/app'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {UserId} from "../store/store";

function MyApp({Component, pageProps}: AppProps) {
    const client = new ApolloClient({
        uri: '',
        cache: new InMemoryCache(),
    });


    return (
        <ApolloProvider client={client}>
            <div className={'w-full h-full relative'}>
                <Component {...pageProps} />

            </div>
        </ApolloProvider>
    )
}

export default MyApp
