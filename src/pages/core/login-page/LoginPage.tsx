import { useLoginMutation } from '@/api/services/user';
import { auth } from '@/config/firebase';
import { setUsername } from '@/store/auth/slice';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';

const LoginPage = () => {
  const dispatch = useDispatch();
  const login = useLoginMutation();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      login.mutate({ token: idToken }, {
        onSuccess: (data) => {
          dispatch(setUsername(data.data?.name));
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
    <div>
      <h2>Login</h2>
      <button className='bg-blue-500' onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}

export default LoginPage