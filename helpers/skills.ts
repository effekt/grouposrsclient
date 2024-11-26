import type { PrismaClient, skill } from '@prisma/client';

import type { UserPlayer } from '@/types/UserPlayer';

export const upsertSkillXp = async (
  prisma: PrismaClient,
  userPlayer: UserPlayer,
  skills: Pick<skill, 'skill_xp'>,
): Promise<skill | null> => {
  return await prisma.skill.upsert({
    where: {
      user_id_player_id: {
        user_id: userPlayer.user.id,
        player_id: userPlayer.player.id,
      },
    },
    update: {
      skill_xp: skills,
    },
    create: {
      user_id: userPlayer.user.id,
      player_id: userPlayer.player.id,
      skill_xp: skills,
    },
  });
};

export const upsertSkillLevels = async (
  prisma: PrismaClient,
  userPlayer: UserPlayer,
  skills: Pick<skill, 'skill_level'>,
): Promise<skill | null> => {
  return await prisma.skill.upsert({
    where: {
      user_id_player_id: {
        user_id: userPlayer.user.id,
        player_id: userPlayer.player.id,
      },
    },
    update: {
      skill_level: skills,
    },
    create: {
      user_id: userPlayer.user.id,
      player_id: userPlayer.player.id,
      skill_level: skills,
    },
  });
};
