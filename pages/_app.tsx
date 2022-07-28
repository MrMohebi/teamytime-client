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


    const [allowUserToLogIn, setAllowUserToLogIn] = useState(false);
    const router = useRouter();
    const {userid} = router.query

    useEffect(() => {
        if (userid) {
            UserId((userid as string))
            setAllowUserToLogIn(true)
        }
    }, [userid]);

    return (
        <ApolloProvider client={client}>

            {allowUserToLogIn ?
                <Component {...pageProps} />
                :
                <div className={'bg-background w-full h-full  flex flex-col justify-center items-center text-white IranSans'}>

                    <span>لینک به درستی وارد نشده است </span>
                    <span className={'text-sm scale-75 mt-5'}>(شما برای استفاده از این سیستم نیاز به یک آیدی مشخص دارید)</span>
                </div>

            }
        </ApolloProvider>
    )
}

export default MyApp
