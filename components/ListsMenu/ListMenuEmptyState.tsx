import { Stack, Title } from '@mantine/core'
import React from 'react'

export const ListMenuEmptyState = () => {
	return (
		<Stack
			sx={theme => ({
				textAlign: 'center',
				padding: `0 ${theme.spacing.sm}px`,
			})}
			data-testid="lists-empty-state"
		>
			<Title
				order={3}
				sx={theme => ({
					fontSize: theme.fontSizes.md,
					padding: theme.spacing.lg,
					color:
						theme.colorScheme === 'dark'
							? theme.colors.dark[2]
							: theme.colors.gray[6],
				})}
			>
				Get started by creating a list.
			</Title>
		</Stack>
	)
}
