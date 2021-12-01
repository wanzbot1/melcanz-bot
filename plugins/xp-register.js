let Reg = /([0-9]*)([.|] *?)\|?(.*)$/i
let handler = async function (m, { conn, text, usedPrefix }) {
  let user = global.db.data.users[m.sender]
  if (user.registered === true) {
    await conn.sendButton(m.chat, `you are already registered! want to re-register? click the button below`, wm, 'Unreg', '.unreg', m)
    throw 0
  }
  if (!Reg.test(text)) return await conn.sendButton(m.chat, `format:\n${usedPrefix}reg NIM.Name\nexample:\n${usedPrefix}reg 12191960.Arif Febrianto\n\nif you don't have a NIM use Auto Register`, wm, 'Auto Register', `${usedPrefix}autoreg`, m)
  let [_, nim, splitter, name] = text.match(Reg)
  if (!nim) throw 'NIM cannot be empty (Number)'
  if (nim.length < 8) throw 'Minimum Nomor Induk Mahasiswa (NIM) is 8 numbers (Spaces count)'
  if (!name) throw 'Name cannot be empty (Alphanumeric)'
  if (name.length > 20) throw 'Maximum name is 20 characters (Spaces count)'
  nim = parseInt(nim)
  user.name = name.trim()
  user.nim = nim
  user.regTime = + new Date
  user.registered = true
  m.reply(`
┌─「 Info 」
├ NIM: ${nim}
├ Name: ${name}
└────
`.trim())
}
handler.help = ['reg', 'register'].map(v => v + ' <nim>.<name>')
handler.tags = ['xp']
handler.command = /^(daftar|reg(ister)?)$/i

module.exports = handler