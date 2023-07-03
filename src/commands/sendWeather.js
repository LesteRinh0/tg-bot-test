import axios from "axios";

import { links, keys } from "../constants/constants.js";
import { sendErrorMessage } from "./recommendFunc.js";

export async function sendWeather(chatId, cityName, bot) {
    const link = `${links.weatherAPI}?q=${cityName}&appid=${keys.weather_api}&units=metric`;
    try {
      axios.get(link)
        .then(result => {
          const { name, weather, main } = result.data;
          const { description } = weather[0];
          const { temp } = main;
          bot.sendMessage(chatId, `В городе ${name} сейчас ${description}. Температура составляет ${temp}°C.`);
        })
    } catch (error) {
        bot.sendMessage(chatId, `${error}`);
      sendErrorMessage(chatId, bot);
    }
  }
  