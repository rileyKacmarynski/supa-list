'use client'
import { ScrollArea } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import React from 'react'
import Layout from 'ui/Layout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<Layout header={<AppHeader />} navbar={<div>lists will go here</div>}>
			<ScrollArea offsetScrollbars sx={{ width: '100vw' }}>
				{children}
			</ScrollArea>
		</Layout>
	)
}
