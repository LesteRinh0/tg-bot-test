import axios from 'axios';
import schedule from 'node-schedule';

import { keys, links } from './src/constants.js';
import { client, collection } from './src/mongoConfig.js';
import { bot } from './src/botConfig.js';
import { processCommand } from './src/mainFunctions.js';
import { getRecommendations } from './src/recommendFunc.js';
import { sendErrorMessage } from './src/recommendFunc.js';
import { handleSubscribe, handleUnsubscribe } from './src/sub-unsub-functions.js';
import { createTask } from './src/saveTask.js';
import { app } from './src/serverConfig.js';

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
bot.onText(/\/weather (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const cityName = match[1];
  const link = `${links.weatherAPI}?q=${cityName}&appid=${keys.weather_api}&units=metric`;
  try {
    const result = await axios.get(link);
    const { name, weather, main } = result.data;
    const { description } = weather[0];
    const { temp } = main;
    bot.sendMessage(chatId, `В городе ${name} сейчас ${description}. Температура составляет ${temp}°C.`);
  } catch (error) {
    sendErrorMessage(chatId, bot);
  }
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
    let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${keys.weather_api}&units=metric`);
    const { lon, lat } = response.data.coord;
    const keyboard = {
      reply_markup: {
        keyboard: [
          ['Супер-маркеты'],
          ['Рестораны'],
          ['Активности'],
          ['Гостиницы'],
        ],
      },
    };

    bot.sendMessage(chatId, 'Выберите категорию:', keyboard);

    bot.once('message', async (categoryMsg) => {
      const result = await getRecommendations(categoryMsg.text, lon, lat, chatId, bot);
      bot.sendMessage(
          chatId,
          `Предлагаю вам следующие ${categoryMsg.text}:

${result}`
        );
    });
  } catch (error) {
    sendErrorMessage(chatId, bot);
  }
});
bot.onText(/(\/subscribe|\/unsubscribe) (.+)/, async (msg, match) => {
  if (match[1] === '/subscribe') {
    await handleSubscribe(msg, match, bot, collection, schedule);
  } else if (match[1] === '/unsubscribe') {
    await handleUnsubscribe(msg, match, bot, collection, schedule);
  }
});
bot.onText(/\/createTask/, createTask);
