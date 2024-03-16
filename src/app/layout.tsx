export const runtime = 'edge' // 'nodejs' (default) | 'edge'

import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Providers} from '@/app/providers';

import '../styles/globals.css';
import {ContextProps} from "@/contexts/TMA";
import {headers} from "next/headers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "TRC-404",
    description: "Probably not found.",
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const headersForContext: ContextProps['headers'] = {};
    headers().forEach((value, key) => (headersForContext[key] = value));
    // setDebug(true);
    return (
        <html lang="en" className="dark">
        <body className={inter.className}>
        {/* todo remove tma for dev env*/}
        {/*<TMAProvider headers={headersForContext}>*/}
        <Providers themeProps={{attribute: 'class', defaultTheme: 'dark'}}>
            <div className="relative flex h-screen flex-col">
                <main className="container mx-auto max-w-7xl flex-grow ">
                    {children}
                </main>
            </div>
        </Providers>
        {/*</TMAProvider>*/}
        </body>
        </html>
    );
}
