import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <link rel="shortcut icon" href="/assets/img/favicon.png" />
            <link rel="preconnect" href="https://fonts.bunny.net" />
            <link href="https://fonts.bunny.net/css?family=hind:400,500,600|lexend:400,500,600" rel="stylesheet" />

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
