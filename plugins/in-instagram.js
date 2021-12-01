let handler = async (m, { conn, command, args, usedPrefix }) => {
    let chat = db.data.chats[m.chat]
    if (chat.download) {
        await conn.sendButton(m.chat, 'turn off auto download to use this command', wm, 'matikan', '.0 download', m)
        throw 0
    }
    if (!args[0]) throw `uhm.. where the url?\n\nexample:\n${usedPrefix + command} https://www.instagram.com/p/COaLQGnJFUn/`
    if (!/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv|stories)/i.test(args[0])) throw `wrong url! can only download from post, reels, tv and story`
    if (/https?:\/\/(www\.)?instagram\.com\/(stories)/i.test(args[0])) {
        let json = await amel.stories(args[0]).then(async res => {
            let json = JSON.parse(JSON.stringify(res))
            console.log(json)
            return json
        })
        if (!json.status) throw eror
        await m.reply('downloading story from instagram')
        for (let { url, type } of json.data) {
            await conn.sendFile(m.chat, url, 'igs' + (type == 'jpg' ? '.jpg' : '.mp4'), '', m)
        }
    }
    if (/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)/i.test(args[0])) {
        let json = await amel.ig(args[0]).then(async res => {
            let json = JSON.parse(JSON.stringify(res))
            console.log(json)
            return json
        })
        await m.reply('downloading media from instagram')
        for (let { downloadUrl, type } of json) {
            await conn.sendFile(m.chat, downloadUrl, 'ig' + (type == 'image' ? '.jpg' : '.mp4'), '', m)
        }
    }
}
handler.help = ['instagram'].map(v => v + ' <url>')
handler.tags = ['internet']
handler.command = /^(instagram|ig)$/i

handler.limit = 1

module.exports = handler