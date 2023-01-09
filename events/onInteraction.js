async function onInteraction(interaction) {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        await command.execute(interaction);
    } else if (interaction.isButton()) {
        //console.log(interaction);
        interaction.reply({ content: 'Don\'t touch me there!' });
    } else {
        return;
    }
};

module.exports = { 
    onInteraction
}