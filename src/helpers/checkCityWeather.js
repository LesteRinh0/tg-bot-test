import axios from "axios";
import { keys, links } from "../constants/constants";

export async function checkCityWeather(cityName) {
    const url = `${links.weatherAPI}?q=${cityName}&appid=${keys.weather_api}&units=metric`;
  
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return true;
      } else {
        return false; 
      }
    } catch (error) {
      return false;
    }
  }