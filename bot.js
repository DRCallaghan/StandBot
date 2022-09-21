// global require declarations
require('dotenv').config();
const fetch = require('node-fetch');
const { Client, MessageEmbed } = require('discord.js');

// creating a discord client for login and usage
const client = new Client();

// log message on login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// other global helper variables
const mapRegex = /^https:\/\/osu.ppy.sh\/beatmapsets\/.+\/\d+$/;

// on message triggers for different bot functions
client.on('message', msg => {
    // ding dong test function
    if (msg.content === 'ding') {
        msg.reply('dong');
    }
    // map info embed
    if (msg.content.match(mapRegex)) {
        // pulling the beatmap ID out of the link sent
        const idRegex = /\d+$/g;
        const mapId = msg.content.match(idRegex)[0];
        // fetching data from the osu! API using my API key and the beatmap ID
        fetch(`https://osu.ppy.sh/api/get_beatmaps?k=${process.env.OSU_API}&b=${mapId}`)
            .then(response => response.json())
            .then(data => {
                // defining useful variable to keep the embed code cleaner
                const mapData = data[0];
                const mapTitle = `${mapData.artist} - ${mapData.title} [${mapData.version}]`;
                const mapperPfp = `http://s.ppy.sh/a/${mapData.creator_id}`;
                const mapLink = `https://osu.ppy.sh/b/${mapId}`;

                // creating the actual embed
                const mapEmbed = new MessageEmbed()
                    .setColor(0xdaac00)
                    .setAuthor(mapTitle, mapperPfp, mapLink)
                    .setDescription('Sample Text');

                // sending the embed in the same channel as the trigger message
                msg.channel.send({ embed: mapEmbed });
            });
    }
});

// logging in
client.login(process.env.DISCORD_TOKEN);
