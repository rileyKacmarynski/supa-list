import {
	ActionIcon,
	Box,
	Drawer,
	Stack,
	Title,
	Text,
	Group,
	Tooltip,
	Button,
} from '@mantine/core'
import { IconSettings } from '@tabler/icons'
import { useState } from 'react'
import ColorSchemePicker from 'ui/Inputs/ColorSchemePicker'
import { useTheme } from 'ui/Theme'
import IconButton from 'ui/Buttons/IconButton'
import ThemeToggle from './ThemeToggle'

const SettingsTitle = () => <Title order={2}>Settings</Title>

const SettingsMenu = () => {
	const [opened, setOpened] = useState(false)
	const {
		colorScheme,
		toggleColorScheme,
		primaryColorOption,
		setPrimaryColor,
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
							setPrimaryColor={setPrimaryColor}
						/>
					</Stack>
				</Stack>
			</Drawer>

			<Tooltip label="open settings" openDelay={500} position="bottom-start">
				<IconButton
					aria-label="open settings"
					onClick={() => setOpened(true)}
					Icon={IconSettings}
				/>
			</Tooltip>
		</>
	)
}

export default SettingsMenu
