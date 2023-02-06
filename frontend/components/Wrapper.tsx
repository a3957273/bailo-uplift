import * as React from 'react'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Link from './Link'
import {
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  IconButton,
  Divider,
  Typography,
  List,
  Toolbar,
  Box,
  Drawer as MuiDrawer,
  ListItemButton,
} from '@mui/material'
import {
  AdminPanelSettingsTwoTone,
  ContactSupportTwoTone,
  DashboardTwoTone,
  FileUploadTwoTone,
  LinkTwoTone,
  ListAltTwoTone,
  SchemaTwoTone,
  ViewListTwoTone,
  ChevronLeft,
  Notifications,
  Menu,
} from '@mui/icons-material'
import Head from 'next/head'
// import { mainListItems, secondaryListItems } from './listItems'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}))

interface Props {
  page: string
  config: any
  title: string
  children: React.ReactNode
}

export default function Wrapper({ page, config, title, children }: Props) {
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  const isNumApprovalsLoading = false
  const numApprovals = 10

  return (
    <>
      <Head>
        <title>{`${title} :: Bailo`}</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position='absolute' open={open}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                ...(open && { display: 'none' }),
              }}
            >
              <Menu />
            </IconButton>
            <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
              Bailo
            </Typography>
            <IconButton color='inherit'>
              <Badge badgeContent={4} color='secondary'>
                <Notifications />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeft />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component='nav'>
            <Link href='/' color='inherit' underline='none'>
              <ListItemButton selected={page === 'marketplace' || page === 'model' || page === 'deployment'}>
                <ListItemIcon>
                  {!open ? (
                    <Tooltip title='Marketplace' arrow placement='right'>
                      <DashboardTwoTone />
                    </Tooltip>
                  ) : (
                    <DashboardTwoTone />
                  )}
                </ListItemIcon>
                <ListItemText primary='Marketplace' />
              </ListItemButton>
            </Link>
            <Link href='/deployments' color='inherit' underline='none'>
              <ListItemButton selected={page === 'deployments'}>
                <ListItemIcon>
                  {!open ? (
                    <Tooltip title='My Deployments' arrow placement='right'>
                      <ViewListTwoTone />
                    </Tooltip>
                  ) : (
                    <ViewListTwoTone />
                  )}
                </ListItemIcon>
                <ListItemText primary='Deployments' />
              </ListItemButton>
            </Link>
            <Link href='/upload' color='inherit' underline='none'>
              <ListItemButton selected={page === 'upload'} data-test='uploadModelLink'>
                <ListItemIcon>
                  {!open ? (
                    <Tooltip title='Upload Model' arrow placement='right'>
                      <FileUploadTwoTone />
                    </Tooltip>
                  ) : (
                    <FileUploadTwoTone />
                  )}
                </ListItemIcon>
                <ListItemText primary='Upload' />
              </ListItemButton>
            </Link>
            <Link href='/review' color='inherit' underline='none'>
              <ListItemButton selected={page === 'review'} data-test='reviewLink'>
                <ListItemIcon>
                  {!open ? (
                    <Tooltip title='Review' arrow placement='right'>
                      <Badge badgeContent={isNumApprovalsLoading ? 0 : numApprovals} color='secondary'>
                        <ListAltTwoTone />
                      </Badge>
                    </Tooltip>
                  ) : (
                    <ListAltTwoTone />
                  )}
                </ListItemIcon>
                <ListItemText primary='Reviews' />
              </ListItemButton>
            </Link>
            <Divider />
            <Link href='/docs/api' color='inherit' underline='none'>
              <ListItemButton selected={page === 'api'} data-test='apiDocsLink'>
                <ListItemIcon>
                  {!open ? (
                    <Tooltip title='API' arrow placement='right'>
                      <LinkTwoTone />
                    </Tooltip>
                  ) : (
                    <LinkTwoTone />
                  )}
                </ListItemIcon>
                <ListItemText primary='API' />
              </ListItemButton>
            </Link>
            <Link href='/help' color='inherit' underline='none'>
              <ListItemButton selected={page === 'help'} data-test='supportLink'>
                <ListItemIcon>
                  {!open ? (
                    <Tooltip title='Help & Support' arrow placement='right'>
                      <ContactSupportTwoTone />
                    </Tooltip>
                  ) : (
                    <ContactSupportTwoTone />
                  )}
                </ListItemIcon>
                <ListItemText primary='Support' />
              </ListItemButton>
            </Link>
            {true && (
              <>
                <Divider />
                <Link href='/admin' color='inherit' underline='none'>
                  <ListItemButton selected={page === 'admin'}>
                    <ListItemIcon data-test='adminLink'>
                      {!open ? (
                        <Tooltip arrow title='Admin' placement='right'>
                          <AdminPanelSettingsTwoTone />
                        </Tooltip>
                      ) : (
                        <AdminPanelSettingsTwoTone />
                      )}
                    </ListItemIcon>
                    <ListItemText primary='Admin' />
                  </ListItemButton>
                </Link>
                <Link href='/schemas' color='inherit' underline='none'>
                  <ListItemButton selected={page === 'schemas'}>
                    <ListItemIcon data-test='designSchemaLink'>
                      {!open ? (
                        <Tooltip arrow title='Schemas' placement='right'>
                          <SchemaTwoTone />
                        </Tooltip>
                      ) : (
                        <SchemaTwoTone />
                      )}
                    </ListItemIcon>
                    <ListItemText primary='Schemas' />
                  </ListItemButton>
                </Link>
              </>
            )}
          </List>
        </Drawer>
        <Box
          component='main'
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <p>Did you know my config is: {JSON.stringify(config)}</p>
          {children}
        </Box>
      </Box>
    </>
  )
}
