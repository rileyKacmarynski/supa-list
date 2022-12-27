import { handlers as authHandlers } from './auth'
import { handlers as listsHandlers } from './lists'
import { handlers as listHandlers } from './list'

export const handlers = [...authHandlers, ...listsHandlers, ...listHandlers]

export default handlers
