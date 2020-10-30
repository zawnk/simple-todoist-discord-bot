import * as Discord from 'discord.js'
import { ConfigService } from './config/config.service'
import * as fs from 'fs'
import { Command } from './commands/command.interface'
import { PermissionLevel } from './commands/command.constants'
import { inspect } from 'util'

export const client = new Discord.Client()
const config = new ConfigService()

export const commands = new Discord.Collection<string, Command>()

const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.ts') && !file.includes('command.'))

for (const file of commandFiles) {
  /* tslint:disable-next-line:no-var-requires */
  const command: Command = require(`./commands/${file}`)
  commands.set(command.name, command)
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('error', (err) =>
  console.log(`Client Error: ${inspect(err, true, 2, true)}`)
)

const prefix = config.get('COMMAND_PREFIX')
client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const commandName = args.shift().toLocaleLowerCase()

  const command =
    commands.get(commandName) ||
    commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) return

  if (command.permission) {
    if (message.channel.type === 'dm') {
      return message.reply(
        'This command can only be used in channels, not via DM.'
      )
    }
    if (
      (command.permission === PermissionLevel.mod &&
        !message.member.roles.cache.some((role) => role.name === 'BotMod')) ||
      (command.permission === PermissionLevel.owner &&
        message.guild.ownerID !== message.member.id)
    ) {
      return message.channel.send(
        "You don't have the permissions to execute this command."
      )
    }
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
    }

    return message.channel.send(reply)
  }

  try {
    await command.execute(message, args)
  } catch (err) {
    console.error(err)
    message.reply('there was an error trying to execute that command!')
  }
})

async function bootstrap() {
  await client.login(config.get('DISCORD_BOT_TOKEN'))
}

bootstrap()
