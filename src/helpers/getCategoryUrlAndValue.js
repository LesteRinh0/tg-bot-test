import { keys, links } from '../constants/constants.js';

export function getCategoryUrlAndValue(category, lon, lat) {
    let url;
    let value;
    let choose;
  
    switch (category) {
      case 'Супер-маркеты':
        choose = 'commercial';
        url = `${links.recommend_url}commercial&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
        value = 'Супер-маркеты';
        break;
      case 'Рестораны':
        choose = 'catering';
        url = `${links.recommend_url}catering&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
        value = 'Рестораны';
        break;
      case 'Активности':
        choose = 'activity';
        url = `${links.recommend_url}activity&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
        value = 'Активности';
        break;
      case 'Гостиницы':
        choose = 'accommodation';
        url = `${links.recommend_url}accommodation&bias=proximity:${lon},${lat}&limit=10&apiKey=${keys.place_api}`;
        value = 'Гостиницы';
        break;
    }
  
    return { url, value };
  };