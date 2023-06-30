import { everyDayNotify } from "./subscribe.js";
import { sendErrorMessage } from './recommendFunc.js';


export async function handleSubscribe(msg, match, bot, collection, schedule) {
    const chatId = msg.chat.id;
    const cityName = match[1];
  
    try {
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
    } catch (error) {
        sendErrorMessage(chatId, bot);
    }
  }
  
export async function handleUnsubscribe(msg, match, bot, collection, schedule) {
    const chatId = msg.chat.id;
    const cityName = match[1];
  
    try {
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
    } catch (error) {
        sendErrorMessage(chatId, bot);
    }
  }