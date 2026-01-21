import { createClient } from 'redis';
import bot from '../bot/index.js';
import { Logger } from '../logger/index.js';

interface AlertTask {
  chatId: string | number;
  message: string;
}
