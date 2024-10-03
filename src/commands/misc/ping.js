module.exports = {
    name: "ping",
    description: "pong!",
    devOnly: true,
    // testOnly: Boolean,
    // options: Object[]
    // deleted: Boolean

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`)
    },
}