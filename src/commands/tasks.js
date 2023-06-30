import { collection } from "../configs/mongoConfig";

export async function viewTasks(chatId) {
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