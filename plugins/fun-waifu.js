let handler = async (m, { conn }) => {
let fetch = require('node-fetch')
let res = await fetch(API('amel', '/waifu', {}, 'apikey'))
let json = await res.json()

conn.sendButtonImg(m.chat, json.result, 'Nieh banh waifunya',wm , 'waifu again','.waifu')
}
handler.help = ['waifu']
handler.tags = ['fun']
handler.command = /^(waifu)$/i

module.export = handler
