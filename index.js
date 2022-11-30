require('dotenv').config();
require('log-timestamp');
const { Client, Events } = require('discord.js');
const { GatewayIntentBits } = require('./config/GatewayIntentBits');
const { onReady } = require('./events/onReady');
const { onInteraction } = require('./events/onInteraction');
const { validateEnv } = require('./utils/validateEnv');

(async () => {
    validateEnv();

    const client = new Client({ intents: GatewayIntentBits });
    module.exports = client;

    client.on(Events.ClientReady, async() => await onReady(client));

    client.on(Events.InteractionCreate, async interaction => { 
        onInteraction(interaction)
        //console.log(interaction.commandName)
    });
    
    await client.login(process.env.BOT_TOKEN);
})();