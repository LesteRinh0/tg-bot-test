import schedule from 'node-schedule';

import { bot } from '../configs/botConfig.js';
import { collection } from '../configs/mongoConfig.js';
import { firstNotify, secondNotify, thirdNotify } from '../crons/crons.js';

export async function setReminder(callbackQuery) {
    const { data } = callbackQuery;
    const msg = callbackQuery.message;
  
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
              text: '9:00',
              callback_data: `9:00/${action[1]}`,
            },
            {
              text: '14:00',
              callback_data: `14:00/${action[1]}`,
            },
            {
              text: '19:00',
              callback_data: `19:00/${action[1]}`,
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
      const text = `Напоминание установлено в ${action[0]}`;
  
      const taskTime = {
        '9:00': firstNotify,
        '14:00': secondNotify,
        '19:00': thirdNotify,
      };
  
      schedule.scheduleJob('taskNotif', taskTime[action[0]], async () => {
        const task = await collection.findOne({ taskId: +action[1] });
  
        bot.sendMessage(msg.chat.id, `Напоминание о ${task.task}`);
        schedule.cancelJob('taskNotif');
      });
  
      bot.editMessageText(text, opts);
    }
  };