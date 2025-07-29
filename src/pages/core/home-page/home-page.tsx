import { Link } from 'react-router-dom';
import SubLayout from '@/layouts/sub-layout';
import { useRedirect } from '@/hooks/use-redirect';

const HomePage = () => {
  useRedirect();

  return (
    <SubLayout>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-2 py-8">
        <div className="w-full md:w-1/2 mt-8 md:mt-0 text-center md:text-left text-[#5D5D5D]">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Effortless Reporting, Faster Resolution</h1>
          <p className="mb-6 text-base md:text-lg">
            ReportIn is a modern SaaS platform for campus facility complaints, enabling students and staff to report, monitor, and manage issues quickly and transparently from any device.
          </p>
          <Link to="/login">
            <button className="bg-red-500 text-white font-semibold py-2 px-6 rounded-md w-full md:w-auto hover:bg-red-600 transition">
              Get Started
            </button>
          </Link>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            className="w-5/6 max-w-xs md:max-w-md lg:max-w-lg"
            src="/assets/images/dashboard.svg"
            alt="Dashboard Illustration"
          />
        </div>
      </div>
    </SubLayout>
  );
};

export default HomePage;