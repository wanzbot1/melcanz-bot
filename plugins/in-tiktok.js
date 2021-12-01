let handler = async (m, { conn, command, text, usedPrefix, isPrems }) => {
    let chat = db.data.chats[m.chat]
    if (chat.download) {
        await conn.sendButton(m.chat, 'turn off auto download to use this command', wm, 'Off', '.0 download', m)
        throw 0
    }
    if (!text) throw `uhm.. where the url?\n\nusage:\n${usedPrefix + command} ${isPrems ? 'url, url, ...' : 'url'}\nexample:\n${usedPrefix + command} https://vt.tiktok.com/ZGJBtcsDq/`
    if (isPrems) {
        let array = text.split(',')
        await m.reply(`downloading ${array.length > 1 ? array.length + ' videos' : 'video'} from tiktok`)
        for (let url of array) {
            let json = await amel.tikmate(url.trim()).then(res => {
                let json = JSON.parse(JSON.stringify(res))
                console.log(json)
                return json
            })
            await conn.sendFile(m.chat, await conn.getBuffer(json.data.videoHD), 'tiktok.mp4', '', m)
        }
        return !0
    }
    if (!/https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com/i.test(text)) throw `wrong url!`
    let json = await amel.tikmate(text).then(res => {
        let json = JSON.parse(JSON.stringify(res))
        console.log(json)
        return json
    })
    if (!json.status) throw eror
    await m.reply('downloading video from tiktok')
    await conn.sendFile(m.chat, await conn.getBuffer(json.data.videoHD), 'tiktok.mp4', '', m)
}
handler.help = ['tiktok'].map(v => v + ' <url>')
handler.tags = ['internet']
handler.command = /^(tiktok|tt)$/i

handler.limit = 1

module.exports = handler