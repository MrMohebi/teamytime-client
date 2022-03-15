import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render = () => (
        <Html dir={'rtl'} lang={this.props.locale}>
            <Head>
                <title>ساعت کاری</title>
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    )
}

export default MyDocument