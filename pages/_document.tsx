import Document, {Html, Head, Main, NextScript} from 'next/document'

class MyDocument extends Document {
    render = () => (
        <Html dir={'rtl'} lang={this.props.locale}>
            <Head>
                <title>ساعت کاری</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>

            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
)
}

export default MyDocument