import { IContext } from '../lib/http/interfaces'
import { Schema } from '../lib/validate'
import Route from '../lib/Route'
import app from '../app'

export default new Route({
  path: '/findRange',
  method: 'get',
  handler: async (ctx: IContext) => {
    const { from, to } = ctx.query
    return await app.db.findRange(+from, +to)
  },
  validate: {
    query: Schema({
      type: 'object',
      properties: {
        from: {
          type: 'string'
        },
        to: {
          type: 'string'
        }
      },
      required: ['from', 'to']
    })
  }
})