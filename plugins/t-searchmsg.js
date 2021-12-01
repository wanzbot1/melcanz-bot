let handler = async (m, { conn, text }) => {
    if (!text) throw 'enter the message you want to search for!'
    let split = text.split`|`
    let result = await conn.searchMessages(split[0], m.chat, split[1], 1)
    if (result.messages.length > 0) {
        let total = result.messages.length
        let sp = total < Number(split[1]) ? `only ${total} message found` : `found ${total} messages`
        m.reply(sp)

        result.messages.map(async ({ key }) => {
            let { remoteJid: _remoteJid, id: _ids } = key
            let _message = await conn.loadMessage(_remoteJid, _ids)
            conn.reply(m.chat, '.', _message)
        })
    }
}

handler.help = ['searchmsg <message>|<amount>']
handler.tags = ['tools']
handler.command = /^searchmsg/i

module.exports = handler
