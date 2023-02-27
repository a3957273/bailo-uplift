import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import React from 'react'
import MetadataDisplay from './MetadataDisplay'
import { DeploymentDoc } from '../server/models/Deployment'

type DeploymentOverviewProps = {
  deployment: DeploymentDoc
}

function DeploymentOverview({ deployment }: DeploymentOverviewProps) {
  const theme = useTheme()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Box sx={{ backgroundColor: theme.palette.primary.main, color: 'white', borderRadius: 2 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant='h6'>Deployment name</Typography>
            <Typography variant='body1'>{deployment.metadata.highLevelDetails.name}</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant='h6'>Owner</Typography>
            <Typography variant='body1'>
              {deployment.metadata.contacts.owner.map((owner) => owner.id).join(', ')}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={8}>
        {!deployment.ungoverned && (
          <MetadataDisplay item={deployment.metadata} tabsDisplaySequentially use='DEPLOYMENT' />
        )}
        {deployment.ungoverned && (
          <Box
            sx={{ p: 4, backgroundColor: theme.palette.container.main, borderRadius: 2 }}
            data-test='metadataDisplay'
          >
            This is an ungoverned deployment and does not contain any additional metadata.
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

export default DeploymentOverview
