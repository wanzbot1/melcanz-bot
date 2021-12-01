let handler = async (m, { conn, command }) => {
    let id = m.chat
    conn.vote = conn.vote ? conn.vote : {}
    if (!(id in conn.vote)) {
        await conn.sendButton(m.chat, `no voting in progress!`, wm, 'Start', '.+vote', m)
        throw 0
    }
    let isVote = conn.vote[id][1].concat(conn.vote[id][2])
    const wasVote = isVote.includes(m.sender)
    if (wasVote) throw 'you have voted!'
    if (/up/i.test(command)) {
        conn.vote[id][1].push(m.sender)
    } else if (/de/i.test(command)) {
        conn.vote[id][2].push(m.sender)
    }
    let [reason, upvote, devote] = conn.vote[id]
    await conn.send2Button(m.chat, `
*Reason:* ${reason}
*Upvote*
_Total: ${upvote.length}_
${upvote.map(u => `${db.data.users[u].nim} ${db.data.users[u].name}`).join('\n')}

*Devote*
_Total: ${devote.length}_
${devote.map(u => `${db.data.users[u].nim} ${db.data.users[u].name}`).join('\n')}
    `.trim(), wm, 'Upvote', '.upvote', 'Devote', '.devote', m)
}
handler.help = ['upvote', 'devote']
handler.tags = ['vote']
handler.command = /^(up|de)vote$/i

handler.register = true

module.exports = handler
