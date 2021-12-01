let PhoneNumber = require('awesome-phonenumber')

let handler = async (m, { conn, text }) => {
  let pp = './src/avatar_contact.png'
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
  if (typeof db.data.users[who] == 'undefined') {
    db.data.users[who] = {
      exp: 0,
      limit: 10,
      registered: false,
      name: conn.getName(m.sender),
      nim: -1,
      regTime: -1,
      banned: false,
      premium: false,
      premiumTime: 0,
    }
  }
  try {
    pp = await conn.getProfilePicture(who)
  } catch (e) {

  } finally {
    let about = (await conn.getStatus(who).catch(console.error) || {}).status || ''
    let { name, limit, exp, registered, regTime, nim, banned, premium, premiumTime } = global.db.data.users[who]
    let username = conn.getName(who)
    let str = `
Name: ${username} ${registered ? '(' + name + ') ' : ''}(@${who.replace(/@.+/, '')})${about != 401 ? '\nInfo: ' + about : ''}
Number: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
Link: https://wa.me/${who.split`@`[0]}${registered ? '\nNIM: ' + nim : ''}
XP: ${exp}
Limit: ${limit}
Registered: ${registered ? 'Yes' : 'No'}
Premium: ${premium ? `Yes\nPremium Expired: ${conn.msToDate(premiumTime - new Date() * 1)}` : 'No'}
Banned: ${banned ? 'Yes' : 'No'}
`.trim()
    let mentionedJid = [who]
    let { key } = await conn.sendFile(m.chat, pp, 'pp.jpg', str, m, false, { contextInfo: { mentionedJid } })
    setTimeout(() => {
      if (db.data.chats[m.chat].deletemedia) conn.deleteMessage(m.chat, key)
    }, db.data.chats[m.chat].deletemediaTime)
  }
}
handler.help = ['profile [@user]']
handler.tags = ['tools']
handler.command = /^profile?$/i

module.exports = handler