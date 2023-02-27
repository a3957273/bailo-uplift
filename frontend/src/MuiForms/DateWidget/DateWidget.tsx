import React from 'react'
import { TextWidgetProps } from '../TextWidget/index'

function DateWidget(props: TextWidgetProps) {
  const { registry } = props
  const { TextWidget } = registry.widgets
  return (
    <TextWidget
      type='date'
      InputLabelProps={{
        shrink: true,
      }}
      {...props}
    />
  )
}

export default DateWidget
