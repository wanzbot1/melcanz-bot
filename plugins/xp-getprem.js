let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.sender
    let user = db.data.users[who]
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (!text) throw `where the number of days?\n\nexample:\n${usedPrefix + command} 7\n\ninfo: 1 day = 25 limits`
    if (isNaN(text)) throw `only number!\n\nexample:\n${usedPrefix + command} 7\n\ninfo: 1 day = 25 limits`
    let count = text * 25
    if (user.limit < count) return await conn.send2Button(m.chat, `your limit is up, need 25 limits for 1 day`, wm, 'Buy', '.buy', 'Buy All', '.buyall', m)
    user.limit -= count
    var jumlahHari = 86400000 * text
    var now = new Date() * 1
    if (now < user.premiumTime) user.premiumTime += jumlahHari
    else user.premiumTime = now + jumlahHari
    user.premium = true
    m.reply(`successfully added *${user.name}* to be a premium user for ${txt} days.\n\ncountdown: ${conn.msToDate(user.premiumTime - now)}`)
}
handler.help = ['getprem <amount of days>']
handler.tags = ['xp']
handler.command = /^(getprem)$/i

module.exports = handler