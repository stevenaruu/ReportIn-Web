import { RootLayout } from "@/layouts/layout";
import { features } from "@/lib/features";
import { useState } from "react";

const FeaturePage = () => {
  const [selected, setSelected] = useState(0);

  return (
    <RootLayout>
      <div className="flex text-[#5d5d5d] flex-col md:flex-row items-center md:items-start justify-between w-full min-h-[60vh] gap-10 py-12">
        <div className="flex-1 max-w-xl w-full">
          <h1 className="text-4xl font-bold mb-2">MAIN FEATURES</h1>
          <p className="mb-6">Explore what ReportIn can do for your campus:</p>
          <div className="flex gap-3 mb-6">
            {features.map((feature, idx) => (
              <button
                key={feature.title}
                className={`w-20 h-24 rounded flex items-center justify-center border-2 
                ${selected === idx ? "bg-red-500 border-red-500 text-white shadow-lg" : "bg-gray-200 border-transparent"} 
                transition-all`}
                onClick={() => setSelected(idx)}
                aria-label={feature.title}
              >
                <img className="w-16" src={feature.icon} alt="" />
              </button>
            ))}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{features[selected].title}</h3>
            <p className="text-gray-600">{features[selected].desc}</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <img src="assets/images/features.svg" alt="" className="w-7/12 object-contain mb-2" />
        </div>
      </div>
    </RootLayout>
  )
}

export default FeaturePage