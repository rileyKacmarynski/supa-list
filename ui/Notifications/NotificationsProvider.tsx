// this is just a (leaky) abstraction around @mantine/notifications
import {
  NotificationsProvider as MantineNotificationsProvider,
  NotificationProviderProps as MantineNotificationProviderProps,
  showNotification as mantineShowNotification,
  useNotifications as useMantineNotifications,
  hideNotification,
  cleanNotifications,
  cleanNotificationsQueue,
  updateNotification,
  NotificationProps,
} from '@mantine/notifications'
import { useCallback } from 'react'
import { useTheme } from 'ui/Theme'

export interface NotificationProviderProps
  extends MantineNotificationProviderProps {}

const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  ...rest
}) => {
  return (
    <MantineNotificationsProvider {...rest}>
      {children}
    </MantineNotificationsProvider>
  )
}

export const useNotifications = () => {
  const { primaryColorOption } = useTheme()

  const showNotification = useCallback(
    (props: NotificationProps) =>
      mantineShowNotification({
        color: primaryColorOption,
        autoClose: 5000,
        ...props,
      }),
    [primaryColorOption],
  )

  const notifications = useMantineNotifications()

  return {
    ...notifications,
    showNotification,
    hideNotification,
    cleanNotifications,
    cleanNotificationsQueue,
    updateNotification,
  }
}

export default NotificationProvider
