import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next'
import { Database } from 'types/supabase'

// maybe at some point I can get ambitious and put a landing page here
export const getServerSideProps: GetServerSideProps = async ctx => {
	const supabase = createServerSupabaseClient<Database>(ctx)
	// Check if we have a session
	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session)
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}

	return {
		redirect: {
			destination: '/app',
			permanent: false,
		},
	}
}

const App = () => <h1>Hopefully we cannot see this</h1>

export default App
