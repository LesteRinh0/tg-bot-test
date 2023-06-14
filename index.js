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

bot.onText(/\/weather/, (msg) => {
  bot.sendMessage(msg.chat.id, "Привет! В каком городе вы находитесь?");
});

bot.onText(/(.+)/, async (msg, match) => {
  const text = match[1];
  const chatId = msg.chat.id;
  console.log(msg);

  if (msg.entities && msg.entities[0].type === "bot_command") {
    if (text === "/start") {
      bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}!`);
    }

    if (text === "/cat") {
      const response = await axios.get("https://meow.senither.com/v1/random");
      const cat = response.data.data.url;
      await bot.sendPhoto(chatId, cat);
    }

    if (text === "/dog") {
      const response = await axios.get(
        "https://dog.ceo/api/breeds/image/random"
      );
      const dog = response.data.message;
      await bot.sendPhoto(chatId, dog);
    }
  } else {
    const city = text;
    try {
      const result = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API}&units=metric`
      );
      const { name, weather, main } = result.data;

      const description = weather[0].description;
      const temp = main.temp;

      bot.sendMessage(
        chatId,
        `В городе ${name} сейчас ${description}. Температура составляет ${temp}°C.`
      );
    } catch (error) {
      bot.sendMessage(
        chatId,
        "Не удалось найти такой город. Попробуйте еще раз."
      );
    }
  }
});
