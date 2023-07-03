import { everyDayNotify } from "../helpers/everyDayNotify.js"
import { checkCityWeather } from "../helpers/checkCityWeather.js";
import { sendErrorMessage } from "../helpers/sendErrorMessage.js";

export async function handleSubscribe(msg, match, bot, collection, schedule) {
  const chatId = msg.chat.id;
  const cityName = match[1];

  try {
    const cityExists = await checkCityWeather(cityName);

    if (!cityExists) {
      bot.sendMessage(chatId, 'Указанный город не существует.');
      return;
    }

    const user = await collection.findOne({ id: chatId, city: cityName });

    if (user) {
      bot.sendMessage(chatId, `Вы уже подписаны на уведомления о погоде города ${cityName}.`);
    } else {
      schedule.scheduleJob('timer', '0 9 * * *', everyDayNotify(bot, cityName, chatId));
      bot.sendMessage(chatId, `Вы подписались на ежедневные уведомления о погоде города ${cityName}`);
      collection.insertOne({
        id: chatId,
        city: cityName,
        name: msg.chat.first_name
      });
    }
  } catch (error) {
    sendErrorMessage(chatId, bot);
  }
  };