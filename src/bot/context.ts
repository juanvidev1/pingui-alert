import { Context } from 'grammy';
import type { Integration } from '../types/index.js';

export interface BotContext extends Context {
  auth?: {
    integration?: Integration;
    isOwner?: boolean;
    role?: 'owner' | 'member';
  };
}
