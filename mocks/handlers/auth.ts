// @ts-nocheck
import { rest } from 'msw'

const supabaseAuthSession = (userId, email) => ({
	access_token: 'validaccesstoken',
	token_type: 'bearer',
	expires_in: 3600,
	refresh_token: 'validrefreshtoken',
	user: {
		id: userId,
		aud: 'authenticated',
		role: 'authenticated',
		email: email,
		email_confirmed_at: '2022-09-18T19:18:47.677849Z',
		phone: '',
		confirmed_at: Date.now.toString(),
		last_sign_in_at: Date.now.toString(),
		app_metadata: { provider: 'email', providers: ['email'] },
		user_metadata: { avatarColor: 'cyan' },
		identities: [
			{
				id: userId,
				user_id: userId,
				identity_data: { sub: userId },
				provider: 'email',
				last_sign_in_at: '2022-09-18T19:18:47.674315Z',
				created_at: '2022-09-18T19:18:47.674366Z',
				updated_at: '2022-09-18T19:18:47.67437Z',
			},
		],
		created_at: '2022-09-18T19:18:47.66763Z',
		updated_at: '2022-10-27T00:50:08.449452Z',
	},
})

const authAccount = (userId, email) => ({
	id: userId,
	email: email,
})

const userProfile = {
	id: '123123',
	user_id: '12341234',
	avatar_color: 'grape',
}

const SUPABASE_URL = 'https://dydoinxeicqbpcqlpood.supabase.co'
const SUPABASE_AUTH_TOKEN_API = '/auth/v1/token'
const SUPABASE_AUTH_USER_API = '/auth/v1/user'
const SUPABASE_AUTH_LOGOUT = '/auth/v1/logout'
const SUPABASE_AUTH_SIGNUP_API = '/auth/v1/signup'
const SUPABASE_AUTH_PROFILE_API = '/rest/v1/profiles'
const SUPABASE_AUTH_ADMIN_USER_API = '/auth/v1/admin/users'

export const handlers = [
	rest.post(
		`${SUPABASE_URL}${SUPABASE_AUTH_TOKEN_API}`,
		async (req, res, ctx) => {
			console.log('post to supabase token api...', req)

			const { email, password } = await req.json()
			console.log('parsed json body')

			if (email == ERROR_USER) {
				console.log('invalid credentials')
				const errorResponse = {
					error: 'invalid_grant',
					error_description: 'Invalid login credentials',
				}
				return res(ctx.status(401), ctx.json(errorResponse))
			}

			console.log('about to create supabase session')

			const session = supabaseAuthSession('123123', email)
			console.log('session for response', session)

			return res(ctx.status(200), ctx.json(session))
		},
	),
	rest.post(
		`${SUPABASE_URL}${SUPABASE_AUTH_SIGNUP_API}`,
		async (req, res, ctx) => {
			console.log('post to sign up supabase api...', req)
			const { email, password, refresh_token } = await req.json()

			if (refresh_token) {
				if (refresh_token !== 'valid') {
					return res(ctx.status(401), ctx.json({ error: 'Token expired' }))
				}

				return res(
					ctx.status(200),
					ctx.json(supabaseAuthSession('123123', email)),
				)
			}

			if (!email || !password) {
				return res(
					ctx.status(401),
					ctx.json({ message: 'Wrong email or password' }),
				)
			}

			return res(
				ctx.status(200),
				ctx.json(supabaseAuthSession('123123', email)),
			)
		},
	),
	rest.get(
		`${SUPABASE_URL}${SUPABASE_AUTH_PROFILE_API}`,
		async (req, res, ctx) => {
			return res(ctx.status(200), ctx.json([userProfile]))
		},
	),
	rest.get(
		`${SUPABASE_URL}${SUPABASE_AUTH_USER_API}`,
		async (req, res, ctx) => {
			console.log('get supabase user...')

			const token = req.headers.get('authorization')?.split('Bearer ')?.[1]

			const { id } = await req.json()
			// if (token !== 'valid') {
			//   return res(ctx.status(401), ctx.json({ error: 'Token expired' }))
			// }

			return res(ctx.status(200), ctx.json({ id: id }))
		},
	),
	rest.post(
		`${SUPABASE_URL}${SUPABASE_AUTH_ADMIN_USER_API}`,
		async (req, res, ctx) => {
			console.log('post to user supabase...', req)

			return res(
				ctx.status(200),
				ctx.json(authAccount('123123', 'someemail@email.com')),
			)
		},
	),
	rest.delete(
		`${SUPABASE_URL}${SUPABASE_AUTH_ADMIN_USER_API}/*`,
		async (req, res, ctx) => {
			console.log('delete supabase user endpoint...', req)
			return res(ctx.status(200), ctx.json({}))
		},
	),
	rest.post(`${SUPABASE_URL}${SUPABASE_AUTH_LOGOUT}`, async (req, res, ctx) => {
		return res(ctx.status(200))
	}),
]

// I don't like this, but I also don't like trying to attach msw on the window to
// modify handlers in each test. Will make testing server requests tough
export const ERROR_USER = 'error-user@email.com'

export const TOKEN_API = `${SUPABASE_URL}${SUPABASE_AUTH_TOKEN_API}`
export const SIGNUP_API = `${SUPABASE_URL}${SUPABASE_AUTH_SIGNUP_API}`
export const PROFILE_API = `${SUPABASE_URL}${SUPABASE_AUTH_PROFILE_API}`
