import App from './lib/App'
import * as config from './config'
import { routes } from './routes'

const app = new App(config)
app.routes(routes)

export default app