import axios from "axios";

import TelegramApi from "node-telegram-bot-api";

const token = "XXX";

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Приветствие" },
  { command: "/cat", description: "Случайное изображение кота" },
  { command: "/dog", description: "Случайное изображение собаки" },
  { command: "/weather", description: "Погода" },
]);

bot.on("message", async (msg) => {
  const catImage = "https://meow.senither.com/v1/random";
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "/start") {
    bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}!`);
  }

  if (text === "/cat") {
    await bot.sendPhoto(chatId, getImageCat(catImage));
  }
});

async function getImageCat(path) {
  await axios
    .get(path)
    .then((response) => response.json())
    .then((json) => json[0].data.url);
}
