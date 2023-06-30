import 'dotenv/config'

export const keys = {
  port: process.env.PORT,
  url: process.env.URL,
  token: process.env.TOKEN,
  weather_api: process.env.WEATHER_API,
  place_api: process.env.PLACE_API,
  };

export const links = {
  weatherAPI: 'https://api.openweathermap.org/data/2.5/weather',
  dog_url: 'https://dog.ceo/api/breeds/image/random',
  cat_url: 'https://meow.senither.com/v1/random'
}

export const messageHelp = `Стандартные команды представлены в меню!
Дополнительные команды:
/subscribe *Город* - подписка на ежедневные уведомления о погоде введенного города;
/unsubscribe *Город* - отписка от ежедневных уведомлений о погоде введенного города;
/weather *Город* - сведения о погоде выбранного города;
/recommend *Город* - рекомендации по местам, которые можно посетить в введенном городе
/createTask - создание задач и напоминаний`;