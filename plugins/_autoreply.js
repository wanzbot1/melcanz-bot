let handler = m => m

handler.all = async function (m) {
    if (m.chat.endsWith('broadcast')) return
    let { isBanned } = db.data.chats[m.chat]
    let { banned } = db.data.users[m.sender]
    let { group } = db.data.settings[this.user.jid]

    if (/(ass?alam|اَلسَّلاَمُ عَلَيْكُمْ|السلام عليکم)/i.test(m.text) && !m.fromMe) {
        m.reply(`wa\'alaikumussalam wr.wb.`)
    }

    if (/^bot$/i.test(m.text)) {
        await this.sendButton(m.chat, m.isGroups && !m.isPrems && group ? 'group only' : isBanned ? 'chat banned' : banned ? 'user banned' : 'active', wm, m.isGroups && !m.isPrems && group ? 'Donate' : isBanned ? 'Unban' : banned ? 'ask to owner to unban' : 'Donate', m.isGroups && !m.isPrems && group ? '.donatebot' : isBanned ? '.unban' : banned ? '.owner' : '.donatebot', m)
    }

    return !0
}

module.exports = handler