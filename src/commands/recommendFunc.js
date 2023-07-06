import axios from 'axios';
import { sendErrorMessage } from '../helpers/sendErrorMessage.js';
import { getCategoryUrlAndValue } from '../helpers/getCategoryUrlAndValue.js';

export async function getRecommendations(category, lon, lat, chatId, bot) {
  const { url, value } = getCategoryUrlAndValue(category, lon, lat);

  if (!url || !value) {
    bot.sendMessage(chatId, 'Вы не выбрали категорию из списка!');
    return;
  }

  try {
    const response = await axios.get(url);
    const result = response.data.features
      .filter((feature) => feature.properties.name)
      .map((feature) => feature.properties.name)
      .join('\n');
  
    return result;
  } catch (error) {
    sendErrorMessage(chatId, bot);
    }
  };