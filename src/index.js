require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

const data = process.env

eventHandler(client);

client.login(data.Token)