import { bot } from '../configs/botConfig.js';
import { collection } from '../configs/mongoConfig.js';
import { setReminder } from '../helpers/setReminder.js';
import { sendErrorMessage } from '../helpers/sendErrorMessage.js';

export async function createTask(createTaskMsg) {
  const chatId = createTaskMsg.chat.id;

  await bot.sendMessage(chatId, 'Введите задачу:').then(() => {
    const taskSaved = false;
    bot.once('text', (msg) => {
      if (!taskSaved) {
        const task = msg.text;

        if (task.startsWith("/")) {
          sendErrorMessage(chatId, bot);
          return;
        }

        try {
          collection.insertOne({
            taskId: msg.message_id,
            task,
            id: chatId,
            name: msg.chat.first_name,
          });

          const opts = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Да',
                    callback_data: `yes/${msg.message_id}`,
                  },
                  {
                    text: 'Нет',
                    callback_data: `no/${msg.message_id}`,
                  },
                ],
              ],
            },
          };

          bot.sendMessage(
            msg.from.id,
            'Хотите получить напоминание о задаче?',
            opts
          );
          bot.on('callback_query', setReminder);
        } catch (error) {
          bot.sendMessage(chatId, 'Ошибка при сохранении задачи.');
        }
      }
    });
  });
};