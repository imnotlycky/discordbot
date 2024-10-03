const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits} = require("discord.js")

module.exports = {
     /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: (client, interaction) => {
        interaction.reply("a")
    },

    name: "verify",
    description: "verify yourself",
    permissionsRequired: [],
    botPermissions: [
        PermissionFlagsBits.Administrator
    ],
}