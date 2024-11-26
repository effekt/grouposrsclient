import type { PrismaClient, player, user } from '@prisma/client';

/**
 * Creates a player if it does not exist and returns result
 *
 * @param prisma
 * @param user
 * @param player_name
 * @returns
 */
export const upsertPlayer = async (
  prisma: PrismaClient,
  user: user,
  player_name: string,
): Promise<player> => {
  let player = await prisma.player.findFirst({
    where: {
      user_id: user.id,
      player_name,
    },
  });

  if (!player) {
    player = await prisma.player.create({
      data: {
        user_id: user.id,
        player_name,
      },
    });
  }

  return player;
};

/**
 * Fetches tracked players for a user
 *
 * @param prisma
 * @param user
 * @returns
 */
export const getTrackedPlayerNames = async (
  prisma: PrismaClient,
  user: user,
): Promise<Pick<player, 'player_name'>[]> => {
  return await prisma.player.findMany({
    select: {
      player_name: true,
    },
    where: {
      user,
    },
  });
};
