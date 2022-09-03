import Document, {Html, Head, Main, NextScript} from 'next/document'

class MyDocument extends Document {
    render = () => (
        <Html dir={'rtl'} lang={this.props.locale}>
            <Head>
                <title>ساعت کاری</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name='theme-color' content={"#1D2731"}/>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>

                <link rel="manifest" href="/manifest.json"/>
                <link rel="apple-touch-icon" href="/images/icons/icon-72x72.png"></link>





                <meta name="application-name" content="گزارش کار" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="گزارش کار" />
                <meta name="description" content="سیستم ثبت گزارش کار" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="twitter:creator" content="@mokafela_" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="گزارش کار" />
                <meta property="og:description" content="سیستم ثبت گزارش کار" />
                <meta property="og:site_name" content="گزارش کار" />
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}

export default MyDocument