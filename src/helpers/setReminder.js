import schedule from 'node-schedule';

import { bot } from '../configs/botConfig.js';
import { collection } from '../configs/mongoConfig.js';

export async function setReminder(callbackQuery) {
    const { data } = callbackQuery;
    const msg = callbackQuery.message;
    const everyHour = '0 * * * *';
    const every2Hours = '0 */2 * * *';
    const every4Hours = '0 */4 * * *';
  
    const opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    };
  
    const action = data.split('/');
  
    if (action[0] === 'yes' || action[0] === 'no') {
      const taskNotificationButtons = {
        inline_keyboard: [
          [
            {
              text: 'Час',
              callback_data: `час/${action[1]}`,
            },
            {
              text: '2 часа',
              callback_data: `2 часа/${action[1]}`,
            },
            {
              text: '4 часа',
              callback_data: `4 часа/${action[1]}`,
            },
          ],
        ],
      };
  
      const options = action[0] === 'yes' ? taskNotificationButtons : undefined;
  
      const text =
        action[0] === 'yes'
          ? 'Когда хотите получить напоминание?'
          : 'Напоминания не будет';
  
      bot.editMessageText(text, { ...opts, reply_markup: options });
    } else {
      const text = `Напоминание установлено через ${action[0]}`;
  
      const taskTime = {
        час: everyHour,
        '2 часа': every2Hours,
        '4 часа': every4Hours,
      };
  
      schedule.scheduleJob('taskNotif', taskTime[action[0]], async () => {
        const task = await collection.findOne({ taskId: +action[1] });
  
        bot.sendMessage(msg.chat.id, `Напоминание о ${task.task}`);
        schedule.cancelJob('taskNotif');
      });
  
      bot.editMessageText(text, opts);
    }
  }