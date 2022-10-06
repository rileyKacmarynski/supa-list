import { Button, MantineColor } from '@mantine/core'
import { NotificationProps } from '@mantine/notifications'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { IconCheck } from '@tabler/icons'
import { colorOptions } from 'ui/Theme'
import NotificationProvider, { useNotifications } from './NotificationsProvider'

const NotificationTester: React.FC<
	NotificationProps & { withUpdate: boolean }
> = props => {
	const { showNotification, updateNotification } = useNotifications()

	const onClick = () => {
		if (!props.withUpdate) {
			showNotification(props)
		} else {
			const id = 'notification'
			showNotification({
				...props,
				id,
				title: 'loading data',
				loading: true,
				autoClose: false,
				disallowClose: true,
			})
			setTimeout(() => {
				updateNotification({
					id,
					...props,
					title: 'data was loaded',
					autoClose: 3000,
					icon: <IconCheck size={16} />,
				})
			}, 3000)
		}
	}

	return <Button onClick={onClick}>Show Notification</Button>
}

export default {
	title: 'UI/Notifications',
	component: NotificationTester,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		title: 'Hello!',
		message: 'This is a notification.',
		loading: false,
		disallowClose: false,
	},
	argsTypes: {
		color: {
			control: 'select',
			options: colorOptions,
		},
		radius: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg', 'xl'],
		},
	},
	decorators: [
		Story => (
			<NotificationProvider>
				<Story />
			</NotificationProvider>
		),
	],
} as ComponentMeta<typeof NotificationTester>

const Template: ComponentStory<typeof NotificationTester> = args => (
	<NotificationTester {...args} />
)

export const Primary = Template.bind({})

export const WithUpdate = Template.bind({})
WithUpdate.args = {
	withUpdate: true,
}
