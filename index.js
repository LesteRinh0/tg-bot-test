import schedule from 'node-schedule';

import { keys } from './src/constants/constants.js';
import { client, collection } from './src/configs/mongoConfig.js';
import { bot } from './src/configs/botConfig.js';
import { processCommand } from './src/commands/mainFunctions.js';
import { createTask } from './src/commands/saveTask.js';
import { app } from './src/configs/serverConfig.js';
import { viewTasks } from './src/commands/tasks.js';
import { sendWeather } from './src/commands/sendWeather.js';
import { recommendCity } from './src/commands/recommendCity.js';
import { handleSubscribe } from './src/commands/handleSubscribe.js';
import { handleUnsubscribe } from './src/commands/handleUnsubscribe.js';
import { gracefulShutdown } from './src/configs/gracefulShutdown.js';
import { deleteTask } from './src/commands/deleteTask.js';


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