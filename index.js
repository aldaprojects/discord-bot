const express = require('express');
const app = express();
const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // client.channels.cache.get('710897445726322708').send('@everyone ya llegue prros')
});

 
module.exports.client = client;

require('./server');

client.login(process.env.TOKEN);

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${ process.env.PORT }`);
});