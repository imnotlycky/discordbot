const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits} = require("discord.js")
const { ms } = require("ms")

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get("target-user").value;
        const duration = interaction.options.get("duration").value
        const reason = interaction.options.get("reason")?.value || "No Reason provided"

        await interaction.deferReply()

        const targetUser = await interaction.guild.members.fetch(targetUserId)

        if (!targetUser) {
            await interaction.editReply("That user doesen't exist in this server.")
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't timeout that user because they're the server owner.")
            return;
        }

        if (targetUser.user.bot) {
            await interaction.editReply("I can't timeout a bot.")
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position
        const requestUserRolePosition = interaction.member.roles.highest.position
        const botRolePosition = interaction.guild.members.me.roles.highest.position

        const msDuration = ms(duration)
        if (isNaN(msDuration)) {
            await interaction.editReply("Please provide a valid timeout duration.")
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply("Time out duration cannot be less than 5 seconds or more than 28 days.")
            return;
        }

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't timeout that user because they have the same/higher role than you.")
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("You can't timeout that user because they have the same/higher role than me.")
            return;
        }

        try {
            const { default: prettyMs } = await import("pretty-ms")

            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason)
                await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true})}\n
                Reason: ${reason}`)
                await targetUser.send(`Your time out was updated on ${interaction.guild.name}\nTo ${prettyMs(msDuration, { verbose: true})}\n
                Reason: ${reason}`).catch(err => {
                    console.log("Target has their dms off!")
                })
                return;
            }

            await targetUser.timeout(msDuration, reason)
            await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true})}\n
            Reason: ${reason}`)
            await targetUser.send(`Your were timedout on ${interaction.guild.name}\n for ${prettyMs(msDuration, { verbose: true})}\n 
            Reason: ${reason}`).catch(err => {
                console.log("Target has their dms off!")
            })
        } catch (error) {
            console.log(`There was an error when kicking: ${error}`)
        }
    },

    name: "timeout",
    description: "Timeout a user.",
    options: [
        {
            name: "target-user",
            description: "The user you want to timeout.",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "duration",
            description: "Timeout duration (30m, 1h, 1d)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "timeout",
            description: "The reason for the timeout",
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [
        PermissionFlagsBits.MuteMembers,
    ],
    botPermissions: [
        PermissionFlagsBits.MuteMembers
    ],
}