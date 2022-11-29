import { Telegraf } from "telegraf";

require("dotenv").config();

const telegram_bot_token = process.env.BOT_TOKEN!;

if (!telegram_bot_token) {
  console.log("Telegram bot token not found");
}

const bot = new Telegraf(telegram_bot_token!);

const main = async () => {
  bot.command("start", (ctx: { reply: (arg0: string) => any }) =>
    ctx.reply("Welcome! Up and running.")
  );
  // Handle other messages.
  bot.on("message", (ctx: { reply: (arg0: string) => any }) =>
    ctx.reply("Got another message!")
  );

  bot.launch();
};
