'use client'
import AppHeader from 'components/AppHeader'
import React from 'react'
import Layout from 'ui/Layout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <Layout header={<AppHeader />}>{children}</Layout>
}
