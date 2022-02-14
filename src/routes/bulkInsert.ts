import { IContext } from '../lib/http/interfaces'
import { Schema } from '../lib/validate'
import Route from '../lib/Route'
import app from '../app'

export default new Route({
  path: '/bulkInsert',
  method: 'post',
  handler: async (ctx: IContext) => {
    return await app.db.bulkInsert(ctx.req)
  },
  validate: {
    headers: Schema({
      type: 'object',
      properties: {
        from: {
          type: 'string'
        },
      },
      required: ['filename']
    })
  }
})