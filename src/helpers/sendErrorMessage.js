export function sendErrorMessage(chatId, bot) {
    bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте еще раз.');
  };