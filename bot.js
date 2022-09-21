require('dotenv').config();
const fetch = require('node-fetch');
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const mapRegex = /^https:\/\/osu.ppy.sh\/beatmapsets\/.+\/\d+$/;

client.on('message', msg => {
    if (msg.content === 'ding') {
        msg.reply('dong');
    }
    if (msg.content.match(mapRegex)) {
        const idRegex = /\d+$/g;
        const mapId = msg.content.match(idRegex)[0];
        fetch(`https://osu.ppy.sh/api/get_beatmaps?k=${process.env.OSU_API}&b=${mapId}`)
            .then(response => response.json())
            .then(data => {
                const mapData = data[0];
                const mapEmbed = new MessageEmbed()
                    .setColor(0xdaac00)
                    .setAuthor(
                        `${mapData.artist} - ${mapData.title} [${mapData.version}]`,
                        `http://s.ppy.sh/a/${mapData.creator_id}`,
                        `https://osu.ppy.sh/b/${mapId}`
                    )
                    .setDescription('Sample Text');
                console.log(mapEmbed);
                msg.channel.send({ embed: mapEmbed });
            });
    }
});

client.login(process.env.DISCORD_TOKEN);
