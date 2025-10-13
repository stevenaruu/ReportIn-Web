import NotFound from '../../../assets/sub/not-found.svg';
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const handleRedirect = () => {
    window.location.href = "https://reportin.my.id/";
  };

  return (
    <div className="bg-[#fafafa] min-h-screen flex flex-col gap-12 justify-center items-center p-5">
      <img
        className="w-2/3 sm:w-1/2 md:w-3/4 lg:w-2/3 max-w-sm"
        src={NotFound}
        alt="Not Found"
      />
      <div className="text-center text-[#5d5d5d] max-w-md">
        <p className="text-red-500 text-2xl font-bold">Website Not Found</p>
        <p className="mt-2">
          We couldn’t find the page you were looking for.  
        </p>
        <p>Please return to the main ReportIn website.</p>
        <Button style={{ backgroundColor: "#5d5d5d" }} onClick={handleRedirect} className="mt-6">
          Go to Main Website
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;