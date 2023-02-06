import { Request, Response } from 'express'
import config from '../../utils/config.js'

export const getUIConfig = [
  async (req: Request, res: Response) => {
    res.json(config.ui)
  },
]
