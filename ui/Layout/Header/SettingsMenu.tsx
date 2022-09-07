import { ActionIcon, Drawer } from '@mantine/core'
import { IconSettings } from '@tabler/icons'
import { useState } from 'react'

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

      <ActionIcon
        aria-label="open settings"
        size={32}
        onClick={() => setOpened(true)}
      >
        <IconSettings size={24} />
      </ActionIcon>
    </>
  )
}

export default SettingsMenu
