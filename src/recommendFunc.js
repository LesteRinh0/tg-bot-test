import axios from 'axios';
import { keys, sendErrorMessage } from './constants.js';

function getCategoryUrlAndValue(category, lon, lat) {
    let url;
    let value;
  
    if (category === 'Супер-маркеты') {
      url = `https://api.geoapify.com/v2/places?categories=commercial&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
      value = 'Супер-маркеты';
    } else if (category === 'Рестораны') {
      url = `https://api.geoapify.com/v2/places?categories=catering&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
      value = 'Рестораны';
    } else if (category === 'Активности') {
      url = `https://api.geoapify.com/v2/places?categories=activity&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
      value = 'Активности';
    } else if (category === 'Гостиницы') {
      url = `https://api.geoapify.com/v2/places?categories=accommodation&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
      value = 'Гостиницы';
    }
  
    return { url, value };
  }
  
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
  }