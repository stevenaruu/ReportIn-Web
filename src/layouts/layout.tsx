import { RootNavbar, SubNavbar } from '@/components/navbar/navbar';
import React, { ReactNode } from 'react'
import Container from './container';
import Sidebar from '@/components/sidebar/sidebar';

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
  return (
    <div className="h-screen flex flex-col">
      <SubNavbar />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar role='Building Management' />
        <main className='flex-1 bg-[#F5F5F5] overflow-y-auto p-4'>
          {children}
        </main>
      </div>
    </div>
  )
}

export { RootLayout, SubLayout }