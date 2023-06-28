import 'dotenv/config'

export const key = {
  port: process.env.PORT,
  url: process.env.URL,
  token: process.env.TOKEN,
  weather_api: process.env.WEATHER_API,
  place_api: process.env.PLACE_API,
};

  export const dog_url = 'https://dog.ceo/api/breeds/image/random';
  export const cat_url = 'https://meow.senither.com/v1/random';