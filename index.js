const express = require('express');
const axios = require('axios');
const app = express();

app.get('/avatar/:userId', async (req, res) => {
    const { userId } = req.params;
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!BOT_TOKEN) {
        return res.status(500).send('Bot token is missing in Environment Variables.');
    }

    try {
        const response = await axios.get(`https://discord.com/api/v10/users/${userId}`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` }
        });

        const { avatar, discriminator } = response.data;

        if (avatar) {
            const ext = avatar.startsWith('a_') ? 'gif' : 'png';
            return res.redirect(`https://cdn.discordapp.com/avatars/${userId}/${avatar}.${ext}`);
        } else {
            const defaultAvatarIndex = discriminator === '0' 
                ? (BigInt(userId) >> 22n) % 6n 
                : parseInt(discriminator) % 5;
            return res.redirect(`https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`);
        }

    } catch (error) {
        console.error('Error fetching Discord avatar:', error.message);
        return res.status(500).send('Error fetching avatar');
    }
});

// Export the app so Vercel can process it as a Serverless Function
module.exports = app;
