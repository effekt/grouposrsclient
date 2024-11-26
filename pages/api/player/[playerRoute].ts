import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getTrackedPlayerNames, upsertPlayer } from '@/helpers/player';
import { upsertQuest } from '@/helpers/quests';
import { upsertSkillLevels, upsertSkillXp } from '@/helpers/skills';
import type { UserPlayer } from '@/types/UserPlayer';

type ResponseData = {
  data?: unknown;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { playerRoute } = req.query;
  const prisma = new PrismaClient();

  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(
    token,
    process.env.NEXT_PUBLIC_JWT_SECRET,
  ) as unknown as { id: number; uuid: string };

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
      uuid: decodedToken.uuid,
    },
  });

  if (!user) {
    res.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  if (playerRoute === 'update') {
    const player = await upsertPlayer(prisma, user, req.body.player_name);

    const userPlayer: UserPlayer = {
      player,
      user,
    };

    if (req.body.skill_xp) {
      await upsertSkillXp(prisma, userPlayer, req.body.skill_xp);
    }

    if (req.body.skill_level) {
      await upsertSkillLevels(prisma, userPlayer, req.body.skill_level);
    }

    if (req.body.quests) {
      await upsertQuest(prisma, userPlayer, req.body.quests);
    }

    res.status(200).json({ message: 'Player updated.' });
  } else if (playerRoute === 'track') {
    if (req.method === 'GET') {
      const trackedPlayers = (await getTrackedPlayerNames(prisma, user)).map(
        (trackedPlayer) => trackedPlayer.player_name,
      );

      res.status(200).json({
        data: { players: trackedPlayers },
        message: 'Fetched tracked players.',
      });
    } else if (req.method === 'PUT') {
      const player = await upsertPlayer(prisma, user, req.body.player_name);

      const userPlayer: UserPlayer = {
        player,
        user,
      };

      if (req.body.skill_xp) {
        await upsertSkillXp(prisma, userPlayer, req.body.skill_xp);
      }

      if (req.body.skill_level) {
        await upsertSkillLevels(prisma, userPlayer, req.body.skill_level);
      }

      if (req.body.quests) {
        await upsertQuest(prisma, userPlayer, req.body.quests);
      }

      const trackedPlayers = (await getTrackedPlayerNames(prisma, user)).map(
        (trackedPlayer) => trackedPlayer.player_name,
      );

      res.status(200).json({
        data: { players: trackedPlayers },
        message: 'Player tracked.',
      });
    }
  }
}
