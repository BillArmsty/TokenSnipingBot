import { Telegraf } from "telegraf";

require("dotenv").config();

const telegram_bot_token = process.env.BOT_TOKEN!;

if (!telegram_bot_token) {
  console.log("Telegram bot token not found");
}

const bot = new Telegraf(telegram_bot_token!);

bot.start((ctx: any) => {
  ctx.reply(
    "Welcome, You account is successfully setup to receive notifications  ..."
  );
});

const sendNotification = async (message: any) => {
  console.log("\n\nSending Telegram notification...");

  bot.telegram
    .sendMessage("5938093301", message, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    })
    .catch((error: any) => {
      console.log(
        "\n\n Encountered an error while sending notification to",

      );
      console.log("===========================");
      console.log(error);
    });

    console.log("Done!");
};
bot.launch();

export { sendNotification };

