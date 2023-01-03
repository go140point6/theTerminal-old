const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const XRP = require('../events/onReady');
const axios = require('axios');
const Database = require('better-sqlite3');
const client = require('../index');

//const db = new Database('./data/data.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('offers')
        .setDescription('Current offers for NFT owned by a particular address')
        .addStringOption((option) =>
            option
                .setName("address")
                .setDescription("The address you want to check.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const address = interaction.options.getString("address", true);
        console.log('Address to check: ' + address);
        await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/offers/nftowner/${address}`).then(res => {
            if(res.data) {
                console.log(res.data);
            }
        })
    }
};