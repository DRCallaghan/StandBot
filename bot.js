// global require declarations
require('dotenv').config();
const fetch = require('node-fetch');
const { Client, MessageEmbed, bold, italic, strikethrough, underscore, spoiler, quote, blockQuote, hyperlink, hideLinkEmbed } = require('discord.js');

// creating a discord client for login and usage
const client = new Client();

// log message on login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// other global helper variables
const mapRegex = /^https:\/\/osu.ppy.sh\/beatmapsets\/.+\/\d+$/;
const lengthString = 'Length:';
const bpmString = 'BPM:';
const difficultyString = '▸Difficulty:';
const comboString = '▸Max Combo:';
const arString = '▸AR:';
const odString = '▸OD:';
const hpString = '▸HP:';
const csString = '▸CS:';

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
                // defining useful variables to keep the embed code cleaner
                const mapData = data[0];
                const mapTitle = `${mapData.artist} - ${mapData.title} [${mapData.version}]`;
                const mapperPfp = `http://s.ppy.sh/a/${mapData.creator_id}`;
                let seconds = mapData.total_length % 60;
                let minutes = Math.round(mapData.total_length / 60);
                console.log(seconds);
                console.log(minutes);
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                const length = `${minutes}:${seconds}`;
                console.log(length);
                // getting the map mode for the beatmap URL to keep URLs all in new format
                let mapMode;
                switch (mapData.mode) {
                    case '0':
                        mapMode = 'osu';
                        break;
                    case '1':
                        mapMode = 'taiko';
                        break;
                    case '2':
                        mapMode = 'fruits';
                        break;
                    case '3':
                        mapMode = 'mania';
                        break;
                    default:
                        mapMode = 'osu';
                        break;
                }
                const mapLink = `https://osu.ppy.sh/beatmapsets/${mapData.beatmapset_id}#${mapMode}/${mapId}`;
                // getting the ranked status for the map
                let rankedStatus;
                switch (mapData.approved) {
                    case '1':
                        rankedStatus = 'Ranked';
                        break;
                    case '3':
                        rankedStatus = 'Qualified';
                        break;
                    case '4':
                        rankedStatus = 'Loved';
                        break;
                    case '0':
                        rankedStatus = 'Pending';
                        break;
                    case '-1':
                        rankedStatus = 'WIP';
                        break;
                    case '-2':
                        rankedStatus = 'Graveyard';
                        break;
                }

                // creating the actual embed
                const mapEmbed = new MessageEmbed()
                    .setColor(0xdaac00)
                    .setAuthor(mapTitle, mapperPfp, mapLink)
                    .setDescription(``);
                // sending the embed in the same channel as the trigger message
                msg.channel.send({ embed: mapEmbed });
            });
    }
});

// logging in
client.login(process.env.DISCORD_TOKEN);
