let handler = async (m, { text, usedPrefix, command }) => {
    let chat = db.data.chats[m.chat]
    if (!text) throw `uhm.. where the number?\n\nexamle:\n${usedPrefix + command} 30\n\nthat mean media will be deleted after 30 s`
    let time = parseInt(text)
    if (time > 300 || time < 60) throw `min is 60 & max is 300`
    chat.deletemediaTime = time * 1000
    m.reply(`successfully set time of delete media: ${chat.deletemediaTime / 1000} s`)
}
handler.help = ['setdeletemedia <number>']
handler.tags = ['tools']
handler.command = /^setdeletemedia$/i

module.exports = handler