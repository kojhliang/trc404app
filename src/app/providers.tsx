'use client';

import {NextUIProvider} from '@nextui-org/system';
import {THEME, TonConnectUIProvider} from '@tonconnect/ui-react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {ThemeProviderProps} from 'next-themes/dist/types';
import React from 'react';

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({children, themeProps}: ProvidersProps) {
    return (
        <NextUIProvider>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <TonConnectUIProvider
                manifestUrl="https://trc404web.pages.dev/tonconnect-manifest.json"
                uiPreferences={{
                    theme: THEME.DARK,
                }}
                actionsConfiguration={{
                    twaReturnUrl: 'https://t.me/trc404bot/app',
                }}
            >
                <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </TonConnectUIProvider>
        </NextUIProvider>
    );
}
