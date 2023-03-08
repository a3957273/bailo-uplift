import React, { Fragment, ReactElement, ReactNode, useCallback, useContext, useMemo } from 'react'
import { useTheme, styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Stack from '@mui/system/Stack'
import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Divider from '@mui/material/Divider'
import Copyright from '../Copyright'
import Wrapper from '../Wrapper'
import { directory, DirectoryTree, flatDirectory } from 'pages/docs/directory'

type DocsWrapperProps = {
  children?: ReactNode
}

const paddingIncrement = 2

export default function DocsWrapper({ children }: DocsWrapperProps): ReactElement {
  const theme = useTheme()
  const { pathname, push } = useRouter()

  const StyledList = styled(List)({
    paddingTop: 0,
    paddingBottom: 0,
    '&& .Mui-selected, && .Mui-selected:hover': {
      '&, & .MuiListItemIcon-root': {
        color: theme.palette.secondary.main,
      },
    },
  })

  const createDocElement = useCallback(
    (doc: DirectoryTree, paddingLeft = paddingIncrement) => {
      let children: Array<any> = []
      if (doc.children) {
        children = doc.children.map((child) => createDocElement(child, paddingLeft + paddingIncrement))
      }

      if (doc.title === 'Root') {
        return <>{children}</>
      }

      const path = `/docs/${doc.slug}`
      const isSelected = pathname === path

      return (
        <Fragment key={doc.slug}>
          {doc.header && doc.slug ? (
            <ListItem dense sx={{ pl: paddingLeft }}>
              <ListItemText primary={doc.title} primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>
          ) : (
            <Link passHref href={path} legacyBehavior>
              <ListItemButton dense selected={isSelected} sx={{ pl: paddingLeft }}>
                <ListItemText
                  primary={doc.title}
                  primaryTypographyProps={{ fontWeight: doc.slug ? 'normal' : 'bold' }}
                />
              </ListItemButton>
            </Link>
          )}
          {children}
        </Fragment>
      )
    },
    [pathname]
  )

  const currentIndex = useMemo(
    () => flatDirectory.findIndex((item) => item.slug === pathname.replace(/^(\/docs\/)/, '')),
    [pathname]
  )

  function changePage(newIndex: number) {
    const newPage = flatDirectory[newIndex]
    push(`/docs/${newPage.slug}`)
  }

  return (
    <Wrapper title='Documentation' page='docs'>
      {/* Banner height + Toolbar height = 96px */}
      <Box display='flex' width='100%' height='calc(100vh - 96px)'>
        <Box
          sx={{
            minWidth: 200,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            overflow: 'auto',
            py: 2,
          }}
        >
          <StyledList>{createDocElement(directory)}</StyledList>
        </Box>
        <Box flex={1} overflow='auto'>
          <Box display='flex' flexDirection='column' height='100%'>
            <Container
              maxWidth='lg'
              sx={{
                'a:link': {
                  color: theme.palette.primary.main,
                },
                'a:visited': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {children}
            </Container>
            <Box sx={{ width: '100%', pl: 4, pr: 4, mt: 'auto' }}>
              <Divider flexItem />
              {flatDirectory.length > 0 && (
                <Box sx={{ pt: 2, mt: 'auto', pl: 4, pr: 4 }}>
                  <Stack direction='row' justifyContent='space-around'>
                    {currentIndex === 0 && (
                      <Button startIcon={<ArrowBack />} onClick={() => changePageToDocsHome()}>
                        Home
                      </Button>
                    )}
                    {currentIndex > 0 && (
                      <Button startIcon={<ArrowBack />} onClick={() => changePage(currentIndex - 1)}>
                        {flatDirectory[currentIndex - 1].title}
                      </Button>
                    )}
                    {currentIndex < flatDirectory.length - 1 && (
                      <Button endIcon={<ArrowForward />} onClick={() => changePage(currentIndex + 1)}>
                        {flatDirectory[currentIndex + 1].title}
                      </Button>
                    )}
                  </Stack>
                </Box>
              )}
            </Box>
            <Copyright sx={{ pb: 2, pt: 4 }} />
          </Box>
        </Box>
      </Box>
    </Wrapper>
  )
}
