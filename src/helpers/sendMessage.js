import { collection } from "../configs/mongoConfig.js";
import { sendErrorMessage } from "./sendErrorMessage.js";

export async function notifyStartCommand(chatId, bot, firstName) {
    bot.sendMessage(chatId, `Добро пожаловать ${firstName}!`);
  }
  
export async function notifyMissingCity(chatId, bot, command) {
    bot.sendMessage(
      chatId,
      `Не введен город при вызове команды! Пример: ${command} Минск`
    );
    if (command === '/unsubscribe'){
      try {
        const cities = await collection.find({ id: chatId, city: { $exists: true } }).toArray();
        let cityMsg = 'Ваш список подписок на города:\n\n';;
        if (cities.length === 0) {
            cityMsg = 'У вас нету активных подписок на города';
        } else {
            cities.forEach((city) => {
                    cityMsg += `• ${city.city}\n`;});
        }       
        bot.sendMessage(chatId, cityMsg);
    } catch (error) {
        bot.sendMessage(chatId, `${error}`);
        sendErrorMessage(chatId, bot);
    }
    }
  }

export async function sendCatPhoto(chatId, bot, axios, catUrl) {
    const response = await axios.get(catUrl);
    const cat = response.data.data.url;
    await bot.sendPhoto(chatId, cat);
  }
  
export async function sendDogPhoto(chatId, bot, axios, dogUrl) {
    const response = await axios.get(dogUrl);
    const dog = response.data.message;
    await bot.sendPhoto(chatId, dog);
  }

export async function sendHelpMessage(chatId, bot) {
    bot.sendMessage(
      chatId,
      `Стандартные команды представлены в меню!
    Дополнительные команды:
/subscribe *Город* - подписка на ежедневные уведомления о погоде введенного города;
/unsubscribe *Город* - отписка от ежедневных уведомлений о погоде введенного города;
/weather *Город* - сведения о погоде выбранного города;
/recommend *Город* - рекомендации по местам, которые можно посетить в введенном городе
/createTask - создание задач и напоминаний
/tasks - просмотр всех задач`
    );
  }