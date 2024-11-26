import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';

import { getRandomWords } from '@/resources/wordList';
import { toObject } from '@/utils/api';

type ResponseData = {
  data?: undefined | unknown;
  message: string;
};

type BaseApiHelperParams = {
  prisma: PrismaClient;
  req: NextApiRequest;
  res: NextApiResponse<ResponseData>;
};

type LoginParams = BaseApiHelperParams & {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { authRoute } = req.query;
  const prisma = new PrismaClient();

  const baseParams: BaseApiHelperParams = { prisma, req, res };

  if (authRoute === 'login') {
    console.log('derp');
    await login(baseParams);
  } else if (authRoute === 'register') {
    const uuid = v4();
    const secret_phrase = getRandomWords(5).join(' ');

    await prisma.user.create({
      data: {
        secret_phrase,
        uuid,
      },
    });

    res
      .status(200)
      .json({ data: { secret_phrase, uuid }, message: 'Registered new user.' });
  } else {
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const login = async ({ prisma, req, res }: BaseApiHelperParams) => {
  const userDocument = await prisma.user.findFirst({
    where: {
      secret_phrase: req.body.secret_phrase,
      uuid: req.body.uuid,
    },
  });

  if (userDocument) {
    const user = toObject(userDocument);
    const token = jwt.sign(
      { id: user.id, uuid: user.uuid },
      process.env.NEXT_PUBLIC_JWT_SECRET,
    );
    res
      .status(200)
      .json({ data: { token }, message: 'User logged in successfully.' });
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
};
