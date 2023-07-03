import axios from 'axios';
import { links } from '../constants/constants.js';
import { isStartCommand, isCatCommand, isDogCommand, isHelpCommand, isRecommendCommand, isSubscribeCommand, isUnsubscribeCommand, isWeatherCommand } from '../helpers/helpers.js';
import { notifyStartCommand, notifyMissingCity, sendCatPhoto, sendDogPhoto, sendHelpMessage } from '../helpers/sendMessage.js';

export async function processCommand(text, chatId, bot, msg) {
  switch (true) {
    case isStartCommand(text):
      await notifyStartCommand(chatId, bot, msg.chat.first_name);
      break;
    case isWeatherCommand(text):
      await notifyMissingCity(chatId, bot, "/weather");
      break;
    case isRecommendCommand(text):
      await notifyMissingCity(chatId, bot, "/recommend");
      break;
    case isSubscribeCommand(text):
      await notifyMissingCity(chatId, bot, "/subscribe");
      break;
    case isUnsubscribeCommand(text):
      await notifyMissingCity(chatId, bot, "/unsubscribe");
      break;
    case isCatCommand(text):
      await sendCatPhoto(chatId, bot, axios, links.cat_url);
      break;
    case isDogCommand(text):
      await sendDogPhoto(chatId, bot, axios, links.dog_url);
      break;
    case isHelpCommand(text):
      await sendHelpMessage(chatId, bot, text);
      break;
    default:
      break;
  }
}