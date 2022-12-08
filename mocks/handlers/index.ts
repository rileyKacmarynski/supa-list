import { handlers as authHandlers } from './auth'
import { handlers as listsHandlers } from './lists'

export const handlers = [...authHandlers, ...listsHandlers]

export default handlers
