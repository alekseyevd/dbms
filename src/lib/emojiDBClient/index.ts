import { Socket } from "net"
import stream from "stream"

export default class EmojiDBClient {
  private port: number
  private host: string
  private user: string
  private password: string

  constructor(params: any) {
    this.port = params.port
    this.host = params.host
    this.user = params.user
    this.password = params.password
  }

  async findById(id: number): Promise<string> {
    return this.query(`🍆${id}`)
  }

  async insert(value: string): Promise<string> {
    return this.query(`💉${value}`)
  }

  async findRange(from: number, to: number): Promise<string> {
    return this.query(`📖${from}-${to}`)
  }

  async query(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const socket = new Socket()
      const buffers: Array<Buffer> = []
      socket.connect({
        port: this.port,
        host: this.host,
      })
      socket.on('connect', () => {
        socket.write(`${this.user}🚀${this.password}`)
      })
      socket.on('data', (data) => {
        if (data.toString() === '✅') {
          socket.write(query)
          socket.end()
        } else {
          buffers.push(data)
        }
      })
      socket.on('end', () => {
        resolve(Buffer.concat(buffers).toString())
      })
      socket.on('timeout', () => {
        reject('timeout error')
      })
    })
  }

  async bulkInsert(stream: stream.Readable) {
    return new Promise((resolve, reject) => {
      const socket = new Socket()
      const buffers: Array<Buffer> = []
      socket.connect({
        port: this.port,
        host: this.host,
      })
      socket.on('connect', () => {
        socket.write(`${this.user}🚀${this.password}`)
      })
      socket.on('data', async (data) => {
        if (data.toString() === '✅') {
          socket.write('🌀')
          for await (const chunk of stream) socket.write(chunk)
          socket.end()
        } else {
          buffers.push(data)
        }
      })
      socket.on('end', () => {
        resolve(Buffer.concat(buffers).toString())
      })
      socket.on('timeout', () => {
        reject('timeout error')
      })
    })
  }
}