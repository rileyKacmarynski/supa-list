import {
  Avatar as MantineAvatar,
  AvatarProps as MantineAvatarProps,
} from '@mantine/core'
import React from 'react'
import { forwardRef } from 'react'

export interface AvatarProps extends MantineAvatarProps {
  component?: string
  initials?: string
}

// eslint-disable-next-line react/display-name
const Avatar: React.FC<AvatarProps> = forwardRef<HTMLDivElement, AvatarProps>(
  ({ initials, component, ...rest }, ref) => {
    return (
      <MantineAvatar ref={ref} radius="xl" {...rest}>
        {initials}
      </MantineAvatar>
    )
  },
)

export default Avatar
