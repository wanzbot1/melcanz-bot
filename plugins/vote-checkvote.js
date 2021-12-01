let handler = async (m, { conn }) => {
    let id = m.chat
    conn.vote = conn.vote ? conn.vote : {}
    if (!(id in conn.vote)) {
        await conn.sendButton(m.chat, `no voting in progress!`, wm, 'Start', '.mulaivote', m)
        throw 0
    }

    let [reason, upvote, devote] = conn.vote[id]
    await conn.sendButton(m.chat, `
*Reason:* ${reason}
*Upvote*
_Total: ${upvote.length}_
${upvote.map(v => `${db.data.users[v].nim} ${db.data.users[v].name}`).join('\n')}

*Devote*
_Total: ${devote.length}_
${devote.map(v => `${db.data.users[v].nim} ${db.data.users[v].name}`).join('\n')}
`.trim(), wm, 'Delete', '.hapusvote', m)
}
handler.help = ['checkvote']
handler.tags = ['vote']
handler.command = /^(cek|check)vote$/i

module.exports = handler