import { sendErrorMessage } from "../helpers/sendErrorMessage.js";

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
  };