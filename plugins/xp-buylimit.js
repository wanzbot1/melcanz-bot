let handler = async (m, { conn, command, args, usedPrefix, isPrems }) => {
  const xpperlimit = isPrems ? 100 : 350
  let count = command.replace(/^buy/i, '')
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xpperlimit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (isNaN(count)) return await conn.send2Button(m.chat, `only number!\n\nexample:\n${usedPrefix + command} 3`, wm, 'Buy', '.buy', 'Buy All', '.buyall', m)
  if (global.db.data.users[m.sender].exp >= xpperlimit * count) {
    global.db.data.users[m.sender].exp -= xpperlimit * count
    global.db.data.users[m.sender].limit += count
    conn.reply(m.chat, `-${xpperlimit * count} XP\n+ ${count} Limit`, m)
  } else conn.reply(m.chat, `XP is not enough to buy ${count} limit`, m)
}
handler.help = ['buy<amount of limit>', 'buy <amount of limit>', 'buyall']
handler.tags = ['xp']
handler.command = /^(buy([0-9]+)|buy|buyall)$/i

module.exports = handler

