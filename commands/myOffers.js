const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myOffers')
        .setDescription('Current BUY or SELL offers for an address'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('buy')
                .setLabel('BUY')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('sell')
                .setLabel('SELL')
                .setStyle(ButtonStyle.Primary),
        );

    await interaction.reply({ content: 'Would you like to view BUY or SELL offers?', components: [row] });
    },
};