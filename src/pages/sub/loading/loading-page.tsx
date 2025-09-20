import { useSelector } from 'react-redux';
import { selectCampus } from '@/store/campus/selector';
import LoadingLogo from '@/assets/sub/loading';
import { TEXT_PRIMARY_COLOR } from '@/lib/primary-color';

const LoadingPage = () => {
  const campus = useSelector(selectCampus);

  return (
    <div className="bg-[#fafafa] min-h-screen flex flex-col gap-12 justify-center items-center p-5">
      <LoadingLogo
        className="w-2/3 sm:w-1/2 md:w-3/4 lg:w-2/3 max-w-sm"
        color={campus?.customization.primaryColor}
      />
      <div className="text-center text-[#5d5d5d]">
        <p
          style={campus ? TEXT_PRIMARY_COLOR(1) : undefined}
          className={`text-2xl font-bold ${campus ? "" : "text-red-500"}`}
        >
          Redirecting <span className="dot-anim"></span>
        </p>
        <p className="mt-2">Please wait while we take you to your campus page.</p>
      </div>

      <style>
        {`
          .dot-anim {
            display: inline-block;
            width: 1.5em;
            text-align: left;
          }
          .dot-anim::after {
            content: '';
            animation: dots 1.5s steps(3, end) infinite;
          }
          @keyframes dots {
            0%   { content: ''; }
            33%  { content: '.'; }
            66%  { content: '..'; }
            100% { content: '...'; }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingPage;