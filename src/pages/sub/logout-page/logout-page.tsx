import LogoutLogo from '@/assets/sub/logout'
import { persistor } from '@/store'
import { selectCampus } from '@/store/campus/selector'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hexToRgba } from '@/lib/hex-to-rgba'
import { usePWAInstall } from '@/hooks/use-pwa-install'

const SubLogoutPage = () => {
  const dispatch = useDispatch();
  const campus = useSelector(selectCampus);
  const [primaryColor, setPrimaryColor] = useState<string>(campus?.customization.primaryColor || '#ef4444');
  const { resetDismissalState } = usePWAInstall();

  // Store the primary color before clearing the store
  useEffect(() => {
    if (campus?.customization?.primaryColor) {
      setPrimaryColor(campus.customization.primaryColor);
    }
  }, [campus]);

  useEffect(() => {
    const logout = async () => {
      resetDismissalState();
      await persistor.purge();
      await localStorage.clear();
      await sessionStorage.clear();
      dispatch({ type: "LOGOUT" });

      setTimeout(() => {
        window.location.replace('/login');
      }, 100);
    };
    logout();
  }, [dispatch]);

  return (
    <div
      style={{
        backgroundColor: hexToRgba(primaryColor, 0.1)
      }}
      className="min-h-screen flex flex-col gap-12 justify-center items-center p-5"
    >
      <LogoutLogo
        className="w-2/3 sm:w-1/2 md:w-3/4 lg:w-2/3 max-w-sm"
        color={primaryColor}
      />
      <div className='text-center text-[#5d5d5d]'>
        <p className='text-xl font-bold'>Logout is in progress..</p>
        <p className='mt-2'>We will immediately redirect you to the login page...</p>
      </div>
    </div>
  )
}

export default SubLogoutPage