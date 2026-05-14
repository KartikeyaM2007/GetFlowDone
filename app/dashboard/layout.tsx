import React from 'react'
import DashboardProvider from './Provider'

function Dashboardlayout({children }: {children: React.ReactNode}) {
  return (
    <div>
        <DashboardProvider>
          
        {children}
        </DashboardProvider>
        </div>
  )
}

export default Dashboardlayout