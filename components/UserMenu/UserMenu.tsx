import { Menu, NavLink } from '@mantine/core'
import { User } from '@supabase/supabase-js'
import { IconLogout } from '@tabler/icons'
import React from 'react'
import Avatar from '../../ui/Avatar'

export interface UserMenuProps {
  user: User
  signOut: () => void
}

const UserMenu: React.FC<UserMenuProps> = ({ user, signOut }) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar sx={{ cursor: 'pointer' }} component="button" initials="RK" />
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
