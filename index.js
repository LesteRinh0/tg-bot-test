import axios from 'axios';
import schedule from 'node-schedule';

import { key } from './src/constants.js';
import { everyDayNotify } from './src/subscribe.js';
import { client, collection } from './mongoConfig.js';
import { bot } from './botConfig.js';
import { server } from './serverConfig.js';

client.connect();
server();

bot.setMyCommands([
  { command: '/help', description: 'Список команд' },
  { command: '/start', description: 'Приветствие' },
  { command: '/cat', description: 'Случайное изображение кота' },
  { command: '/dog', description: 'Случайное изображение собаки' },
]);
bot.onText(/\/weather (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const cityName = match[1];
  const link = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key.weather_api}&units=metric`;
  try {
    
    const result = await axios.get(link);
    const { name, weather, main } = result.data;

    const { description } = weather[0];
    const { temp } = main;

    bot.sendMessage(
      chatId,
      `В городе ${name} сейчас ${description}. Температура составляет ${temp}°C.`
    );
  } catch (error) {
    bot.sendMessage(
      chatId,
      'Не удалось найти такой город. Попробуйте еще раз.'
    );
  }
});
bot.onText(/(.+)/, async (msg, match) => {
  const text = match[1];
  const chatId = msg.chat.id;

  if (msg.entities && msg.entities[0].type === 'bot_command') {
    if (text === '/start') {
      bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}!`);
    }
    if (text === '/weather') {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /weather Минск'
      );
    }
    if (text === '/recommend') {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /recommend Минск'
      );
    }
    if (text === '/subscribe') {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /subscribe Минск'
      );
    }
    if (text === '/unsubscribe') {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /unsubscribe Минск'
      );
    }

    if (text === '/cat') {
      const response = await axios.get(key.cat_url);
      const cat = response.data.data.url;
      await bot.sendPhoto(chatId, cat);
    }

    if (text === '/dog') {
      const response = await axios.get(key.dog_url);
      const dog = response.data.message;
      await bot.sendPhoto(chatId, dog);
    }
    if (text === '/help') {
      bot.sendMessage(
        chatId,
        `Стандартные команды представлены в меню!
Дополнительные команды:
/subscribe *Город* - подписка на ежедневные уведомления о погоде введенного города;
/unsubscribe *Город* - отписка от ежедневных уведомлений о погоде введенного города;
/weather *Город* - сведения о погоде выбранного города;
/recommend *Город* - рекомендации по местам, которые можно посетить в введенном городе
/createTask - создание задач и напоминаний`
      );
    }
  }
});
bot.onText(/\/recommend (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const cityName = match[1];
  try {
    let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key.weather_api}&units=metric`);
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
      let category;
      if (categoryMsg.text === 'Супер-маркеты') {
        category = 'commercial';
      } else if (categoryMsg.text === 'Рестораны') {
        category = 'catering';
      } else if (categoryMsg.text === 'Активности') {
        category = 'activity';
      } else if (categoryMsg.text === 'Гостиницы') {
        category = 'accommodation';
      }

      if (category) {
        try {
          response = await axios.get(`https://api.geoapify.com/v2/places?categories=${category}&bias=proximity:${lon},${lat}&limit=10&apiKey=${key.place_api}`);
          let value;
          if (category === 'commercial') {
            value = 'Супер-маркеты';
          } else if (category === 'catering') {
            value = 'Рестораны';
          } else if (category === 'activity') {
            value = 'Активности';
          } else if (category === 'accommodation') {
            value = 'Гостиницы';
          }
          const result = response.data.features
            .filter((feature) => feature.properties.name)
            .map((feature) => feature.properties.name)
            .join('\n');

          bot.sendMessage(
            chatId,
            `Предлагаю вам следующие ${value}:

${result}`
          );
        } catch (error) {
          bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте еще раз.');
        }
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
