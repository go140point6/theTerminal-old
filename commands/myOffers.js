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

        const initialEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`Would you like to view BUY or SELL offers for ${address} ?`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });

    await interaction.reply({ embeds: [initialEmbed], components: [row] });
    
    /* Good example of editing a non-embed message and removing the buttons
    const filter = i => i.customId === 'buy';

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
	    await i.update({ content: 'A button was clicked!', components: [] });
    });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    */

    /* Good example of embed update
    const filter = i => i.customId === 'buy';

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        const editEmbed = new EmbedBuilder()

            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`You clicked a button and I removed them below`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });
            
	    //await i.update({ content: 'A button was clicked!', components: [] });
        await i.update({ embeds: [editEmbed], components: [] });
    });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    */

    collector.on('collect', async i => {
        if (i.customId === 'buy') {
            await i.deferUpdate();
            await wait(4000);
            await i.editReply({ content: 'You clicked the BUY button!', components: [] });
        } else if (i.customId === 'sell') {
            await i.deferUpdate();
            await wait(4000);
            await i.editReply({ content: 'You clicked the SELL button!', components: [] });
        }
    });
    
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));

    }
};