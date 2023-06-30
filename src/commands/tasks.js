import { collection } from "../configs/mongoConfig.js";

export async function viewTasks(msg, bot) {
    const chatId = msg.chat.id
    try {
        const tasks = await collection.find({ id: chatId }).toArray();
        let tasksMsg = 'Ваши задачи:\n\n';
        tasks.forEach((task) => {
            tasksMsg += `• ${task.task}\n`;
        });
        bot.sendMessage(chatId, tasksMsg);
    } catch (error) {
        bot.sendMessage(chatId, 'Ошибка при просмотре задач.');
    }
}