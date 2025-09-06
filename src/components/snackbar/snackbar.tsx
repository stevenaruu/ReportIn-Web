import { NetworkContext } from '@/contexts/network/network-context';
import React, { useContext } from 'react'

const Snackbar = () => {
  const { isOnline } = useContext(NetworkContext);

  if (isOnline) return null;

  return (
    <div className='bg-red-600 flex items-center gap-3 text-white p-4'>
      <img className='w-7' src="/assets/icons/no-internet.svg" alt="" />
      <p className='font-semibold'>There is no internet connection.</p>
    </div>
  )
}

export default Snackbar