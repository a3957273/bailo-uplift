import React, { ReactElement } from 'react'
import ChildLogDetails from './ChildLogDetails'
import { LogFilters } from '../FilterMenu/FilterMenu'
import { LogEntry, LogType } from '../../types/interfaces'
import { useGetAppLogs } from '../../data/admin'
import { useGetUiConfig } from '../../data/uiConfig'

function getLogType(log: LogEntry): LogType {
  switch (log.code) {
    case 'starting_model_build':
      return LogType.Build
    case 'approval':
      return LogType.Approval
    default:
      return LogType.Misc
  }
}

type LogTreeProps = {
  query: LogFilters
}

export default function LogTree({ query }: LogTreeProps): ReactElement {
  const { uiConfig } = useGetUiConfig()

  const { logs } = useGetAppLogs({
    ...query,
    filter: ['approval', 'build', 'misc'],
  })

  if (!logs || !uiConfig) {
    return <>Loading...</>
  }

  return (
    <>
      {logs.logs.map((log) => (
        <ChildLogDetails query={query} uiConfig={uiConfig} key={log._id} log={log} indent={0} type={getLogType(log)} />
      ))}
    </>
  )
}
