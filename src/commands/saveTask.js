import schedule from 'node-schedule';
import { bot } from '../configs/botConfig.js';
import { collection } from '../configs/mongoConfig.js';

export async function createTask(createTaskMsg) {
    const chatId = createTaskMsg.chat.id;
  
    await bot.sendMessage(chatId, 'Введите задачу:').then(() => {
      const taskSaved = false;
      bot.once('text', (msg) => {
        if (!taskSaved) {
          const task = msg.text;
  
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
            bot.on('callback_query', setReminder(schedule, bot, collection));
          } catch (error) {
            bot.sendMessage(chatId, 'Ошибка при сохранении задачи.');
          }
        }
      });
    });
  };