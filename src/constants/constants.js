import 'dotenv/config'

export const keys = {
  port: process.env.PORT,
  url: process.env.URL,
  token: process.env.TOKEN,
  weather_api: process.env.WEATHER_API,
  place_api: process.env.PLACE_API,
  };

export const links = {
    weatherAPI: process.env.WEATHER_LINK,
    dog_url: process.env.DOG_URL,
    cat_url: process.env.CAT_URL
  };

export const keyboardOptions = {
  reply_markup: {
    keyboard: [
      ['Супер-маркеты'],
      ['Рестораны'],
      ['Активности'],
      ['Гостиницы'],
    ],
  },
  };

export const noCityMessage = `Не указан город при вызове команды! 
Пример вызова команды:`;

export const helpMessage = `Стандартные команды представлены в меню!
Дополнительные команды:
/subscribe *Город* - подписка на ежедневные уведомления о погоде введенного города;
/unsubscribe *Город* - отписка от ежедневных уведомлений о погоде введенного города;
/weather *Город* - сведения о погоде выбранного города;
/recommend *Город* - рекомендации по местам, которые можно посетить в введенном городе
/createTask - создание задач и напоминаний
/tasks - просмотр всех задач
/deleteTask - удаление задачи`