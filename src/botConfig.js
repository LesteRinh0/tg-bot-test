import TelegramApi from 'node-telegram-bot-api';

import { keys } from './constants.js';

export const bot = new TelegramApi(keys.token, { polling: true });