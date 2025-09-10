import LogoutLogo from '@/assets/sub/logout'
import { getSubdomainResponseExample } from '@/examples/campuses'
import { BACKGROUND_PRIMARY_COLOR } from '@/lib/primary-color'
import { persistor } from '@/store'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const SubLogoutPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const logout = async () => {
      dispatch({ type: "LOGOUT" });
      await persistor.purge();
      await localStorage.clear();
      await sessionStorage.clear();

      setTimeout(() => {
        window.location.replace('/login');
      }, 100);
    };
    logout();
  }, []);

  return (
    <div
      style={BACKGROUND_PRIMARY_COLOR(0.1)}
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