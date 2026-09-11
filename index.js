const mineflayer = require('mineflayer');
const http = require('http');

// Render.com'un botu kapatmaması için 7/24 aktif tutma portu
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot 7/24 Aktif!');
}).listen(port, () => {
  console.log(`HTTP sunucusu ${port} portunda baslatildi.`);
});

// BOT ŞİFRESİ
const BOT_PASSWORD = process.env.BOT_PASSWORD || 'Slayter1234';

function createBot() {
  console.log('Sunucuya baglaniliyor...');

  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP || 'fenrirmc.progamer.me',
    port: parseInt(process.env.SERVER_PORT) || 19450,
    username: process.env.BOT_NAME || 'Afk_ItzSlayterX'
  });

  // Chat (Sohbet) mesajlarını dinleyip otomatik kayıt/giriş yapma
  bot.on('messagestr', (message) => {
    const msg = message.toLowerCase();

    // Kayıt olma isteği algılanırsa
    if (msg.includes('/register') || msg.includes('kayit') || msg.includes('kayıt') || msg.includes('register')) {
      console.log('Kayıt isteği algılandı, /register komutu gönderiliyor...');
      bot.chat(`/register ${BOT_PASSWORD}`);
    } 
    // Giriş yapma isteği algılanırsa
    else if (msg.includes('/login') || msg.includes('giris') || msg.includes('giriş') || msg.includes('login')) {
      console.log('Giriş isteği algılandı, /login komutu gönderiliyor...');
      bot.chat(`/login ${BOT_PASSWORD}`);
    }
  });

  // Oyuna doğduğunda yedek olarak komutları sırayla dener
  bot.once('spawn', () => {
    console.log('Bot sunucuya başarıyla girdi!');
    setTimeout(() => {
      bot.chat(`/register ${BOT_PASSWORD}`);
      setTimeout(() => {
        bot.chat(`/login ${BOT_PASSWORD}`);
      }, 1500);
    }, 2000);
  });

  // Sunucudan atıldığında sebebi konsola yaz
  bot.on('kicked', (reason) => {
    console.log('Sunucudan atildi:', reason);
  });

  // Bağlantı koptuğunda SONSUZA KADAR 5 saniyede bir tekrar bağlan
  bot.on('end', () => {
    console.log('Baglanti kesildi. 5 saniye sonra tekrar baglaniliyor...');
    setTimeout(createBot, 5000);
  });

  // Bağlantı hatalarında çökmesini engelle
  bot.on('error', (err) => {
    console.log('Bot hatasi:', err.message);
  });
}

// Beklenmedik tüm hatalarda uygulamanın kapanmasını engelle
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.on('uncaughtException', (err) => {
  console.log('Beklenmeyen hata yakalandi:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.log('Islenmeyen soz hatasi:', reason);
});

createBot();

