import axios from 'axios';
import { links } from './constants.js';
import { commands } from './helpers.js';

export async function processCommand(text, chatId, bot, msg) {
    if (commands.isStartCommand) {
      bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}!`);
    } else if (commands.isWeatherCommand) {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /weather Минск'
      );
    } else if (commands.isRecommendCommand) {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /recommend Минск'
      );
    } else if (commands.isSubscribeCommand) {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /subscribe Минск'
      );
    } else if (commands.isUnsubscribeCommand) {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /unsubscribe Минск'
      );
    } else if (commands.isCatCommand) {
      const response = await axios.get(links.cat_url);
      const cat = response.data.data.url;
      await bot.sendPhoto(chatId, cat);
    } else if (commands.isDogCommand) {
      const response = await axios.get(links.dog_url);
      const dog = response.data.message;
      await bot.sendPhoto(chatId, dog);
    } else if (commands.isHelpCommand) {
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