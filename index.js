const express = require('express');
const axios = require('axios');
const app = express();

// Notice the route now asks for :guildId and :userId
app.get('/avatar/:guildId/:userId', async (req, res) => {
    const { guildId, userId } = req.params;
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!BOT_TOKEN) {
        return res.status(500).send('Bot token is missing in Environment Variables.');
    }

    try {
        // Fetch the Guild Member object instead of just the User object
        const response = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` }
        });

        const member = response.data;
        const guildAvatar = member.avatar;
        const globalAvatar = member.user.avatar;
        const discriminator = member.user.discriminator;

        // 1. Check for a Server (Guild) Avatar first
        if (guildAvatar) {
            const ext = guildAvatar.startsWith('a_') ? 'gif' : 'png';
            return res.redirect(`https://cdn.discordapp.com/guilds/${guildId}/users/${userId}/avatars/${guildAvatar}.${ext}`);
        } 
        // 2. Fall back to Global Avatar
        else if (globalAvatar) {
            const ext = globalAvatar.startsWith('a_') ? 'gif' : 'png';
            return res.redirect(`https://cdn.discordapp.com/avatars/${userId}/${globalAvatar}.${ext}`);
        } 
        // 3. Fall back to Default Discord Avatar
        else {
            const defaultAvatarIndex = discriminator === '0' 
                ? (BigInt(userId) >> 22n) % 6n 
                : parseInt(discriminator) % 5;
            return res.redirect(`https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`);
        }

    } catch (error) {
        console.error('Error fetching Discord avatar:', error.response ? error.response.data : error.message);
        return res.status(500).send('Error fetching avatar. Ensure the bot is in the server.');
    }
});

module.exports = app;
