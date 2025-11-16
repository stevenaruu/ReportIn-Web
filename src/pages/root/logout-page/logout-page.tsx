import LogoutLogo from '@/assets/sub/logout'
import { usePWAInstall } from '@/hooks/use-pwa-install'
import { persistor } from '@/store'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const RootLogoutPage = () => {
  const dispatch = useDispatch();
  const { resetDismissalState } = usePWAInstall();

  useEffect(() => {
    const logout = async () => {
      resetDismissalState();
      dispatch({ type: "LOGOUT" });
      await persistor.purge();
      await localStorage.clear();
      await sessionStorage.clear();

      setTimeout(() => {
        window.location.replace('/');
      }, 100);
    };
    logout();
  }, []);

  return (
    <div
      className="bg-red-50 min-h-screen flex flex-col gap-12 justify-center items-center p-5"
    >
      <LogoutLogo
        className="w-2/3 sm:w-1/2 md:w-3/4 lg:w-2/3 max-w-sm"
        color="#ef4444"
      />
      <div className='text-center text-[#5d5d5d]'>
        <p className='text-xl font-bold'>Logout is in progress..</p>
        <p className='mt-2'>We will immediately redirect you to the login page...</p>
      </div>
    </div>
  )
}

export default RootLogoutPage