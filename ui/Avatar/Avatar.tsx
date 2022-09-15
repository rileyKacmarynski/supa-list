import {
  Avatar as MantineAvatar,
  AvatarProps as MantineAvatarProps,
} from '@mantine/core'
import React from 'react'

export interface AvatarProps extends MantineAvatarProps {
  component?: string
  initials: string
}

const Avatar: React.FC<AvatarProps> = ({ initials, component, ...rest }) => {
  return (
    <MantineAvatar radius="xl" {...rest}>
      {initials}
    </MantineAvatar>
  )
}

export default Avatar
