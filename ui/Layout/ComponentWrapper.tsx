import { Box } from '@mantine/core'

const ComponentWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<Box
			sx={{
				display: 'grid',
				placeItems: 'center',
				paddingTop: '4rem',
			}}
		>
			{children}
		</Box>
	)
}

export default ComponentWrapper
