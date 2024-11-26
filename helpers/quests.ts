import type { PrismaClient, quest } from '@prisma/client';

import type { UserPlayer } from '@/types/UserPlayer';

export const upsertQuest = async (
  prisma: PrismaClient,
  userPlayer: UserPlayer,
  quests: Pick<quest, 'quests'>,
): Promise<quest | null> => {
  return await prisma.quest.upsert({
    where: {
      user_id_player_id: {
        user_id: userPlayer.user.id,
        player_id: userPlayer.player.id,
      },
    },
    update: {
      quests: quests,
    },
    create: {
      user_id: userPlayer.user.id,
      player_id: userPlayer.player.id,
      quests: quests,
    },
  });
};
