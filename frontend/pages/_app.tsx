import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { SnackbarProvider } from 'notistack'
import { lightTheme } from '../styles/theme'
import createEmotionCache from '../components/createEmotionCache'
import useDocsMenu from '../utils/hooks/useDocsMenu'
import useThemeMode from '../utils/hooks/useThemeMode'
import DocsMenuContext from '../src/contexts/docsMenuContext'
import ThemeModeContext from '../src/contexts/themeModeContext'

import '../public/css/fonts.css'
import '../public/css/layouting.css'
import '../public/css/table.css'
import '../public/css/terminal.css'
import '../public/css/highlight.css'
import 'reactflow/dist/style.css'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const themeModeValue = useThemeMode()
  const docsMenuValue = useDocsMenu()

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Bailo</title>
        <meta name='description' content='Making it easy to compliantly manage the machine learning lifecycle.' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <link rel='shortcut icon' href='/favicon.png' />
      </Head>
      <ThemeProvider theme={themeModeValue.theme}>
        <ThemeModeContext.Provider value={themeModeValue}>
          <SnackbarProvider>
            <DocsMenuContext.Provider value={docsMenuValue}>
              <CssBaseline />
              <Component {...pageProps} />
            </DocsMenuContext.Provider>
          </SnackbarProvider>
        </ThemeModeContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  )
}
