/*!
 * Created by Manh Tuan (JUNO_OKYO)
 * Demo for my video on TikTok: https://www.tiktok.com/@juno_okyo/video/7284660854539177221
 * Follow me for more videos.
 *
 * Please edit webhookUrl and token before run this script!!!
 */
import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import 'dotenv/config';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    if (!resp.includes(' ')) {
        bot.sendMessage(chatId, 'Vui lòng nhập đúng định dạng.' + '\n\n' + 'Ví dụ:\n```\n100k Mua sách\n```', {
            parse_mode: 'Markdown'
        });
        return;
    }

    bot.sendChatAction(chatId, 'Chờ Xíu....');

    const values = resp.split(' ');

    const date = new Date().toLocaleDateString('vi-VN');
    const name = msg.from.first_name || msg.from.username;
    const amount = values[0];
    const purpose = values.slice(1).join(' ');

    const url = new URL(process.env.WEBHOOK_URL);
    url.searchParams.append('Ngày', date);
    url.searchParams.append('Tên', name);
    url.searchParams.append('Số Tiền', amount);
    url.searchParams.append('Mục Đích', purpose);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                bot.sendMessage(chatId, '✅ Đã thêm thành công.');
            } else {
                bot.sendMessage(chatId, 'Không thể thêm. Vui lòng thử lại sau!');
            }
        })
        .catch(err => {
            bot.sendMessage(chatId, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!');
        });
});

console.log('Bot is running...')
