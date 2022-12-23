import { createStyles, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { User } from '@supabase/supabase-js'
import { IconLogout } from '@tabler/icons'
import React from 'react'
import Avatar from '../../ui/Avatar'

export interface UserMenuProps {
	user: User
	signOut: () => void
}

const useStyles = createStyles(theme => ({
	user: {
		display: 'block',
		width: '100%',
		// padding: '.25rem',
		// borderRadius: theme.radius.md,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

		// '&:hover': {
		//   backgroundColor:
		//     theme.colorScheme === 'dark'
		//       ? theme.colors.dark[6]
		//       : theme.colors.gray[1],
		// },
		'&:hover': {
			color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.black,
		},
	},
}))

const UserMenu: React.FC<UserMenuProps> = ({ user, signOut }) => {
	const { classes } = useStyles()

	return (
		<Menu shadow="md" width={200}>
			<Menu.Target>
				<UnstyledButton aria-label="open user menu" className={classes.user}>
					<Group spacing="sm">
						<Avatar color={user.user_metadata?.avatarColor ?? 'grape'} />
						<div style={{ flex: 1 }}>
							<Text color="dimmed" size="xs">
								{user.email}
							</Text>
						</div>
					</Group>
				</UnstyledButton>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item icon={<IconLogout size={14} />} onClick={signOut}>
					Log Out
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}

export default UserMenu
