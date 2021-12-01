let handler = async function (m) {
  let user = db.data.users[m.sender]
  user.registered = false
  await this.sendButton(m.chat, `successfully unregistered!`, wm, 'Auto Register', '.autoreg', m)
}
handler.help = ['', 'ister'].map(v => 'unreg' + v)
handler.tags = ['xp']
handler.command = /^unreg(ister)?$/i

handler.register = true

module.exports = handler