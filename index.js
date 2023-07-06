import schedule from 'node-schedule';
import {
  processCommand,
  createTask,
  viewTasks,
  sendWeather,
  recommendCity,
  handleSubscribe,
  handleUnsubscribe,
  deleteTask,
} from './src/imports/imports.js'

import { gracefulShutdown } from 'node-schedule';
import { app } from './src/configs/serverConfig.js';
import { client, collection } from './src/configs/mongoConfig.js';
import { bot } from './src/configs/botConfig.js';
import { keys } from './src/constants/constants.js';

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('SIGINT', gracefulShutdown);

client.connect();

const server = app.listen(keys.port || 5000, () => {
  server.address().address;
  server.address();
});

bot.setMyCommands([
  { command: '/help', description: 'Список команд' },
  { command: '/start', description: 'Приветствие' },
  { command: '/cat', description: 'Случайное изображение кота' },
  { command: '/dog', description: 'Случайное изображение собаки' },
]);

bot.onText(/\/weather (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const cityName = match[1];
  sendWeather(chatId, cityName, bot);
});

bot.onText(/(.+)/, async (msg, match) => {
  const text = match[1];
  const chatId = msg.chat.id;

  processCommand(text, chatId, bot, msg);
});

bot.onText(/\/recommend (.+)/, (msg, match) => {
  recommendCity(bot, msg, match);
});

bot.onText(/\/subscribe (.+)/, async (msg, match) => {
    await handleSubscribe(msg, match, bot, collection, schedule);
});

bot.onText(/\/unsubscribe (.+)/, async (msg, match) => {
    await handleUnsubscribe(msg, match, bot, collection, schedule);
});

bot.onText(/\/createTask/, createTask);

bot.onText(/\/tasks/, viewTasks);

bot.onText(/\/deleteTask/, deleteTask);