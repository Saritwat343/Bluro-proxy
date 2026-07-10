const express = require('express');
const axios = require('axios');
const app = express();

// Helper function to handle the core Discord API logic
async function getAvatar(req, res) {
    const { guildId, userId } = req.params;
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!BOT_TOKEN) {
        return res.status(500).send('Missing BOT_TOKEN in environment variables.');
    }

    try {
        // CASE 1: Server ID was provided -> Try to fetch Server Avatar
        if (guildId) {
            try {
                const response = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
                    headers: { Authorization: `Bot ${BOT_TOKEN}` }
                });
                const member = response.data;
                
                if (member.avatar) {
                    const ext = member.avatar.startsWith('a_') ? 'gif' : 'png';
                    return res.redirect(`https://cdn.discordapp.com/guilds/${guildId}/users/${userId}/avatars/${member.avatar}.${ext}`);
                }
                
                // If they are in the server but don't have a server-specific avatar, 
                // continue downward to fetch their global avatar instead!
            } catch (serverError) {
                console.log('Server fetch failed or bot not in server, falling back to global.');
            }
        }

        // CASE 2: No Server ID OR User has no Server Avatar -> Fetch Global Avatar
        const response = await axios.get(`https://discord.com/api/v10/users/${userId}`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` }
        });
        
        const user = response.data;

        if (user.avatar) {
            const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
            return res.redirect(`https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.${ext}`);
        } else {
            // Ultimate fallback to Discord's default color avatars
            const defaultAvatarIndex = user.discriminator === '0' 
                ? (BigInt(userId) >> 22n) % 6n 
                : parseInt(user.discriminator) % 5;
            return res.redirect(`https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`);
        }

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return res.status(500).send('Could not fetch avatar.');
    }
}

// ROUTE 1: Server ID is included (Checks server first, then global)
app.get('/avatar/:guildId/:userId', getAvatar);

// ROUTE 2: Server ID is skipped (Goes straight to global)
app.get('/avatar/:userId', getAvatar);

module.exports = app;
