const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');
const client = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myoffers')
        .setDescription('Current BUY or SELL offers for an address')
        .addStringOption((option) =>
        option
            .setName("address")
            .setDescription("The address you want to check.")
            .setRequired(true)
    ),
    async execute(interaction) {
        const address = interaction.options.getString("address", true);

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('buy')
                .setLabel('BUY')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('sell')
                .setLabel('SELL')
                .setStyle(ButtonStyle.Danger),
        );

        const embed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`Would you like to view BUY or SELL offers for ${address} ?`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });

    await interaction.reply({ embeds: [embed], components: [row] });
    //const MSG = await message.channel.send({embeds: [embed], components: [row]});

    client.on(Events.MessageCreate, async(message) => {
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
    
        collector.on('collect', i => {
            if (i.user.id === interaction.user.id) {
                i.reply(`${i.user.id} clicked on the ${i.buy} button.`);
            } else {
                i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
        });
    
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    
        })
    },
};