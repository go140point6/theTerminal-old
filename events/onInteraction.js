const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const client = require('../index');
const address = require('../myOffers');

async function onInteraction(interaction) {
    if (interaction.isChatInputCommand()) {
        //console.log(interaction);
        const command = interaction.client.commands.get(interaction.commandName);
        await command.execute(interaction);
    } else if (interaction.isButton()) {

        //console.log(interaction);
        //interaction.reply({ content: 'Don\'t touch me there!' });
        interaction.reply({ content: `${address}` })



    } else {
        return;
    }
};

module.exports = { 
    onInteraction
}