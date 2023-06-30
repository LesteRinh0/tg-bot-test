import mongoose from "mongoose";
  
  
  export async function notifyStartCommand(chatId, bot, firstName) {
    bot.sendMessage(chatId, `Добро пожаловать ${firstName}!`);
  }
  
  export async function notifyMissingCity(chatId, bot, command) {
    bot.sendMessage(
      chatId,
      `Не введен город при вызове команды! Пример: ${command} Минск`
    );
    const city = mongoose.model('City', { id: Number, name: String });
    const collection = city.collection;
    const cities = await collection.find({}).toArray();
    const cityNames = cities.map(city => city.name);
    bot.sendMessage(chatId, `Cписок ваших подписок: ${cityNames}`)
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
    /createTask - создание задач и напоминаний`
    );
  }