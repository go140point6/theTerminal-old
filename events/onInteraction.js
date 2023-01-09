async function onInteraction(interaction) {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        await command.execute(interaction);
    } else {
        return;
    }
};

module.exports = { 
    onInteraction
}