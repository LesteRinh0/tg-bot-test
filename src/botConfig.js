import TelegramApi from 'node-telegram-bot-api';

import { key } from './src/constants.js';

export const bot = new TelegramApi(key.token, { polling: true });