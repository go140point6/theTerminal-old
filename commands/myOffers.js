const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');
const axios = require('axios');
const client = require('../index');

var offers;
var sellOffers;
var currentOffers2;
var currentSellOffers2;
var currentIndex;
var lastIndexObj;
var rawAmount;
var amount;

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
            .setDescription(`Would you like to view BUY or SELL offers?`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            .setFooter({ text: `${address}` });

    await interaction.reply({ embeds: [initialEmbed], components: [row] });
    //console.log(interaction.user.id);
    
    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120000 });

    collector.on('collect', async i => {
        if (i.user.id === interaction.user.id && i.customId === 'buy') {
            
            //console.log('Address to check: ' + address);
            buyOffers(i);

        } else if (i.user.id === interaction.user.id && i.customId === 'sell') {

            sellOffers(i);
          
        } else if (i.user.id === interaction.user.id && i.customId === 'nextBuy') {

            currentIndex++
            nextBuyOffer(i);

        } else if (i.user.id === interaction.user.id && i.customId === 'prevBuy') {
            
            currentIndex--
            nextBuyOffer(i);

        } else if (i.user.id === interaction.user.id && i.customId === 'nextSell') {

            currentIndex++
            nextSellOffer(i);

        } else if (i.user.id === interaction.user.id && i.customId === 'prevSell') {
            
            currentIndex--
            nextSellOffer(i);
            
        } else {

            i.reply({ content: `These buttons are not for you!`, ephemeral: true });
        }
    }) 

    collector.on('end', async (collected, reason) => {
        //console.log(`Collected ${collected.size} items`)
        //if (collected.size == 0) {
            //console.log(`It was zero`);
            await interaction.editReply({ components: [] });
            const shutdownEmbed = new EmbedBuilder()

            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`Time is up, systems shutting down`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });
        
            await interaction.editReply({ embeds: [shutdownEmbed], components: [] });
        //} else {
        //    console.log((`Collected ${collected.size} items`));
        //}
    });

    async function nextBuyOffer(i) {
        console.log(currentIndex);
        console.log(`There are ${currentOffers2.length} BUY offers when including only the highest offer on an NFT`);

        getBuyPrice();

        console.log(lastIndexObj)
        console.log(typeof(lastIndexObj))
        console.log(currentIndex)
        console.log(typeof(currentIndex))

        if (lastIndexObj === currentIndex) {
            console.log(true)
        } else {
            console.log(false)
        }

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevBuy')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
            new ButtonBuilder()
                .setLabel('More Info')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://nftoken.id/?${currentOffers2[currentIndex].NFTokenID}`),
            new ButtonBuilder()
                .setCustomId('nextBuy')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
        );                

        const editBuyEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`This address has ${currentOffers2.length} BUY offers, counting ONLY the highest bids.`)
            .setThumbnail(client.user.avatarURL())
            .addFields({ name: `The highest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
            .setImage(`https://marketplace-api.onxrp.com/api/image/${currentOffers2[currentIndex].NFTokenID}?thumbnail=true`)
            .setTimestamp()
            //.setFooter({ text: `${address}` });

        i.update({ embeds: [editBuyEmbed], components: [row] });
    }

    async function prevBuyOffer(i) {
        console.log(currentIndex);
        console.log(`There are ${currentOffers2.length} BUY offers when including only the highest offer on an NFT`);

        getBuyPrice();

        console.log(lastIndexObj)
        console.log(typeof(lastIndexObj))
        console.log(currentIndex)
        console.log(typeof(currentIndex))

        if (lastIndexObj === currentIndex) {
            console.log(true)
        } else {
            console.log(false)
        }

        //console.log(disable);    

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevBuy')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
            new ButtonBuilder()
                .setLabel('More Info')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://nftoken.id/?${currentOffers2[currentIndex].NFTokenID}`),
            new ButtonBuilder()
                .setCustomId('nextBuy')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
        );                

        const editBuyEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`This address has ${currentOffers2.length} BUY offers, counting ONLY the highest bids.`)
            .setThumbnail(client.user.avatarURL())
            .addFields({ name: `The highest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
            .setImage(`https://marketplace-api.onxrp.com/api/image/${currentOffers2[currentIndex].NFTokenID}?thumbnail=true`)
            .setTimestamp()
            //.setFooter({ text: `${address}` });

        i.update({ embeds: [editBuyEmbed], components: [row] });
    }

    async function getBuyPrice() {
        rawAmount = currentOffers2.at(currentIndex).Amount;
        //console.log(rawAmount);
        amount = (Number(rawAmount))/1000000;
        //console.log(amount);
    }

    async function nextSellOffer(i) {
        console.log(currentIndex);
        console.log(`There are ${currentSellOffers2.length} BUY offers when including only the highest offer on an NFT`);

        getSellPrice();

        console.log(lastIndexObj)
        console.log(typeof(lastIndexObj))
        console.log(currentIndex)
        console.log(typeof(currentIndex))

        if (lastIndexObj === currentIndex) {
            console.log(true)
        } else {
            console.log(false)
        }

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevSell')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
            new ButtonBuilder()
                .setLabel('More Info')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://nftoken.id/?${currentSellOffers2[currentIndex].NFTokenID}`),
            new ButtonBuilder()
                .setCustomId('nextSell')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
        );                

        const editSellEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`This address has ${currentSellOffers2.length} SELL offers, counting ONLY the lowest offer on an NFT.`)
            .setThumbnail(client.user.avatarURL())
            .addFields({ name: `The lowest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
            .setImage(`https://marketplace-api.onxrp.com/api/image/${currentSellOffers2[currentIndex].NFTokenID}?thumbnail=true`)
            .setTimestamp()
            //.setFooter({ text: `${address}` });

        i.update({ embeds: [editSellEmbed], components: [row] });
    }

    async function prevSellOffer(i) {
        console.log(currentIndex);
        console.log(`There are ${currentSellOffers2.length} SELL offers when including only the lowest offer on an NFT.`);

        getSellPrice();

        console.log(lastIndexObj)
        console.log(typeof(lastIndexObj))
        console.log(currentIndex)
        console.log(typeof(currentIndex))

        if (lastIndexObj === currentIndex) {
            console.log(true)
        } else {
            console.log(false)
        }

        //console.log(disable);    

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevSell')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
            new ButtonBuilder()
                .setLabel('More Info')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://nftoken.id/?${currentSellOffers2[currentIndex].NFTokenID}`),
            new ButtonBuilder()
                .setCustomId('nextSell')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
        );                

        const editSellEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`This address has ${currentSellOffers2.length} SELL offers when including only the lowest offer on an NFT.`)
            .setThumbnail(client.user.avatarURL())
            .addFields({ name: `The lowest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
            .setImage(`https://marketplace-api.onxrp.com/api/image/${currentSellOffers2[currentIndex].NFTokenID}?thumbnail=true`)
            .setTimestamp()
            //.setFooter({ text: `${address}` });

        i.update({ embeds: [editSellEmbed], components: [row] });
    }

    async function getBuyPrice() {
        rawAmount = currentOffers2.at(currentIndex).Amount;
        //console.log(rawAmount);
        amount = (Number(rawAmount))/1000000;
        //console.log(amount);
    }

    async function getSellPrice() {
        rawAmount = currentSellOffers2.at(currentIndex).Amount;
        //console.log(rawAmount);
        amount = (Number(rawAmount))/1000000;
        //console.log(amount);
    }

    async function buyOffers(i) {
        await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/offers/nftowner/${address}`).then(res => {
            if(res.data) {
                //console.log(res.data.data.offers)
                //console.log(res.data.data.offers.length)

                offers = res.data.data.offers;
                let currentOffers = [];

                offers.forEach(offer => {
                    Object.entries(offer.buy).forEach(([key, val]) => {
                        
                        const findNFTIndex = currentOffers.findIndex(
                            (nftid) => nftid.NFTokenID === offer.buy[key].NFTokenID
                        )

                        if (findNFTIndex == -1) {
                            currentOffers.push({
                                "offerNo": key, 
                                "Amount":offer.buy[key].Amount, 
                                "NFTokenID": offer.buy[key].NFTokenID, 
                                "OfferID": offer.buy[key].OfferID, 
                                "Owner": offer.buy[key].Owner, 
                                "Destination": offer.buy[key].Destination, 
                                "Expiration": offer.buy[key].Expiration
                            })
                        } else {
                            currentOffers[findNFTIndex] = {
                                "offerNo": key, 
                                "Amount":offer.buy[key].Amount, 
                                "NFTokenID": offer.buy[key].NFTokenID, 
                                "OfferID": offer.buy[key].OfferID, 
                                "Owner": offer.buy[key].Owner, 
                                "Destination": offer.buy[key].Destination, 
                                "Expiration": offer.buy[key].Expiration
                            }
                        }
                    })
                })

                currentOffers2 = currentOffers.map(v => ({...v, "index": null}))

                const iterator = currentOffers2.keys();

                for (const key2 of iterator) {
                    console.log(key2);
                    currentOffers2[key2].index = key2
                }

                //console.log(`There are ${currentOffers2.length} BUY offers when including only the highest offer on an NFT`);

                //console.log(currentOffers2.length);
                lastIndexObj = (currentOffers2.length - 1);
                //console.log(lastIndexObj);

                currentIndex = 0;

                getBuyPrice();

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prevBuy')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setLabel('More Info')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://nftoken.id/?${currentOffers2[currentIndex].NFTokenID}`),
                    new ButtonBuilder()
                        .setCustomId('nextBuy')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(false),
                );                

                const editBuyEmbed = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle(`Welcome to The Terminal`)
                    //.setAuthor({ name: client.user.username })
                    .setDescription(`This address has ${currentOffers2.length} BUY offers, counting ONLY the highest bids.`)
                    .setThumbnail(client.user.avatarURL())
                    .addFields({ name: `The highest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
                    .setImage(`https://marketplace-api.onxrp.com/api/image/${currentOffers2[currentIndex].NFTokenID}?thumbnail=true`)
                    .setTimestamp()
                    //.setFooter({ text: `${address}` });
        
                i.update({ embeds: [editBuyEmbed], components: [row] });
                //collector.stop('Collector stopped manually');
            }
        })
    };

    async function sellOffers(i) {
        await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/offers/nftowner/${address}`).then(res => {
            if(res.data) {
                //console.log(res.data.data.offers)
                //console.log(res.data.data.offers.length)

                sellOffers = res.data.data.offers;
                let currentSellOffers = [];

                sellOffers.forEach(offer => {
                    Object.entries(offer.sell).forEach(([key, val]) => {
                        
                        const findNFTIndex = currentSellOffers.findIndex(
                            (nftid) => nftid.NFTokenID === offer.sell[key].NFTokenID
                        )

                        if (findNFTIndex == -1) {
                            currentSellOffers.push({
                                "offerNo": key, 
                                "Amount":offer.sell[key].Amount, 
                                "NFTokenID": offer.sell[key].NFTokenID, 
                                "OfferID": offer.sell[key].OfferID, 
                                "Owner": offer.sell[key].Owner, 
                                "Destination": offer.sell[key].Destination, 
                                "Expiration": offer.sell[key].Expiration
                            })
                        } else {
                            currentSellOffers[findNFTIndex] = {
                                "offerNo": key, 
                                "Amount":offer.sell[key].Amount, 
                                "NFTokenID": offer.sell[key].NFTokenID, 
                                "OfferID": offer.sell[key].OfferID, 
                                "Owner": offer.sell[key].Owner, 
                                "Destination": offer.sell[key].Destination, 
                                "Expiration": offer.sell[key].Expiration
                            }
                        }
                    })
                })

                currentSellOffers2 = currentSellOffers.map(v => ({...v, "index": null}))

                const iterator = currentSellOffers2.keys();

                for (const key2 of iterator) {
                    //console.log(key2);
                    currentSellOffers2[key2].index = key2
                }

                console.log(`There are ${currentSellOffers2.length} SELL offers when including only the lowest offer on an NFT`);

                //console.log(currentSellOffers2.length);
                lastIndexObj = (currentSellOffers2.length - 1);
                //console.log(lastIndexObj);

                currentIndex = 0;

                getSellPrice();

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prevSell')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setLabel('More Info')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://nftoken.id/?${currentSellOffers2[currentIndex].NFTokenID}`),
                    new ButtonBuilder()
                        .setCustomId('nextSell')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(false),
                );                

                const editSellEmbed = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle(`Welcome to The Terminal`)
                    //.setAuthor({ name: client.user.username })
                    .setDescription(`This address has ${currentSellOffers2.length} SELL offers, counting ONLY the lowest bid.`)
                    .setThumbnail(client.user.avatarURL())
                    .addFields({ name: `The lowest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
                    .setImage(`https://marketplace-api.onxrp.com/api/image/${currentSellOffers2[currentIndex].NFTokenID}?thumbnail=true`)
                    .setTimestamp()
                    //.setFooter({ text: `${address}` });
        
                i.update({ embeds: [editSellEmbed], components: [row] });
                //collector.stop('Collector stopped manually');
            }
        })
    };

    }
};