/**
 * O Comando "kick" expulsará o usuário do servidor.
 */

const Discord = require('discord.js');

module.exports = {
  run: async (client, message, args) => {
    if (!message.member.hasPermission(['MANAGE_MESSAGES', 'ADMINISTRATOR'])) { return message.channel.send('> **Você não tem permissão para usar esse comando!**').then(m => m.delete({ timeout: 2000 })); }
    
    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const reason = args.slice(1).join(' ');

    const embed = new Discord.MessageEmbed()
      .setColor(process.env.COLOR)
      .setAuthor('Expulsar ✈️')
      .setThumbnail(`${member.user.avatarURL({ dynamic: true })}?size=1024`)
      .setDescription(`Expulsar o usuário por: **\n${reason}.\n**Clique na reação ✅ para confirmar. Se não, clique em ❌ para cancelar.`)
      .setFooter('2021 © Liga dos Programadores', 'https://i.imgur.com/Mu4KEVh.png?width=200,height=200')
      .setTimestamp();

    if (!user) {
      return message.channel.send(new Discord.MessageEmbed()
      .setColor(process.env.COLOR)
      .setDescription(`*O uso correto do comando é: \`\`!kick @membro\`\`.*`));
    }

    if (!reason) {
			return message.channel.send(new Discord.MessageEmbed()
      .setColor(process.env.COLOR)
      .setDescription(`*Coloque o motivo. 📃*`));
		}

    const filter = (reaction, userFilter) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && userFilter.id === message.author.id;
		};

    message.channel.send(embed).then(async msg => {
			await msg.react('✅');
			await msg.react('❌');

      msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();

        if (reaction.emoji.name === '✅') {
          message.guild.members.ban(user)
            .then(() => message.reply('usuário expulso do servidor! ✈️'))
            .catch(() => message.channel.send('Não foi possível expulsar o usuário. '));
        }
        else {
          msg.delete();
        }
      })
      .catch(() => {
        message.reply('mensagem sem reação!');
      });
    });
  },
  conf: {},

  get help() {
    return {
      name: 'kick',
			category: 'Moderação',
      description: 'Expulsará determinado usuário do servidor.',
			usage: '!kick @usuário',
      admin: true
    }
  }
}