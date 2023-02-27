import { consoleLog } from '../utils/logger.js'
import { getAccessToken } from '../routes/v1/registryAuth.js'

async function main() {
  const model = 'nginx'

  const token = await getAccessToken({ id: 'admin', _id: 'admin' }, [
    { type: 'repository', name: model, actions: ['push', 'pull'] },
  ])

  consoleLog(token)
}

main()
