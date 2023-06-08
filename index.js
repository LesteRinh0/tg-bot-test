import axios from "axios";

import TelegramApi from "node-telegram-bot-api";

const token = "XXX";

const bot = new TelegramApi(token, { polling: true });

bot.on("message", async (msg) => {
  const catImage = axios
    .get("https://meow.senither.com/v1/random")
    .then((resolve) => console.log(resolve));
  // .then((json) => json[0].url);
  const text = msg.text;
  const chatId = msg.chat.id;
  console.log(catImage);

  if (text === "/start") {
    bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}!`);
  }
  if (text === "/help")
    bot.sendMessage(
      chatId,
      `Вот список доступных команд:
/cat - случайное изображение кота;
/dog - случайное изображение собаки;
/weather - погода`
    );

  if (text === "/cat") {
    await bot.sendPhoto(chatId, catImage);
  }
});
