const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');
const axios = require('axios');
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
    console.log(interaction.user.id);
    
    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 5000 });

    collector.on('collect', async i => {
        if (i.user.id === interaction.user.id && i.customId === 'buy') {
            
            console.log('Address to check: ' + address);
            buyOffers(i);

         } else if (i.user.id === interaction.user.id && i.customId === 'sell') {
          
                const editSellEmbed = new EmbedBuilder()
    
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
                i.update({ embeds: [editSellEmbed], components: [] });
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

    async function buyOffers(i) {
        await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/offers/nftowner/${address}`).then(res => {
            if(res.data) {
                //console.log(res.data.data.offers)
                console.log(res.data.data.offers.length)

                let offers = res.data.data.offers;
                //let embedFields = [];
                let count = 0;

                /*
                offers.forEach(offer => {
                    if (Object.keys(offer.buy).length !== 0) {
                        console.log(offer.buy[0])
                    }
                })
                */

                for (var key in offers) {
                    //for (var key1 in offers[key]) {
                        if (offers[key].buy !== 0)
                        console.log(offers[key].buy)
                    //}
                }

                /*
                let offers = res.data.data.offers;
                let embedFields = [];
    
                offers.forEach(offer => {
                 if (Object.keys(offer.buy).length !== 0) {
                     let rawAmount = (offer.buy[0].Amount)
                     let amount = (Number(rawAmount))/1000000;
    
                     embedFields.push({ name: offer.buy[0].NFTokenID, value: amount.toString()})
                    }
                })
    
            const editBuyEmbed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTitle(`Welcome to The Terminal`)
                //.setAuthor({ name: client.user.username })
                .setDescription(`Current BUY offers for ${address}`)
                .setThumbnail(client.user.avatarURL())
                .addFields(embedFields)
                //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                .setTimestamp()
                //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });
        
            //await i.update({ content: 'A button was clicked!', components: [] });
            i.update({ embeds: [editBuyEmbed], components: [] });
            collector.stop('Collector stopped manually');
            */
            }
        })
    };

    }
};