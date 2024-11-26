import type { player, user } from '@prisma/client';

export type UserPlayer = {
  user: user;
  player: player;
};
