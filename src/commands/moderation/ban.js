const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits} = require("discord.js")

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get("target-user").value;
        const reason = interaction.options.get("reason")?.value || "No Reason provided"

        await interaction.deferReply()

        const targetUser = await interaction.guild.members.fetch(targetUserId)

        if (!targetUser) {
            await interaction.editReply("That user doesen't exist in this server.")
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't ban that user because they're the server owner.")
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position
        const requestUserRolePosition = interaction.member.roles.highest.position
        const botRolePosition = interaction.guild.members.me.roles.highest.position

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't ban that user because they have the same/higher role than you.")
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("You can't ban that user because they have the same/higher role than me.")
            return;
        }

        try {
            await targetUser.ban({ reason});
            await interaction.editReply(`User ${targetUser} was banned\nReason: ${reason}`)
            await targetUser.send(`You were Banned from ${interaction.guild.name}\nReason: ${reason}`).catch(err => {
                console.log("Target has their dms off!")
            })
        } catch (error) {
            console.log(`There was an error when banning: ${error}`)
        }
    },

    name: "ban",
    description: "Bans a member from the server",

    options: [
        {
            name: "target-user",
            description: "The user to ban",
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: "reason",
            description: "The reason for banning",
            type: ApplicationCommandOptionType.String
        },
    ],
    permissionsRequired: [
        PermissionFlagsBits.BanMembers,
    ],
    botPermissions: [
        PermissionFlagsBits.BanMembers
    ],
}