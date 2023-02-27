import { NextFunction, Request, Response } from 'express'
import devnull from 'dev-null'
import morgan, { TokenIndexer } from 'morgan'
import { v4 as uuidv4 } from 'uuid'
import log from './logger.js'
import { StatusError } from '../../types/express.js'

const morganLog = morgan<Request, Response>(
  (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => {
    req.log.trace(
      {
        url: tokens.url(req, res),
        method: tokens.method(req, res),
        'response-time': tokens['response-time'](req, res),
        status: tokens.status(req, res),
      },
      (tokens as any).dev(morgan, req, res)
    )

    return ''
  },
  {
    skip: (req: Request, _res: Response) => ['/_next/', '/__nextjs'].some((val) => req.originalUrl.startsWith(val)),
    // write to nowhere...
    stream: devnull(),
  }
)

export async function expressLogger(req: Request, res: Response, next: NextFunction) {
  req.reqId = (req.headers['x-request-id'] as string) || uuidv4()
  req.log = log.child({
    id: req.reqId,
    user: req.user?.id,
    clientIp: req.headers['x-forwarded-for'],
  })

  res.error = (code: number, error: [any, string]) => {
    req.log.warn(error[0], error[1])
    return res.status(code || 500).json({
      message: error[1],
    })
  }

  res.setHeader('x-request-id', req.reqId)

  await new Promise((r) => {
    morganLog(req, res, r)
  })

  next()
}

export async function expressErrorHandler(err: StatusError, req: Request, res: Response, _next: NextFunction) {
  if (!err.code) {
    // Not an express error
    throw err
  }

  let code = err.code || 500
  if (typeof err.code !== 'number') {
    code = 500
  }
  if (code < 100) code = 500
  if (code >= 600) code = 500

  const localLogger = err.logger || req.log

  localLogger.warn(err.data, err.message)

  return res.status(code).json({
    message: err.message,
  })
}
