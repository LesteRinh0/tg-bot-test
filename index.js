import axios from 'axios';
import schedule from 'node-schedule';

import { keys, links, keyboardOptions } from './src/constants/constants.js';
import { client, collection } from './src/configs/mongoConfig.js';
import { bot } from './src/configs/botConfig.js';
import { processCommand } from './src/commands/mainFunctions.js';
import { getRecommendations } from './src/commands/recommendFunc.js';
import { sendErrorMessage } from './src/commands/recommendFunc.js';
import { handleSubscribe, handleUnsubscribe } from './src/commands/sub-unsub-functions.js';
import { createTask } from './src/commands/saveTask.js';
import { app } from './src/configs/serverConfig.js';
import gracefulShutdown from './src/commands/gracefulShutdown.js';
import { viewTasks } from './src/commands/tasks.js';
import { sendWeather } from './src/commands/sendWeather.js';


process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('SIGINT', gracefulShutdown);

client.connect();

const server = app.listen(keys.port || 5000, () => {
  const host = server.address().address;
  const { port } = server.address();
  console.log('Web server started at http://%s:%s', host, port);
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

bot.onText(/\/recommend (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const cityName = match[1];
  try {
    let response = await axios.get(`${links.weatherAPI}?q=${cityName}&appid=${keys.weather_api}&units=metric`);
    const { lon, lat } = response.data.coord;

    bot.sendMessage(chatId, 'Выберите категорию:', keyboardOptions);

    bot.once('message', async (categoryMsg) => {
      const result = await getRecommendations(categoryMsg.text, lon, lat, chatId, bot);
      bot.sendMessage(chatId, `Предлагаю вам следующие ${categoryMsg.text}:\n${result}`);
    });
  } catch (error) {
    sendErrorMessage(chatId, bot);
  }
});

bot.onText(/\/subscribe (.+)/, async (msg, match) => {
    await handleSubscribe(msg, match, bot, collection, schedule);
});

bot.onText(/\/unsubscribe (.+)/, async (msg, match) => {
    await handleUnsubscribe(msg, match, bot, collection, schedule);
});

bot.onText(/\/createTask/, createTask);

bot.onText(/\/tasks/, viewTasks);