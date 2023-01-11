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

    //console.log(interaction.customId);
    console.log(interaction.user.id);
    
    //const filter = i => i.user.id === interaction.user.id;
    
    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 5000 });

    collector.on('collect', async i => {
        if (i.user.id === interaction.user.id && i.customId === 'buy') {
          
            const editEmbed = new EmbedBuilder()

                .setColor('DarkRed')
                .setTitle(`Welcome to The Terminal`)
                //.setAuthor({ name: client.user.username })
                .setDescription(`${i.user.username} clicked on ${i.customId} button`)
                .setThumbnail(client.user.avatarURL())
                //.addFields(embedFields)
                //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                .setTimestamp()
                //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });
            
	        //await i.update({ content: 'A button was clicked!', components: [] });
            await i.update({ embeds: [editEmbed], components: [] });
            collector.stop('Collector stopped manually');
        } else {
            i.reply({ content: `These buttons are not for you!`, ephemeral: true });
        }
    }) 

    collector.on('end', async (collected, reason) => {
        //console.log(`Collected ${collected.size} items`)
        if (collected.size == 0) {
            //console.log(`It was zero`);
            await interaction.editReply({ components: [] });
            const shutdownEmbed = new EmbedBuilder()

            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`No input, systems shutting down`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });
        
            await interaction.editReply({ embeds: [shutdownEmbed], components: [] });
        } else {
            console.log((`Collected ${collected.size} items`));
        }
    });
    }
};