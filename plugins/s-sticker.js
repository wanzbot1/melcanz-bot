const { sticker, sticker5 } = require('../lib/sticker')

let handler = async (m, { conn }) => {
    let stiker = false
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (/webp/.test(mime)) {
            let img = await q.download()
            if (!img) throw `reply sticker with command s`
            stiker = await sticker5(img, false, packname, author)
        } else if (/image/.test(mime)) {
            let img = await q.download()
            if (!img) throw `reply image with command s`
            stiker = await sticker5(img, false, packname, author)
        } else if (/video/.test(mime)) {
            if ((q.msg || q).seconds > 11) return m.reply('max is 10 seconds!')
            let img = await q.download()
            if (!img) throw `reply video with command s`
            stiker = await sticker(img, false, packname, author)
        } else if (m.quoted.text) {
            if (isUrl(m.quoted.text)) stiker = await sticker(false, m.quoted.text, packname, author)
            else throw 'URL is not valid! end with jpg/gif/png'
        }
    } catch (e) {
        throw e
    }
    finally {
        if (stiker) {
            let { key } = await conn.sendMessage(m.chat, stiker, 'stickerMessage', { quoted: m })
            setTimeout(() => {
                if (db.data.chats[m.chat].deletemedia) conn.deleteMessage(m.chat, key)
            }, db.data.chats[m.chat].deletemediaTime)
        }
        else {
            await conn.sendButton(m.chat, `reply media with command s`, wm, 'On Automate Sticker', '.1 s', m)
            throw 0
        }
    }
}
handler.help = ['s']
handler.tags = ['sticker']
handler.customPrefix = /^s$/i
handler.command = new RegExp

module.exports = handler

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/, 'gi'))
}