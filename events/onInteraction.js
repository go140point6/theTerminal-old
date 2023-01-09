async function onInteraction(interaction) {
    if (interaction.isChatInputCommand()) {
        console.log(interaction);
        const command = interaction.client.commands.get(interaction.commandName);
        await command.execute(interaction);
    } else if (interaction.isButton()) {
        console.log(interaction);
        interaction.editReply({ content: 'Don\'t touch me there!' });
    } else {
        return;
    }
};

module.exports = { 
    onInteraction
}