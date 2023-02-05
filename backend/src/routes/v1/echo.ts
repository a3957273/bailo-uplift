import { Request, Response } from "express";

export const getEcho = [
  async (req: Request, res: Response) => {
    res.send("Pong");
  },
];
