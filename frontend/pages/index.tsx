import Head from 'next/head'
import { Box, Container, Typography } from '@mui/material'
import Link from 'components/Link'
import Example from 'components/Example'

export default function Home() {
  return (
    <>
      <Head>
        <title>Bailo Uplift</title>
        <meta name='description' content='Bailo uplift' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Container maxWidth='lg'>
          <Box
            sx={{
              my: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant='h4' component='h1' gutterBottom>
              Bailo Uplift (42)
            </Typography>
            <Example />
            <Link href='/' color='secondary'>
              Go to the home page
            </Link>
          </Box>
        </Container>
      </main>
    </>
  )
}
