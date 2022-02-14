import EmojiDBClient from './emojiDBClient'
import HttpServer from './http'
import { IContext, IRoute } from './http/interfaces'

export default class App {
  authenticate: Map<string, (ctx: IContext) => void> 
  authorize: Map<string, (ctx: IContext) => boolean> 
  _routes: Array<IRoute>
  _port: number
  _db: EmojiDBClient

  constructor(config: any) {
    this.authenticate = new Map()
    this.authorize = new Map()
    this._routes = []
    this._port = config.PORT
    this._db = new EmojiDBClient({
      port: config.DB_POST,
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSOWRD,
    })
  }

  get db() {
    return this._db
  }

  route(route: IRoute) {
    this._routes.push(route)
  }

  routes(routes: Array<IRoute>) {
    this._routes = this._routes.concat(routes)
  }

  start() {
    new HttpServer({
      routes: this._routes,
      port: this._port,
    }).listen(() => {
      console.log(`Server listening on port ${this._port}`)
    })
  }
}
