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
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}

export default MyDocument