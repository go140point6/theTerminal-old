async function onInteraction(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    await command.execute(interaction);
};

module.exports = { 
    onInteraction
}