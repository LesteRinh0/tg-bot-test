import TelegramApi from 'node-telegram-bot-api';

import { key } from './constants.js';

export const bot = new TelegramApi(key.token, { polling: true });