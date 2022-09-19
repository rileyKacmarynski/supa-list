import { setupServer } from 'msw/node'
import { handlers } from './handlers'

const server = setupServer(...handlers)

server.listen({ onUnhandledRequest: 'bypass' })
console.info('🔶 Mock server running')

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())

export default server
