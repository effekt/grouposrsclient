import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { v4 } from 'uuid'
import { getRandomWords } from '@/resources/wordList'
import jwt from 'jsonwebtoken'

type ResponseData = {
  data?: undefined | unknown
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { auth } = req.query
  const prisma = new PrismaClient()

  if (auth === 'login') {
    const userDocument = await prisma.user.findFirst({
      where: {
        secret_phrase: req.body.secret_phrase,
        uuid: req.body.uuid,
      },
    })

    if (userDocument) {
      const user = toObject(userDocument)
      const token = jwt.sign(
        { id: user.id, uuid: user.uuid },
        process.env.NEXT_PUBLIC_JWT_SECRET
      )
      res
        .status(200)
        .json({ data: { token }, message: 'User logged in successfully.' })
    } else {
      res.status(404).json({ message: 'User not found.' })
    }
  } else if (auth === 'register') {
    const uuid = v4()
    const secret_phrase = getRandomWords(5).join(' ')

    const user = await prisma.user.create({
      data: {
        secret_phrase,
        uuid,
      },
    })

    res
      .status(200)
      .json({ data: { secret_phrase, uuid }, message: 'Registered new user.' })
  } else {
    res.status(500).json({ message: 'Internal server error.' })
  }
}

const toObject = (doc: unknown) => {
  return JSON.parse(
    JSON.stringify(
      doc,
      (_key, value) =>
        typeof value === 'bigint' ? Number(value.toString()) : value // return everything else unchanged
    )
  )
}
