import axios from "axios";
import "dotenv/config";

export const everyDayNotify = (bot, cityName, chatId) => async () => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.WEATHER_API}&units=metric`
  );
  const temperature = response.data.main.temp;
  const description = response.data.weather[0].description;

  bot.sendMessage(
    chatId,
    `Уведомление о погоде города ${cityName}: ${description} и ${temperature}°C`
  );
};
