let handler = async (m, { conn, text, isAdmin, isOwner }) => {
    if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
            global.dfail('admin', m, conn)
            throw 0
        }
    }
    conn.vote = conn.vote ? conn.vote : {}
    let id = m.chat
    if (id in conn.vote) {
        await conn.sendButton(m.chat, `there's still voting going on!`, wm, 'Delete', '.-vote', m)
        throw 0
    }
    await conn.send2Button(m.chat, `started!`, wm, 'Upvote', '.upvote', 'Devote', '.devote', m)
    conn.vote[id] = [
        text,
        [],
        []
    ]
}
handler.help = ['startvote [text]']
handler.tags = ['vote']
handler.command = /^(\+|start|mulai)vote$/i

module.exports = handler