const { ComponentType } = require('discord.js');

async function onMessage(message) {
    if(message.author.bot) return;
    
    //message.reply("Bingo")

    const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

    collector.on('collect', i => {
	    if (i.user.id === interaction.user.id) {
		    i.reply(`${i.user.id} clicked on the ${i.buy} button.`);
	    } else {
		    i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
    	}
    });

    collector.on('end', collected => {
	    console.log(`Collected ${collected.size} interactions.`);
    });
};

module.exports = { 
    onMessage
}