let fs = require('fs')
let path = require('path')
let moment = require('moment-timezone')
const defaultMenu = {
  before: `
%readmore`.trimStart(),
  header: '┌「 %category 」',
  body: '├ %cmd %islimit %isPremium',
  footer: '└────\n',
  after: `
`,
}
let handler = async (m, { conn, usedPrefix: _p, text, isOwner, command }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, registered, name } = global.db.data.users[m.sender]
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let tags
    let teks = `${text}`.toLowerCase()
    /**
     * arrayMenu
     * @param {Array} 
     * kalo ga ada didaftar ini ga bisa dipanggil, jadi harus diisi
     */
    let arrayMenu = ['list', 'all', 'absen', 'audio', 'database', 'fun', 'grup', 'games', 'info', 'internet', 'jadibot', 'stiker', 'tools', 'tanpa kategori', 'xp', 'owner']
    if (!arrayMenu.includes(teks)) teks = 'list' // kalo teks da ada di arrayMenu maka bakal nampilin list
    // buat 1 per 1 sesuai yang ada di arrayMenu
    if (teks == 'all') tags = {
      'main': 'Main',
      'absen': 'Absen',
      'audio': 'Pengubah Suara',
      'database': 'Database',
      'fun': 'Fun',
      'game': `Games`,
      'group': 'Grup',
      'info': 'Info',
      'internet': 'Internet',
      'jadibot': 'Jadi Bot',
      'sticker': 'Stiker',
      'tools': 'Tools',
      'vote': 'Voting',
      'xp': 'Exp & Limit',
      '': 'Tanpa Kategori',
    }
    if (teks == 'absen') tags = {
      'absen': 'Absen',
      'vote': 'Voting',
    }
    if (teks == 'audio') tags = {
      'audio': 'Pengubah Suara'
    }
    if (teks == 'grup') tags = {
      'group': 'Grup'
    }
    if (teks == 'database') tags = {
      'database': 'Database'
    }
    if (teks == 'fun') tags = {
      'fun': 'Fun',
    }
    if (teks == 'games') {
      if (!db.data.settings[conn.user.jid].game) {
        await conn.sendButton(m.chat, 'game blm diaktifkan oleh owner!', wm, 'nyalakan', '.1 game', m)
        throw 0
      }
      tags = {
        'game': 'Games'
      }
    }
    if (teks == 'info') tags = {
      'info': 'Info'
    }
    if (teks == 'internet') tags = {
      'internet': 'Internet'
    }
    if (teks == 'jadibot') {
      if (!db.data.settings[conn.user.jid].jadibot) {
        m.reply('mau ngapain?')
        throw false
      }
      tags = {
        'jadibot': 'Jadi Bot'
      }
    }
    if (teks == 'stiker') tags = {
      'sticker': 'Stiker',
    }
    if (teks == 'tools') tags = {
      'tools': 'Tools'
    }
    if (teks == 'xp') tags = {
      'xp': 'Exp & Limit'
    }
    if (teks == 'tanpa kategori') tags = {
      '': 'Tanpa Kategori'
    }
    if (teks == 'owner') {
      if (!isOwner) {
        dfail('owner', m, conn)
        throw 0
      }
      tags = {
        'owner': 'Owner',
        'host': 'Host',
        'advanced': 'Advanced'
      }
    }
    if (teks == 'list') { // kalo teks ga sesuai arrayMenu bakal nampilin ini
      m.reply(`
┌「 Menu 」\n${arrayMenu.filter(v => !['list'].includes(v)).map(v => '├ ' + _p + command + ' ' + v).join`\n`}
└────
`.trim())
      throw 0
    }
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Presented by @${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    await conn.sendButtonLoc(m.chat, fla + encodeURIComponent(teks), text.trim(), `${ucapan()}`, 'donasi', '.donasi')
  } catch (e) {
    // conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(m|menu|help|\?)$/i

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  res = "tidur banh, i love u"
  if (time >= 4) {
    res = "selamat pagi"
  }
  if (time > 10) {
    res = "selamat sialng"
  }
  if (time >= 15) {
    res = "selamat sore"
  }
  if (time >= 18) {
    res = "selamat malam"
  }
  return res
}