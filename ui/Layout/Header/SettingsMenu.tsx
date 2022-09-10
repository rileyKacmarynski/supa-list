import { ActionIcon, Box, Drawer, Stack, Title, Text } from '@mantine/core'
import { IconSettings } from '@tabler/icons'
import { useState } from 'react'
import IconButton from '../Buttons/IconButton/IconButton'
import ThemeToggle from './ThemeToggle'

const SettingsTitle = () => <Title order={2}>Settings</Title>

const SettingsMenu = () => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={<SettingsTitle />}
        position="right"
        padding="md"
        size="md"
        overlayBlur={3}
        overlayOpacity={0.55}
      >
        <Stack spacing="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Text id="theme" size="lg">
              Theme
            </Text>
            <ThemeToggle />
          </Box>
        </Stack>
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
