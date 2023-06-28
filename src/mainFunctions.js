import axios from 'axios';
import { links } from './constants.js';

export async function processCommand(text, chatId, bot, msg) {
    if (text === '/start') {
      bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}!`);
    } else if (text === '/weather') {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /weather Минск'
      );
    } else if (text === '/recommend') {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /recommend Минск'
      );
    } else if (text === '/subscribe') {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /subscribe Минск'
      );
    } else if (text === '/unsubscribe') {
      bot.sendMessage(
        chatId,
        'Не введен город при вызове команды! Пример: /unsubscribe Минск'
      );
    } else if (text === '/cat') {
      const response = await axios.get(links.cat_url);
      const cat = response.data.data.url;
      await bot.sendPhoto(chatId, cat);
    } else if (text === '/dog') {
      const response = await axios.get(links.dog_url);
      const dog = response.data.message;
      await bot.sendPhoto(chatId, dog);
    } else if (text === '/help') {
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