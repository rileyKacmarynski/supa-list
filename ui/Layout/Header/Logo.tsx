import { Text } from '@mantine/core'
import { IconBolt } from '@tabler/icons'
import { useTheme } from '../../Theme/ThemeProvider'

const Logo = () => {
  const { primaryColor } = useTheme()

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconBolt size={36} strokeWidth={1} color={primaryColor} />
      <Text sx={{ marginLeft: '4px' }} weight="500" size="xl">
        SupaList
      </Text>
    </div>
  )
}

export default Logo
