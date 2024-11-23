import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Unauthorized' })
  } else {
    res.status(200).json({ message: 'Hello from Next.js!' })
  }
}
