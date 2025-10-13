import { useLoginMutation } from '@/api/services/user';
import { auth } from '@/config/firebase';
import { useRedirect } from '@/hooks/use-redirect';
import { getProviderLogo } from '@/lib/get-provider-logo';
import { setUsername } from '@/store/auth/slice';
import { setUser, setUserActiveRole } from '@/store/user/slice';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { TailSpin } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from '@/components/modal/Modal';

const RootLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useLoginMutation();

  // Modal state
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useRedirect();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      login.mutate({ token: idToken }, {
        onSuccess: (data) => {
          const roles = data.data?.role ?? [];
          const activeRole = roles.find((r) => r.isDefault) ?? roles[0];
          
          dispatch(setUsername(data.data?.name));
          dispatch(setUser(data.data));
          dispatch(setUserActiveRole(activeRole));

          navigate("/dashboard");
        },
        onError: (error) => {
          setModalTitle('Login Error');
          setModalMessage(error.message || 'Login failed. Please try again.');
          setOpen(true);
        }
      })

    } catch (err: unknown) {
      let message = 'Google Login failed. Please try again.';
      if (err && typeof err === 'object' && 'message' in err) {
        message = (err as { message?: string }).message || message;
      }
      setModalTitle('Google Login Error');
      setModalMessage(message);
      setOpen(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#E5E5E5]">
      {/* Modal for error */}
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => setOpen(false)}
      />
      <div className="w-full md:w-1/2 bg-gray-100 flex flex-1 flex-col items-center justify-center px-8 py-12 min-h-screen md:min-h-full">
        <h2 className="text-4xl text-[#5D5D5D] font-bold mb-2">SIGN IN</h2>
        <img className='w-48 my-6' src="/assets/images/email-consent.svg" alt="" />
        <hr className="w-3/6 border-t border-gray-400 mb-6" />
        <button
          disabled={login.isLoading}
          onClick={handleGoogleLogin}
          className="px-10 bg-red-500 text-white font-semibold py-3 rounded-md hover:bg-red-600 transition flex items-center justify-center gap-3"
        >
          {login.isLoading ? (
            <TailSpin
              visible={true}
              height="24"
              width="24"
              color="#FFFFFF"
              ariaLabel="line-wave-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            <div className='bg-white rounded-full p-1.5'>
              <img
                src={getProviderLogo('Google')}
                alt=""
                className="h-5 w-auto object-contain"
              />
            </div>
          )}
          Sign In with Google
        </button>
        {/* <button onClick={handleGoogleLogin} className="md:px-32 px-24 bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition">
          SIGN IN
        </button> */}
      </div>
      <div className="relative hidden md:flex w-1/2 bg-white justify-center items-center">
        <p onClick={() => navigate("/")} className='text-[#5d5d5d] absolute cursor-pointer top-5 right-5 font-semibold underline'>Back to Homepage</p>
        <img className='w-5/6' src="/assets/images/welcome.svg" alt="" />
      </div>
    </div>
  );
}

export default RootLoginPage