import dotenv from 'dotenv';
import { env } from 'process';

export const key = {
  port: env.PORT,
  url: env.URL,
  token: env.TOKEN,
  weather_api: env.WEATHER_API,
  place_api: env.PLACE_API,
  dog_url: env.DOG_URL,
  cat_url: env.CAT_URL,
};

dotenv.config({ processEnv: key });
