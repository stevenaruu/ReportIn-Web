import LogoutLogo from '@/assets/sub/logout'
import { getSubdomainResponseExample } from '@/examples/campuses'
import { hexToRgba } from '@/lib/hex-to-rgba'
import { persistor } from '@/store'
import { selectPerson } from '@/store/person/selector'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const SubLogoutPage = () => {
  const person = useSelector(selectPerson);

  useEffect(() => {
    if (!person) {
      console.log("disini 2");
      window.location.href = '/login';
    } else {
      console.log("disini");
      persistor.purge().then(() => {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '/login';
      });
    }
  }, [person])

  return (
    <div
      style={{ backgroundColor: hexToRgba(getSubdomainResponseExample.data.customization.primaryColor, 0.1) }}
      className="min-h-screen flex flex-col gap-12 justify-center items-center p-5"
    >
      <LogoutLogo
        className="w-2/3 sm:w-1/2 md:w-3/4 lg:w-2/3 max-w-sm"
        color={getSubdomainResponseExample.data.customization.primaryColor}
      />
      <div className='text-center text-[#5d5d5d]'>
        <p className='text-xl font-bold'>Logout is in progress..</p>
        <p className='mt-2'>We will immediately redirect you to the login page...</p>
      </div>
    </div>
  )
}

export default SubLogoutPage