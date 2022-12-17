import { Box, createStyles, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons'
import React, { useState } from 'react'
import IconButton from 'ui/Buttons/IconButton'

export interface ListFormProps {
	onSubmit: (name: string) => Promise<void>
	initialValue?: string
	autoFocus?: boolean
}

export const ListForm: React.FC<ListFormProps> = ({
	onSubmit,
	initialValue,
	autoFocus = false,
}) => {
	const [loading, setLoading] = useState(false)
	const { classes } = useFormStyles()
	const form = useForm({
		initialValues: {
			name: initialValue ?? '',
		},
	})

	const submit = async (values: typeof form.values) => {
		if (values.name) {
			setLoading(true)
			await onSubmit(values.name)
			setLoading(false)
			form.reset()
		}
	}

	return (
		<Box
			component="form"
			onSubmit={form.onSubmit(submit)}
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'end',
				gap: '1rem',
			}}
		>
			<TextInput
				id="name"
				name="name"
				variant="unstyled"
				placeholder="create a list"
				aria-label="list name"
				sx={{ flexGrow: 1 }}
				classNames={{ wrapper: classes.wrapper, input: classes.input }}
				autoFocus={autoFocus}
				{...form.getInputProps('name')}
			/>
			<IconButton
				type="submit"
				Icon={IconPlus}
				size="sm"
				aria-label="submit list form"
				loading={loading}
			/>
		</Box>
	)
}

const useFormStyles = createStyles(theme => {
	const isDarkTheme = theme.colorScheme === 'dark'
	const borderColor = isDarkTheme ? theme.colors.dark[6] : theme.colors.gray[3]
	const primaryColor = theme.colors[theme.primaryColor][8]

	return {
		wrapper: {
			borderBottom: `1px solid ${borderColor}`,
			marginBottom: '-1px',
			'&:focus-within': {
				borderBottom: `1px solid ${primaryColor}`,
			},
		},
		input: {
			padding: 0,
		},
	}
})
