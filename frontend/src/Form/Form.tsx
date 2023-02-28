import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { SplitSchema } from '../../types/interfaces'
import FormDesigner from './FormDesigner'
import FormUpload from './FormUpload'

export default function Form({
  splitSchema,
  setSplitSchema,
  onSubmit,
  modelUploading = false,
}: {
  splitSchema: SplitSchema
  onSubmit: () => void
  setSplitSchema: Dispatch<SetStateAction<SplitSchema>>
  modelUploading?: boolean
}) {
  const [tab, setTab] = useState('designer')
  const onTabChange = (_event: any, newValue: any) => {
    setTab(newValue)
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={onTabChange}>
          <Tab label='Designer' value='designer' />
          <Tab label='Upload Existing' value='upload' data-test='uploadJsonTab' />
        </Tabs>
      </Box>

      {tab === 'designer' && (
        <FormDesigner
          splitSchema={splitSchema}
          setSplitSchema={setSplitSchema}
          onSubmit={onSubmit}
          modelUploading={modelUploading}
        />
      )}
      {tab === 'upload' && <FormUpload splitSchema={splitSchema} setSplitSchema={setSplitSchema} onSubmit={onSubmit} />}
    </>
  )
}
