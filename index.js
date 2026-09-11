const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP || 'fenrirmc.falixsrv.me',
    username: process.env.BOT_NAME || 'Afk_ItzSlayterX'
  });

  bot.on('end', () => setTimeout(createBot, 5000));
  bot.on('error', err => console.log(err));
}

createBot();
