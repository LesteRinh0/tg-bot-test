import "dotenv/config";

export const key = {
  port: process.env.PORT,
  url: process.env.URL,
  token: process.env.TOKEN,
  weather_api: process.env.WEATHER_API,
  place_api: process.env.PLACE_API,
  dog_url: process.env.DOG_URL,
  cat_url: process.env.CAT_URL,
};
