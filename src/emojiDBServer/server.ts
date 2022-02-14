import { Socket } from 'net'
import EmojiDB from './EmojiDB';

const connectionHandler = (db: EmojiDB) => (socket: Socket) => {
  socket.setTimeout(3000);

  let state = 'AUTH'
  let query: Array<string> = []
  let credentials_input: string = ''

  socket.on('data', (buffer) => {
    const data = buffer.toString()
    if (state === 'AUTH') {
      credentials_input += data

      if (!data.includes('💩')) return

      const [ user, password ] = credentials_input.split('🚀')
      if (user !== process.env.USER || password !== process.env.PASSWORD) {
        socket.write('🌵invalid credentials')
        socket.end()
      } else {
        socket.write('✅')
        state = 'AUTHORIZED'
      }
      return
    }

    if (state === 'AUTHORIZED') {
      if (data.startsWith('🌀')) {
        state = 'BULK_QUERY'
      } else {
        state = 'QUERY'
      }
    }

    if (state === 'BULK_QUERY') {
      db.bulkInsert(data)
    }

    if (state === 'QUERY') {
      query.push(data)
    }
  })

  socket.on('end', () => {
    try {
      const result = (state === 'BULK_QUERY')
        ? db.endBulk()
        : db.query(query.join())
      socket.write(result)
      socket.end()
    } catch (error) {
      socket.write(error.message)
      socket.end()
    }
  })

  socket.on('drain', () => {
    console.log('Event: 🤷');
  });

  socket.on('error', (err) => {
    console.log(err);
  });

  socket.on('timeout', () => {
    console.log('Event: ⌛')
    socket.end();
  });

};

export default connectionHandler