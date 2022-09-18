import { ActionIcon, ActionIconProps } from '@mantine/core'
import { TablerIcon } from '@tabler/icons'
import { forwardRef, MouseEventHandler } from 'react'

export interface IconButtonProps extends ActionIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  Icon: TablerIcon
  onClick: MouseEventHandler<HTMLButtonElement>
}

// eslint-disable-next-line react/display-name
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const { Icon, size = 'sm', ...rest } = props
    const sizeMultiplier = 0.75
    const buttonSize = getButtonSize(size)

    return (
      <ActionIcon
        ref={ref}
        aria-label="icon button"
        {...rest}
        size={buttonSize}
      >
        <Icon size={buttonSize * sizeMultiplier} />
      </ActionIcon>
    )
  },
)

function getButtonSize(size: string) {
  switch (size) {
    case 'xs':
      return 28
    case 'sm':
      return 32
    case 'md':
      return 36
    case 'lg':
      return 40
    case 'xl':
      return 44
    default:
      return 32
  }
}

export default IconButton
