import EmojiDB from './EmojiDB'
import fs from 'fs'
import net from 'net'
import connectionHandler from './server'

(async () => {
  try {
    if (!fs.existsSync('emoji.db')) await fs.promises.mkdir('emoji.db')

    const params = fs.readFileSync('emoji.db').toString()
    const db = new EmojiDB(JSON.parse(params))
    db.on('insert', (data: string) => {
      fs.writeFile('emoji.db', data, (error) => {
        if (error) {
          console.log(error);
        }
      })
    })
    const server = net.createServer({ allowHalfOpen: true });
    server.on('connection', connectionHandler(db));
    server.listen(2000);

  } catch (error) {
    console.log(error)
    process.exit()
  }
})()