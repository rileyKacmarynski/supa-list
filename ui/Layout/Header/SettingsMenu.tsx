import { ActionIcon, Drawer } from '@mantine/core'
import { IconSettings } from '@tabler/icons'
import { useState } from 'react'
import IconButton from '../Buttons/IconButton/IconButton'

const SettingsMenu = () => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Settings"
        position="right"
        padding="md"
        size="md"
        overlayBlur={3}
        overlayOpacity={0.55}
      >
        {/* Drawer content */}
      </Drawer>

      <IconButton
        aria-label="open settings"
        onClick={() => setOpened(true)}
        Icon={IconSettings}
      />
    </>
  )
}

export default SettingsMenu
