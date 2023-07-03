import axios from "axios";

import { links, keys, keyboardOptions } from "../constants/constants.js";
import { getRecommendations } from "./recommendFunc.js";
import { sendErrorMessage } from "../helpers/sendErrorMessage.js";

export async function recommendCity(bot, msg, match) {
    const chatId = msg.chat.id;
    const cityName = match[1];
    try {
      let response = await axios.get(`${links.weatherAPI}?q=${cityName}&appid=${keys.weather_api}&units=metric`);
      const { lon, lat } = response.data.coord;
  
      bot.sendMessage(chatId, 'Выберите категорию:', keyboardOptions);
  
      bot.once('message', async (categoryMsg) => {
        const result = await getRecommendations(categoryMsg.text, lon, lat, chatId, bot);
        bot.sendMessage(chatId, `Предлагаю вам следующие ${categoryMsg.text}:\n${result}`);
      });
    } catch (error) {
      sendErrorMessage(chatId, bot);
    }
  };