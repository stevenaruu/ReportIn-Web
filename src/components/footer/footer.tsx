const Footer = () => {
  return (
    <footer className="bg-[#E5E5E5] py-10 px-6 text-sm text-[#5d5d5d]">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        
        <div className="flex flex-col space-y-4 max-w-xl text-center md:text-left mx-auto md:mx-0">
          <img
            className="w-32 mx-auto md:mx-0"
            src="/assets/images/reportin-logo.png"
            alt="Reportin logo"
          />
          <p className="leading-relaxed">
            ReportIn is a modern SaaS platform for campus facility complaints,
            enabling students and staff to report, monitor, and manage issues
            quickly and transparently from any device.
          </p>
        </div>

        <div className="border-t border-[#5d5d5d]/40"></div>

        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-4 md:space-y-0">
          <p>© 2025 ReportIn. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
            <a href="#" className="hover:underline">
              Terms &amp; Condition
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;