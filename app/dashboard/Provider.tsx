import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from './_component/AppSidebar'
import AppHeader from './_component/AppHeader'

const DashboardProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <SidebarProvider>
            <AppSidebar />
            <div className ="w-full">
            <AppHeader/>
          {children}
            </div>
    </SidebarProvider>
    </div>
  )
}

export default DashboardProvider