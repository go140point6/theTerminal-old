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
                let currentOffers = [];
                let embedFields = [];
                //let count = 0;

                /*
                offers.forEach(offer => {
                    if (Object.keys(offer.buy).length !== 0) {
                        console.log(offer.buy[1])
                    }
                })
                */
                
                offers.forEach(offer => {
                    //console.log(offer.buy[0])
                    Object.entries(offer.buy).forEach(([key, val]) => {
                        //console.log(`${key} ${val}`)
                        //console.log(val)
                        //console.log(key)
                        //console.log(offer.buy[key])
                        //console.log(offer.buy[key].NFTokenID)
                        //console.log(key)
                        //console.log(offer.buy[key].Amount)
                        //currentOffers.push({ "id": offer.buy[key].NFTokenID, "offerNo": key, "amount": offer.buy[key].Amount })
                        //const findNFTIndex = currentOffers.findIndex (
                        //    (nftid) => currentOffers.id === offer.buy[key].NFTTokenID
                        //)
                        //console.log(findNFTIndex)
                        currentOffers.push({ "id": offer.buy[key].NFTokenID, "amount": offer.buy[key].Amount })
                        console.log(typeof(offer.buy[key].NFTTokenID))
                        console.log(currentOffers.length)
                        const findNFTIndex = currentOffers.findIndex(
                            (nftid) => nftid.id === offer.buy[key].NFTTokenID
                        )
                        console.log(findNFTIndex)


                        //console.log(currentOffers.length)
                    })
                })

                console.log(`There are ${currentOffers.length} BUY offers`);
                //console.log(currentOffers);

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