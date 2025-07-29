import SubLayout from '@/layouts/sub-layout'

const steps = [
  {
    title: "Create Your Subdomain",
    desc: "Register your campus and set a custom subdomain. Only your organization will access this space.",
    icon: "/assets/images/cloud.svg",
  },
  {
    title: "Customize & Whitelist",
    desc: "Upload your logo, pick your theme color, configure categories, and set email whitelists for secure user registration.",
    icon: "/assets/images/customize.svg",
  },
  {
    title: "Invite & Start Reporting",
    desc: "Invite users, or let them join using their authorized email. Start creating notifications and facility reports for your campus.",
    icon: "/assets/images/invite.svg",
  },
];

const HowItWorkPage = () => {
  return (
    <SubLayout>
      <section className="w-full min-h-[70vh] py-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#5d5d5d] mb-2 text-center">
          HOW IT WORKS
        </h2>
        <div className='mb-10 text-[#5d5d5d] text-center'>
          <p>Get started with a dedicated workspace for your campus.</p>
          <p>Customize, invite, and begin managing facility reports in minutes.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center w-full max-w-5xl">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="flex-1 bg-gray-100 rounded-lg shadow-inner flex flex-col p-6 md:p-8 relative min-w-[220px] max-w-xs md:max-w-sm"
              style={{ minHeight: 240 }}
            >
              {/* Icon kiri atas */}
              <div className="absolute top-5 left-5">
                <div className="w-20 h-20 outline-dashed outline-1 outline-[#5d5d5d] bg-[#fafafa] rounded-full flex items-center justify-center text-2xl">
                  <img className='w-9/12' src={step.icon} alt="" />
                </div>
              </div>
              {/* Angka kanan atas */}
              <span className="absolute top-4 right-5 text-6xl md:text-9xl font-bold text-gray-300 select-none">
                {idx + 1}
              </span>
              {/* Judul */}
              <div className="mt-20 mb-3 text-base font-semibold text-[#5d5d5d] text-left">
                {step.title}
              </div>
              {/* Deskripsi */}
              <div className="text-[#5d5d5d] text-sm text-left">
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SubLayout>
  )
}

export default HowItWorkPage