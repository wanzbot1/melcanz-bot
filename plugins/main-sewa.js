let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
    pepe = await conn.getProfilePicture('62831287340122@s.whatsapp.net').catch(() => 'https://i.ibb.co/jr9Nh6Q/Thumb.jpg')
    baper = await fetch(pepe).then(a => a.buffer())
    let listMessage = {
        "title": "STIKERIN",
        "description": `
STIKERIN PRICE
        
1 Grup / 30 Hari
Rp. 10,000 Dana, Ovo
Rp. 15,000 Pulsa Axis

1 Premium / sampai pensi
Rp. 10,000 Dana, Ovo
Rp. 15,000 Pulsa Axis
`.trim(),
        "listType": "PRODUCT_LIST",
        "productListInfo": {
            "productSections": [
                {
                    "title": "Klik untuk melihat harga",
                    "products": [
                        {
                            "productId": "4696956640315324"
                        }
                    ]
                }
            ],
            "headerImage": {
                "productId": "4696956640315324",
                "jpegThumbnail": baper
            },
            "businessOwnerJid": "6283128734012@s.whatsapp.net"
        },
        "footerText": "hubungi wa.me/6283128734012"
    }


    conn.sendMessage(m.chat, listMessage, 'listMessage', { quoted: m })
}
handler.help = ['sewabot']
handler.tags = ['main']
handler.command = /^sewa(bot|stikerin)$/i

module.exports = handler