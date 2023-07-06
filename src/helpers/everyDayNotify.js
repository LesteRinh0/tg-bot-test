import axios from "axios";
import "dotenv/config";

import { links } from "../constants/constants";

export const everyDayNotify = (bot, cityName, chatId) => async () => {
  const response = await axios.get(
    `${links.weatherAPI}?q=${cityName}&appid=${process.env.WEATHER_API}&units=metric`
  );
  const temperature = response.data.main.temp;
  const description = response.data.weather[0].description;

  bot.sendMessage(
    chatId,
    `Уведомление о погоде города ${cityName}: ${description} и ${temperature}°C`
  );
  };
