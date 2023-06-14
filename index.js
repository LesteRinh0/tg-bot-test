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
  console.log(msg.text);

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
});
bot.onText(/\/weather/, (msg) => {
  bot.sendMessage(msg.chat.id, "Привет! В каком городе вы находитесь?");
  if (msg.text != "/weather") {
    bot.sendMessage(msg.chat.id, "Город не введен.");
  } else {
    bot.onText(/(.+)/, async (msg, match) => {
      const city = match[1];

      try {
        const result = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API}&units=metric`
        );
        const { name, weather, main } = result.data;

        const description = weather[0].description;
        const temp = main.temp;

        bot.sendMessage(
          msg.chat.id,
          `В городе ${name} сейчас ${description}. Температура составляет ${temp}°C.`
        );
      } catch (error) {
        bot.sendMessage(
          msg.chat.id,
          "Не удалось найти такой город. Попробуйте еще раз."
        );
      }
    });
  }
});
