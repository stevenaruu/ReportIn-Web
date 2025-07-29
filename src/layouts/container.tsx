import React, { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex-1 w-full mx-auto px-4 md:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
