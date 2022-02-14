import { IContext } from '../lib/http/interfaces'
import { Schema } from '../lib/validate'
import Route from '../lib/Route'
import app from '../app'

export default new Route({
  path: '/insert',
  method: 'post',
  handler: async (ctx: IContext) => {
    const data = ctx.body
    return await app.db.insert(data)
  },
  validate: {
    body: Schema({
      type: 'object',
      properties: {
        data: {
          type: 'string'
        }
      },
      required: ['data']
    })
  }
})