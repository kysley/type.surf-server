import * as http from 'http'
import { server } from 'nexus'

export const socketServer = http.createServer().listen(3000, () => {
  console.log('go to http://localhost:3000')
})
