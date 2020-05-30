const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const DiscordService = require('./services/service');


const path = require('path');

const { client } = require('./index');
const dService = new DiscordService();

function isOnBanda( jugador, banda ) {
    for ( let i = 0; i < banda.length; i++ ) {
        if ( banda[i].jugador === jugador ) {
            return true;
        }
    }

    return false;
}

client.on('message', msg => {

    if ( msg.content.includes('bot') && (
        msg.content.includes('mierda') || msg.content.includes('mrd') || 
        msg.content.includes('pto') || msg.content.includes('puto') ||
        msg.content.includes('pelotudo') || msg.content.includes('bld') ||
        msg.content.includes('mierda') || msg.content.includes('boludo') ||
        msg.content.includes('tonto') || msg.content.includes('asco') || 
        msg.content.includes('rapido') || msg.content.includes('fast')
    )) {
        msg.reply('la tuya por si acaso.');
    }

    if ( !msg.content.startsWith('/') ) return;

    const args = msg.content.substring(1).split(' ');

    if ( args[0] === 'tatuaje') {
        const embed = new MessageEmbed()
            .setTitle(
                't/y se sube la manga y muestra su tatuaje.$(Enter)\n' +
                't/p [-Tatto-]:[Los Santos Guerreros I ]:[L.S.G]:||-<[RANGO]><[El Win Team]><[Roca Escalante]>$(Enter)\n' +
                't/y se baja la manga rapidamente.$(Enter)'
            )
            .setColor('RED')
            .setAuthor('Descarga https://www.hot-keyboard.com/download/ y crea el tatuaje')

        msg.channel.send(embed);
    }

    if ( args[0] === 'ayuda' ) {
        const embed = new MessageEmbed()
            .addField('/tatuaje', 'Muestra el tatuaje que tenemos actualmente')
            .addField('/cambiar apodo', 'Cambia tu apodo a otro, ej: /cambiar apodo Elsa Pito')
            .addField('!play', 'Para reproducir una canción, ej, !play cumba del coronavirus')
            .addField('!skip', 'Para saltar la canción actual')
            .addField('!queue', 'Para ver la lista de canciones pendientes')
            .addField('!np', 'Muestra la canción que esta sonando actualmente')
            .addField('!pause', 'Pausa la canción que esta sonando actualmente')
            .addField('!skipto <numero>', 'Salta a una cancion especifica en la cola. ej, !skipto 3')
            .addField('/banda ayuda', 'Ver información de la banda')
            .setTitle('Lista de comandos: ')
        msg.channel.send(embed);
    }

    if ( args[0] === 'cambiar' && args[1] === 'apodo' ) {
        if ( !args[2] ) {
            msg.reply('debes poner el nuevo apodo, ej: /cambiar apodo Elsa Pito');
        } else {
            const nickName = args.join(' ').replace('cambiar', '').replace('apodo', '');
            msg.member.setNickname(nickName);
            msg.reply('has cambiado tu apodo.')
        }
    }

    if ( args[0] === 'banda' ) {
        const roles = msg.member.roles.member._roles;
        
            if ( !args[1] ) {
                msg.reply('no has introducido alguna acción, usa /banda ayuda para más información.');
            } else {
                if ( args[1] === 'agregar' ) {
                    if ( roles.includes('710889053926457375') || roles.includes('710889415936966729') || roles.includes('710930414201602058') ) {
                        if ( !args[2] ) {
                            msg.reply('debes introducir el nombre del jugador.');
                        } else {
                            if ( !args[2].includes('_') ) {
                                msg.reply('el nombre del jugador debe incluir un guión bajo. Ej, Harvey_Guerrero');
                            } else {
                                const jugador = args[2].toLocaleLowerCase();
                                let banda;

                                const pathBanda = path.resolve(__dirname, `./banda.json`);

                                if ( fs.existsSync(pathBanda) ) {
                                    banda = JSON.parse(fs.readFileSync(pathBanda));
                                } else {
                                    banda = [];
                                }
            
                                if ( isOnBanda(jugador, banda) ) {
                                    msg.reply('ese jugador ya está en la lista');
                                } else {
                                    banda.push({
                                        jugador,
                                        estado: false
                                    });
                                    fs.writeFileSync(pathBanda, JSON.stringify(banda));
                                    msg.channel.send(`Se ha agreado ${args[2]} a la lista.`);                     
                                }
                            }
                        }
                    } else {
                        msg.reply('no tienes permisos para realizar esta acción.')
                    }
                    
                } else if ( args[1] === 'ayuda' ) {
                    const embed = new MessageEmbed()
                        .addField('/banda agregar <nombre>', 'Agrega un integrante a la lista.')
                        .addField('/banda eliminar <numero>', 'Elimina un integrante de la lista.')
                        .addField('/banda mostrar', 'Muestra la lista completa.')
                        .addField('/banda conectados', 'Muestra el estado de los integrantes (Conectado/Desconectado)')
                        .setTitle('Lista de comandos para /banda: ')
                        .setDescription('Lista de integrandes, el BOT se encargará de notificar cuando uno entre o salga del juego.')
                    msg.channel.send(embed);
                } else if ( args[1] === 'mostrar' ) {

                    const pathBanda = path.resolve(__dirname, `./banda.json`);

                    let banda;
                    if ( fs.existsSync(pathBanda) ) {
                        banda = JSON.parse(fs.readFileSync(pathBanda));
                    } else {
                        banda = [];
                    }

                    const embed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Lista de integrantes')
                            .setDescription(banda.map((user, index) => `${ index+1 }. ${ user.jugador }`).join('\n'))
                    msg.channel.send(embed);


                } else if ( args[1] === 'eliminar' ) {
                    if ( roles.includes('710889053926457375') || roles.includes('710889415936966729') || roles.includes('710930414201602058') ) {
                        if ( !args[2] ) {
                            msg.reply('debes introducir el numero. Ej, /banda eliminar 0 \nUsa /banda mostrar para ver la lista de los integrantes.');
                        } else if ( isNaN(args[2]) ) {
                            msg.reply('después de eliminar debe ir un numero. Ej, /banda eliminar 0');
                        } else {

                            const pathBanda = path.resolve(__dirname, `./banda.json`);

                            let banda;
                            if ( fs.existsSync(pathBanda) ) {
                                banda = JSON.parse(fs.readFileSync(pathBanda));
                            } else {
                                banda = [];
                            }
                            if ( banda.length < args[2] ) {
                                msg.reply('no existe ese integrante. Usa /banda mostrar');
                            } else {
                                const nombre = banda[args[2]-1].jugador;
                                banda.splice(args[2]-1, 1);
                                fs.writeFileSync(pathBanda, JSON.stringify(banda));
                                msg.channel.send(`Se ha eliminado a ${nombre}`);
                            }
                        }
                    } else {
                        msg.reply('no tienes permisos para realizar esta acción.')
                    }
                } else if ( args[1] === 'conectados' ) {

                    msg.reply('estoy consultado quien está conectado, esto puede tardar hasta 1 minuto.');

                    dService.checkUsers()
                        .then( data => {
                            let embed;
                            if ( data === null ) {
                                embed = new MessageEmbed()
                                        .setColor('RED')
                                        .setTitle('Error')
                                        .setDescription('Lo siento, tuve un error interno.');
                            } else {
                                if ( data.length === 0 ) {
                                    embed = new MessageEmbed()
                                            .setColor('#0099ff')
                                            .setTitle('Jugadores Conectados')
                                            .setDescription('No hay nadie conectado.');
                                } else {
                                    embed = new MessageEmbed()
                                            .setColor('#0099ff')
                                            .setTitle('Jugadores Conectados')
                                            .setDescription(data.map(user => user.jugador).join('\n'));
                                }
                            }
                            msg.channel.send(embed);
                        });
                } else {
                    msg.reply('comando inválido, usa /banda ayuda para más información.')
                }
            }
    }
});



client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    channel.send(`Bienvenido, ${member}. Escribe /ayuda para ver los comandos disponibles.`);
    channel.send('Espera a que alguien compruebe que eres de la banda y puedas entrar a los demás canales.')
});
