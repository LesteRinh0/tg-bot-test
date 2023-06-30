import axios from 'axios';
import { links } from '../constants/constants.js';
import { commands } from '../helpers/helpers.js';
import { notifyStartCommand, notifyMissingCity, sendCatPhoto, sendDogPhoto, sendHelpMessage } from '../helpers/sendMessage.js';

export async function processCommand(text, chatId, bot, msg) {
  switch (true) {
    case commands.isStartCommand(text):
      await notifyStartCommand(chatId, bot, msg.chat.first_name);
      break;
    case commands.isWeatherCommand(text):
      await notifyMissingCity(chatId, bot, "/weather");
      break;
    case commands.isRecommendCommand(text):
      await notifyMissingCity(chatId, bot, "/recommend");
      break;
    case commands.isSubscribeCommand(text):
      await notifyMissingCity(chatId, bot, "/subscribe");
      break;
    case commands.isUnsubscribeCommand(text):
      await notifyMissingCity(chatId, bot, "/unsubscribe");
      break;
    case commands.isCatCommand(text):
      await sendCatPhoto(chatId, bot, axios, links.cat_url);
      break;
    case commands.isDogCommand(text):
      await sendDogPhoto(chatId, bot, axios, links.dog_url);
      break;
    case commands.isHelpCommand(text):
      await sendHelpMessage(chatId, bot);
      break;
    default:
      break;
  }
}