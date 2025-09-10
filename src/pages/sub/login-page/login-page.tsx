/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLoginMutation } from '@/api/services/person';
import LoginLogo from '@/assets/sub/login';
import Footer from '@/components/footer/footer';
import { auth } from '@/config/firebase';
import { getSubdomainResponseExample } from '@/examples/campuses';
import { getProviderLogo } from '@/lib/get-provider-logo';
import { hexToRgba } from '@/lib/hex-to-rgba';
import { setUsername } from '@/store/auth/slice';
import { selectPerson } from '@/store/person/selector';
import { setPerson, setPersonActiveRole } from '@/store/person/slice';
import { PublicCampus } from '@/types/response/campus';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner'
import { BACKGROUND_PRIMARY_COLOR } from '@/lib/primary-color';

const SubLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useLoginMutation();
  const person = useSelector(selectPerson);
  const [campus, setCampus] = useState<PublicCampus>(getSubdomainResponseExample.data);

  useEffect(() => {
    if (person) navigate('/dashboard');
  }, [person]);

  const handleLogin = () => {
    if (campus.provider === 'Microsoft') {
      handleMicrosoftLogin();
    } else if (campus.provider === 'Google') {
      handleGoogleLogin();
    } else {
      console.error(`Unsupported provider: ${campus.provider}`);
    }
  };

  const processLogin = async (idToken: string) => {
    login.mutate(
      { token: idToken, campusId: campus.campusId },
      {
        onSuccess: (data) => {
          const roles = data.data?.role ?? [];
          const activeRole = roles.find((r) => r.isDefault) ?? roles[0];

          dispatch(setUsername(data.data?.name));
          dispatch(setPerson(data.data));
          dispatch(setPersonActiveRole(activeRole));

          navigate('/dashboard');
        },
        onError: (error) => {
          console.error('Login error:', error.message);
        }
      }
    );
  };

  const handleMicrosoftLogin = async () => {
    const provider = new OAuthProvider('microsoft.com');
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      await processLogin(idToken);
    } catch (err: any) {
      console.error('Microsoft Login failed:', err.message || err);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      await processLogin(idToken);

    } catch (err: any) {
      console.error('Google Login failed:', err.message || err);
    }
  };

  return (
    <div>
      <div
        style={BACKGROUND_PRIMARY_COLOR(0.1)}
        className="min-h-screen flex flex-col justify-between"
      >
        <div className="flex flex-1 flex-col-reverse md:flex-row gap-12 items-center justify-center p-6 md:p-12">

          <div className="text-center md:text-left space-y-6 max-w-lg w-full">
            <div className="text-2xl md:text-3xl font-bold text-[#5D5D5D] leading-snug">
              <p className="md:whitespace-nowrap">Welcome to {campus.name}</p>
              <p>Facility Complaint</p>
            </div>

            <p className="text-[#5D5D5D] text-base md:text-lg leading-relaxed">
              Empowering a better campus life by making it easier to report and
              resolve facility issues.
            </p>

            <button
              disabled={login.isLoading}
              onClick={handleLogin}
              className="w-full md:w-auto bg-[#5D5D5D] flex items-center justify-center gap-3 text-white px-5 py-3 rounded-lg shadow-md hover:bg-[#4a4a4a] transition"
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
                <img
                  src={getProviderLogo(campus.provider)}
                  alt=""
                  className="h-6 w-auto object-contain"
                />
              )}
              Sign In with {campus.provider}
            </button>
          </div>

          <div className="flex justify-center md:justify-end w-full md:w-1/2">
            <LoginLogo
              className="w-2/3 sm:w-1/2 md:w-3/4 lg:w-2/3 max-w-sm"
              color={campus.customization.primaryColor}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubLoginPage;