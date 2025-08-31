import { useLoginMutation } from '@/api/services/user';
import { auth } from '@/config/firebase';
import { useRedirect } from '@/hooks/use-redirect';
import { setUsername } from '@/store/auth/slice';
import { setUser } from '@/store/user/slice';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RootLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useLoginMutation();

  useRedirect();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      login.mutate({ token: idToken }, {
        onSuccess: (data) => {
          dispatch(setUsername(data.data?.name));
          dispatch(setUser(data.data));
          navigate("/dashboard");
        },
        onError: (error) => {
          console.error("Login error:", error.message);
        }
      })

    } catch (err) {
      console.error('Google Login failed:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#E5E5E5]">
      <div className="w-full md:w-1/2 bg-gray-100 flex flex-1 flex-col items-center justify-center px-8 py-12 min-h-screen md:min-h-full">
        <h2 className="text-4xl text-[#5D5D5D] font-bold mb-2">SIGN IN</h2>
        <img className='w-48 my-6' src="/assets/images/email-consent.svg" alt="" />
        <hr className="w-3/6 border-t border-gray-400 mb-6" />
        <button onClick={handleGoogleLogin} className="md:px-32 px-24 bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition">
          SIGN IN
        </button>
      </div>
      <div className="hidden md:flex w-1/2 bg-white justify-center items-center">
        <img className='w-5/6' src="/assets/images/welcome.svg" alt="" />
      </div>
    </div>
  );
}

export default RootLoginPage