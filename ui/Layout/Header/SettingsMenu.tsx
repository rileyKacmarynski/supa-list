import {
  ActionIcon,
  Box,
  Drawer,
  Stack,
  Title,
  Text,
  Group,
} from '@mantine/core'
import { IconSettings } from '@tabler/icons'
import { useState } from 'react'
import ColorSchemePicker from '../../Inputs/ColorSchemePicker/ColorSchemePicker'
import { useTheme } from '../../Theme'
import IconButton from '../Buttons/IconButton/IconButton'
import ThemeToggle from './ThemeToggle'

const SettingsTitle = () => <Title order={2}>Settings</Title>

const SettingsMenu = () => {
  const [opened, setOpened] = useState(false)
  const {
    colorScheme,
    toggleColorScheme,
    primaryColorOption,
    setPrimaryColor,
    colors,
  } = useTheme()

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
          <Group position="apart">
            <Text id="theme" size="lg">
              Theme
            </Text>
            <ThemeToggle
              colorScheme={colorScheme}
              primaryColorOption={primaryColorOption}
              toggleColorScheme={toggleColorScheme}
            />
          </Group>
          <Stack spacing="xs">
            <Text id="color-picker" size="lg">
              Color Scheme
            </Text>
            <ColorSchemePicker
              primaryColorOption={primaryColorOption}
              colors={colors}
              setPrimaryColor={setPrimaryColor}
            />
          </Stack>
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
