import { Button, Group } from '@mantine/core'
import Link from 'next/link'
import { useAuth } from '../../lib/auth/AuthContextProvider'
import UserMenu from '../UserMenu'

export const AppHeader = () => {
	const { user, signOut } = useAuth()

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
				<UserMenu user={user} signOut={signOut} />
			)}
		</Group>
	)
}

export default AppHeader
