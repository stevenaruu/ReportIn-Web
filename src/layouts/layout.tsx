import SubNavbar, { RootNavbar } from '@/components/navbar/navbar';
import React, { ReactNode, useState } from 'react'
import Container from './container';
import Sidebar from '@/components/sidebar/sidebar';
import Snackbar from '@/components/snackbar/snackbar';

type LayoutProps = {
  children: ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <RootNavbar />
      <Container>
        {children}
      </Container>
    </div>
  )
}

const SubLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="h-screen flex flex-col">
      <SubNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Snackbar />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className='flex-1 bg-[#F5F5F5] overflow-y-auto p-4'>
          {children}
        </main>
      </div>
    </div>
  )
}

export { RootLayout, SubLayout }