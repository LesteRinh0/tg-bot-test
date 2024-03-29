import axios from "axios";
import { keys, links } from "../constants/constants.js";

export async function checkCityWeather(cityName) {
    const url = `${links.weatherAPI}?q=${cityName}&appid=${keys.weather_api}&units=metric`;
  
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  };