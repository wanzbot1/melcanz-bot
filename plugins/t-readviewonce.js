let handler = async (m, { conn }) => {
    if (!m.quoted) throw `reply to the viewOnce message!`
    if (m.quoted.mtype !== 'viewOnceMessage') throw 'that\'s not a viewOnce message'
    let { key } = await conn.copyNForward(m.chat, await conn.loadMessage(m.chat, m.quoted.id), false, { readViewOnce: true }).catch(_ => m.reply('maybe it\'s been opened by a bot'))
}
handler.help = ['readviewonce']
handler.tags = ['tools']
handler.command = /^(read)?viewonce/i

module.exports = handler