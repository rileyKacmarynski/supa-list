import { Box, Text } from '@mantine/core'
import { IconBolt } from '@tabler/icons'
import { useTheme } from '../../../ui/Theme/ThemeProvider'
import Link from 'next/link'

const Logo = () => {
	const { primaryColor } = useTheme()

	return (
		<Link href="/app">
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<IconBolt size={36} strokeWidth={1} color={primaryColor} />
				<Text sx={{ marginLeft: '4px' }} weight="500" size="xl">
					SupaList
				</Text>
			</Box>
		</Link>
	)
}

export default Logo
