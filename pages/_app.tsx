import '../styles/globals.css'
import "/styles/rowCss/Calender.css"
import 'animate.css'
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import type {AppProps} from 'next/app'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {UserId} from "../store/store";
import Head from "next/head";

function MyApp({Component, pageProps}: AppProps) {
    const client = new ApolloClient({
        uri: '',
        cache: new InMemoryCache(),
    });


    const [allowUserToLogIn, setAllowUserToLogIn] = useState(false);
    const router = useRouter();


    return (
        <ApolloProvider client={client}>

            <Head>
                <link
                    rel="preload"
                    href="/assets/fonts/IranSansFarsiNums/IRANSans(FaNum).ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href="/assets/fonts/IranSansFarsiNums/IRANSans(FaNum)_Medium.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin=""
                />



            </Head>


            {/*{allowUserToLogIn ?*/}
                <Component {...pageProps} />
            {/*    :*/}
            {/*    <div className={'bg-background w-full h-full  flex flex-col justify-center items-center text-white IranSans'}>*/}

            {/*        <span>لینک به درستی وارد نشده است </span>*/}
            {/*        <span className={'text-sm scale-75 mt-5'}>(شما برای استفاده از این سیستم نیاز به یک آیدی مشخص دارید)</span>*/}
            {/*    </div>*/}

            {/*}*/}
        </ApolloProvider>
    )
}

export default MyApp
