import { IContext } from '../lib/http/interfaces'
import { Schema } from '../lib/validate'
import Route from '../lib/Route'
import app from '../app'

export default new Route({
  path: '/find/{id}',
  method: 'get',
  handler: async (ctx: IContext) => {
    const id = +ctx.params.id
    return await app.db.findById(id)
  },
  validate: {
    params: Schema({
      type: 'object',
      properties: {
        id: {
          type: 'string'
        }
      },
      required: ['id']
    })
  }
})