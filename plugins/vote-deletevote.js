let handler = async (m, { conn, isAdmin, isOwner }) => {
    if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
            global.dfail('admin', m, conn)
            throw false
        }
    }
    let id = m.chat
    conn.vote = conn.vote ? conn.vote : {}
    if (!(id in conn.vote)) {
        await conn.sendButton(m.chat, `no voting in progress!`, wm, 'Start', '.mulaivote', m)
        throw 0
    }
    delete conn.vote[id]
    m.reply(`successfully removed!`)

}
handler.help = ['delvote']
handler.tags = ['vote']
handler.command = /^(-|del(ete)?|hapus)vote$/i

module.exports = handler