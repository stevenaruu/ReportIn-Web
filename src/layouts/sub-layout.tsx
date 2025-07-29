import Navbar from '@/components/navbar/navbar';
import React, { ReactNode } from 'react'
import Container from './container';

type SubLayoutProps = {
  children: ReactNode;
}

const SubLayout : React.FC<SubLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Container>
        {children}
      </Container>
    </div>
  )
}

export default SubLayout