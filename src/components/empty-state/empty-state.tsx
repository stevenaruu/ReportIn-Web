import EmptyLogo from "@/assets/sub/empty";
import LeaderboardLogo from "@/assets/sub/leaderboard";
import { selectCampus } from "@/store/campus/selector";
import React from "react";
import { useSelector } from "react-redux";

type EmptyStateType = "leaderboard" | "publicReport" | "privateReport";

interface EmptyStateProps {
  type: EmptyStateType;
  count: number;
  className?: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, count, className, children }) => {
  const campus = useSelector(selectCampus);

  if (count > 0) return null;

  const contentMap: Record<
    EmptyStateType,
    { logo: React.FC<{ className?: string; color?: string }>; messages: string[] }
  > = {
    leaderboard: {
      logo: LeaderboardLogo,
      messages: [
        "The leaderboard currently does not have any custodians listed.",
        "Please check back later, as new custodians may appear once they join or complete their activities.",
      ],
    },
    publicReport: {
      logo: EmptyLogo,
      messages: [
        "No reports are available at the moment.",
        "Check back later or create a new report to get started.",
      ],
    },
    privateReport: {
      logo: EmptyLogo,
      messages: [
        "No reports are available at the moment.",
        "Check back later for updates.",
      ],
    },
  };

  const { logo: Logo, messages } = contentMap[type];

  return (
    <div
      className={`w-full h-full flex justify-center items-center gap-10 flex-col py-10 ${className || ""}`}
    >
      <Logo
        color={campus?.customization.primaryColor}
        className="w-2/4 sm:w-1/2 md:w-3/4 lg:w-2/3 max-w-sm"
      />
      <div className="text-center">
        {messages.map((msg, idx) => (
          <p key={idx} className="text-[#5d5d5d] text-sm mt-2">
            {msg}
          </p>
        ))}
      </div>
      {children && <div className="mt-2 flex justify-center items-center w-full">{children}</div>}
    </div>
  );
};

export default EmptyState;