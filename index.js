import axios from 'axios';
import schedule from 'node-schedule';

import { keys, errors, links } from './src/constants.js';
import { everyDayNotify } from './src/subscribe.js';
import { client, collection } from './src/mongoConfig.js';
import { bot } from './src/botConfig.js';
import { processCommand } from './src/mainFunctions.js';
import { getRecommendations } from './src/recommendFunc.js';

client.connect();

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
    bot.sendMessage(chatId, errors.errorWeather);
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
    if (response.cod == 404){
      bot.sendMessage(chatId, 'Город не найден');
    }
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
      try {
        const result = await getRecommendations(categoryMsg.text, lon, lat, bot);
        bot.sendMessage(
          chatId,
          `Предлагаю вам следующие ${categoryMsg.text}:

${result}`
        );
      } catch (error) {
        bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте еще раз.');
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте еще раз.');
  }
});

bot.onText(/(\/subscribe|\/unsubscribe) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const cityName = match[2];

  try {
    if (match[1] === '/subscribe') {
      const user = await collection.findOne({ id: chatId, city: cityName });
      if (user) {
        bot.sendMessage(
          chatId,
          `Вы уже подписаны на уведомления о погоде города ${cityName}.`
        );
      } else {
        schedule.scheduleJob(
          'timer',
          '0 9 * * *',
          everyDayNotify(bot, cityName, chatId)
        );
        bot.sendMessage(
          chatId,
          `Вы подписались на ежедневные уведомления о погоде города ${cityName}`
        );
        collection.insertOne({
          id: chatId,
          city: cityName,
          name: msg.chat.first_name,
        });
      }
    } else if (match[1] === '/unsubscribe') {
      const user = await collection.findOne({ id: chatId, city: cityName });
      if (!user) {
        bot.sendMessage(chatId, `Вы не были подписаны на город ${cityName}.`);
      } else {
        collection.deleteMany({ id: chatId, city: cityName });
        schedule.cancelJob('timer');
        bot.sendMessage(
          chatId,
          `Вы отписались от ежедневных уведомлений о погоде города ${cityName}.`
        );
      }
    }
  } catch (error) {
    bot.sendMessage(chatId, 'Не удалось подписаться на обновления погоды.');
  }
});
bot.onText(/\/createTask/, async (createTaskMsg) => {
  const chatId = createTaskMsg.chat.id;

  await bot.sendMessage(chatId, 'Введите задачу:').then(() => {
    const taskSaved = false;
    bot.once('text', (msg) => {
      if (!taskSaved) {
        const task = msg.text;

        try {
          collection.insertOne({
            taskId: msg.message_id,
            task,
            id: chatId,
            name: msg.chat.first_name,
          });

          const opts = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Да',
                    callback_data: `yes/${msg.message_id}`,
                  },
                  {
                    text: 'Нет',
                    callback_data: `no/${msg.message_id}`,
                  },
                ],
              ],
            },
          };

          bot.sendMessage(
            msg.from.id,
            'Хотите получить напоминание о задаче?',
            opts
          );
        } catch (error) {
          bot.sendMessage(chatId, 'Ошибка при сохранении задачи.');
        }
      }
    });
  });
});
bot.on('callback_query', (callbackQuery) => {
  const { data } = callbackQuery;
  const msg = callbackQuery.message;
  const everyHour = '0 * * * *';
  const every2Hours = '0 */2 * * *';
  const every4Hours = '0 */4 * * *';

  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };

  const action = data.split('/');

  if (action[0] === 'yes' || action[0] === 'no') {
    const taskNotificationButtons = {
      inline_keyboard: [
        [
          {
            text: 'Час',
            callback_data: `час/${action[1]}`,
          },
          {
            text: '2 часа',
            callback_data: `2 часа/${action[1]}`,
          },
          {
            text: '4 часа',
            callback_data: `4 часа/${action[1]}`,
          },
        ],
      ],
    };

    const options = action[0] === 'yes' ? taskNotificationButtons : undefined;

    const text =
      action[0] === 'yes'
        ? 'Когда хотите получить напоминание?'
        : 'Напоминания не будет';

    bot.editMessageText(text, { ...opts, reply_markup: options });
  } else {
    const text = `Напоминание установлено через ${action[0]}`;

    const taskTime = {
      час: everyHour,
      '2 часа': every2Hours,
      '4 часа': every4Hours,
    };

    schedule.scheduleJob('taskNotif', taskTime[action[0]], async () => {
      const task = await collection.findOne({ taskId: +action[1] });

      bot.sendMessage(msg.chat.id, `Напоминание о ${task.task}`);
      schedule.cancelJob('taskNotif');
    });

    bot.editMessageText(text, opts);
  }
});
