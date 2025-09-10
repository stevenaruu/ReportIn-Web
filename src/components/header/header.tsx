import React from 'react'

const Header = ({ title }: { title: string }) => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <h1 className="text-xl text-[#5d5d5d] font-bold">{title}</h1>
      </div>
      <div className="border-b border-b-[#5d5d5d] my-4" />
    </>
  )
}

export default Header