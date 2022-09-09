import { ActionIcon, ActionIconProps } from '@mantine/core'
import { TablerIcon } from '@tabler/icons'
import { MouseEventHandler } from 'react'

export interface IconButtonProps extends ActionIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  Icon: TablerIcon
  onClick: MouseEventHandler<HTMLButtonElement>
}

const IconButton: React.FC<IconButtonProps> = ({
  Icon,
  size = 'sm',
  ...rest
}) => {
  const sizeMultiplier = 0.75
  const buttonSize = getButtonSize(size)

  return (
    <ActionIcon aria-label="icon button" {...rest} size={buttonSize}>
      <Icon size={buttonSize * sizeMultiplier} />
    </ActionIcon>
  )
}

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
