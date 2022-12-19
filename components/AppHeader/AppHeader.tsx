import { Button, Group } from '@mantine/core'
import { useUser } from '@supabase/auth-helpers-react'
import { useSupabaseClient } from 'lib/supabaseClient'
import Link from 'next/link'
import UserMenu from '../UserMenu'

export const AppHeader = () => {
	const supabaseClient = useSupabaseClient()
	const user = useUser()

	return (
		<Group spacing="sm">
			{!user ? (
				<>
					<Link href="login" passHref>
						<Button component="span" size="sm" variant="subtle">
							Log In
						</Button>
					</Link>
					<Link href="register" passHref>
						<Button component="span" size="sm" variant="subtle">
							Register
						</Button>
					</Link>
				</>
			) : (
				<UserMenu user={user} signOut={() => supabaseClient.auth.signOut()} />
			)}
		</Group>
	)
}

export default AppHeader
