import { collection } from "../configs/mongoConfig.js";
import { bot } from '../configs/botConfig.js';

export async function viewTasks(msg) {
    const chatId = msg.chat.id;
    try {
        const tasks = await collection.find({ id: chatId }).toArray();
        let tasksMsg = 'Ваши задачи:\n\n';
        tasks.forEach((task) => {
            if(task != "undefined"){
            tasksMsg += `• ${task.task}\n`;
            }
        });
        bot.sendMessage(chatId, tasksMsg);
    } catch (error) {
        bot.sendMessage(chatId, 'Ошибка при просмотре задач.');
    }
}