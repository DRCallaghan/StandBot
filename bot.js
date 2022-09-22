// global require declarations
require('dotenv').config();
const { Client } = require('discord.js');
const mapFunction = require('./src/map');

// creating a discord client for login and usage
const client = new Client();

// log message on login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// on message triggers for different bot functions
client.on('message', msg => {
    // ding dong test function
    if (msg.content === 'ding') {
        msg.reply('dong');
    }
    mapFunction(msg);
});

// logging in
client.login(process.env.DISCORD_TOKEN);
