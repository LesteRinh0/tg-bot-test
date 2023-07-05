import { keys } from '../constants/constants.js';

export function getCategoryUrlAndValue(category, lon, lat) {
    let url;
    let value;
  
    switch (category) {
      case 'Супер-маркеты':
        url = `https://api.geoapify.com/v2/places?categories=commercial&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
        value = 'Супер-маркеты';
        break;
      case 'Рестораны':
        url = `https://api.geoapify.com/v2/places?categories=catering&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
        value = 'Рестораны';
        break;
      case 'Активности':
        url = `https://api.geoapify.com/v2/places?categories=activity&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
        value = 'Активности';
        break;
      case 'Гостиницы':
        url = `https://api.geoapify.com/v2/places?categories=accommodation&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
        value = 'Гостиницы';
        break;
    }
  
    return { url, value };
  };