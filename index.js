import axios from "axios";
import "dotenv/config";

import TelegramApi from "node-telegram-bot-api";

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Приветствие" },
  { command: "/cat", description: "Случайное изображение кота" },
  { command: "/dog", description: "Случайное изображение собаки" },
  { command: "/weather", description: "Погода в твоем городе" },
]);

bot.on("message", async (msg) => {
  const dogImage = "https://dog.ceo/api/breeds/image/random";
  const catImage = "https://meow.senither.com/v1/random";
  const text = msg.text;
  const chatId = msg.chat.id;
  //console.log(msg.text);

  if (text === "/start") {
    bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}!`);
  }

  if (text === "/cat") {
    const cat = await axios
      .get(catImage)
      .then((response) => response.data.data.url);
    await bot.sendPhoto(chatId, cat);
  }

  if (text === "/dog") {
    const dog = await axios
      .get(dogImage)
      .then((response) => response.data.message);
    await bot.sendPhoto(chatId, dog);
  }

  /*if (text === "/weather") {
    bot.sendMessage(chatId, `Введите нужный вам город`);
    const cityName = msg.text;
    /*if (cityName != "/weather") {
      const city = await axios
        .get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${process.env.WEATHER_API}`
        )
        .then((ts) => ts);
    }

    /*const city = await axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${process.env.WEATHER_API}`
      )
     .then((resp) => console.log(resp.data));
    console.log(cityName);
    console.log(city);
     bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}!`);
  }
}*/
});

bot.onText(/\/weather/, (msg, match) => {
  console.log("");
  bot.sendMessage(chatId, "");
});
