// global require declarations
require('dotenv').config();
const fetch = require('node-fetch');
const { Client, MessageEmbed } = require('discord.js');

// creating a discord client for login and usage
const client = new Client();

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

const mapFunction = (msg) => {
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
                const mapTitle = `${mapData.artist} - ${mapData.title} mapped by ${mapData.creator}`;
                const mapperPfp = `http://s.ppy.sh/a/${mapData.creator_id}`;
                // longer definition for map length string
                let seconds = mapData.total_length % 60;
                let minutes = Math.round(mapData.total_length / 60);
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                const length = `${minutes}:${seconds}`;
                // longer definition for AR, OD, HP, CS with trailing .0 decimals
                const metadata = [mapData.diff_size, mapData.diff_approach, mapData.diff_overall, mapData.diff_drain];
                for (i = 0; i < 4; i++) {
                    if (metadata[i].length < 3) {
                        metadata[i] = `${metadata[i]}.0`;
                    }
                }
                // fixing star rating to 2 decimal places
                const index = mapData.difficultyrating.indexOf('.');
                const starRating = mapData.difficultyrating.slice(0, index + 3);
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
                    .setDescription(`**${lengthString}** ${length} **${bpmString}** ${mapData.bpm}\n
                **__${mapData.version}__**\n
                **${difficultyString}** ${starRating}★ **${comboString}** ${mapData.max_combo}x\n
                **${csString}** ${metadata[0]} **${arString}** ${metadata[1]} **${odString}** ${metadata[2]} **${hpString}** ${metadata[3]}`)
                    .setImage(`https://assets.ppy.sh/beatmaps/${mapData.beatmapset_id}/covers/cover.jpg`)
                    .setFooter(`${rankedStatus} | ${mapData.favourite_count}❤︎ | ${mapData.playcount}▸`);
                // sending the embed in the same channel as the trigger message
                msg.channel.send({ embed: mapEmbed });
            });
    }
};

module.exports = mapFunction;