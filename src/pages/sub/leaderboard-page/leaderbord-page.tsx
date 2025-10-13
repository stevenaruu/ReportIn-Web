import { SubLayout } from "@/layouts/layout"
import { Card, CardContent } from "@/components/ui/card"
import ProfileImage from "@/assets/sub/profile"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"
import EmptyState from "@/components/empty-state/empty-state"
import { usePrimaryColor } from "@/lib/primary-color"
import { useGetPersonLeaderboardQuery } from "@/api/services/leaderboard"

import { Skeleton } from "@/components/ui/skeleton"

const LeaderboardPage = () => {
  const campus = useSelector(selectCampus);
  const { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR } = usePrimaryColor();

  const { data, isLoading } = useGetPersonLeaderboardQuery(campus?.campusId ?? '');

  // Use leaderboard data from API response
  const players = data?.data || [];
  const topThree = players.slice(0, 3);
  const others = players.slice(3);

  return (
    <SubLayout>
      <div className="pt-6">
        {isLoading ? (
          <>
            <h1 className="text-2xl text-[#5d5d5d] font-bold text-center mb-8">Leaderboards</h1>
            {/* Top 3 Skeleton */}
            <div className="flex justify-center items-end gap-6 mb-10">
              {/* 2nd place skeleton */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Skeleton className="w-20 h-20 rounded-full shadow-lg border-2 border-gray-300" />
                </div>
                <Skeleton className="mt-6 h-5 w-20 bg-gray-100" />
                <Skeleton className="h-5 w-24 mt-2 bg-gray-100" />
              </div>
              {/* 1st place skeleton */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Skeleton className="w-28 h-28 rounded-full shadow-xl border-2 border-gray-300" />
                </div>
                <Skeleton className="mt-8 h-6 w-28 bg-gray-100" />
                <Skeleton className="h-6 w-32 mt-2 bg-gray-100" />
              </div>
              {/* 3rd place skeleton */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Skeleton className="w-20 h-20 rounded-full shadow-lg border-2 border-gray-300" />
                </div>
                <Skeleton className="mt-6 h-5 w-20 bg-gray-100" />
                <Skeleton className="h-5 w-24 mt-2 bg-gray-100" />
              </div>
            </div>
            {/* Others Skeleton (4,5,6) */}
            <div className="space-y-3">
              {[4, 5, 6].map((num, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {players.length > 0 && (
              <h1 className="text-2xl text-[#5d5d5d] font-bold text-center mb-8">Leaderboards</h1>
            )}
            {/* Top 3 */}
            <div className="flex justify-center items-end gap-6 mb-10">
              {/* 2nd place - Only show if exists */}
              {topThree[1] && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                      <ProfileImage
                        color={campus?.customization.primaryColor}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
                        2
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-sm font-medium text-center text-[#5d5d5d]">{topThree[1].name}</p>
                  <p
                    style={TEXT_PRIMARY_COLOR(1)}
                    className="font-semibold">{topThree[1].point.toLocaleString()} Points
                  </p>
                </div>
              )}
              {/* 1st place - Always show if exists */}
              {topThree[0] && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl">
                      <ProfileImage
                        color={campus?.customization.primaryColor}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-xl border-2 border-white transform hover:scale-110 transition-transform">
                        1
                      </div>
                    </div>
                  </div>
                  <p className="mt-8 text-base font-medium text-center text-[#5d5d5d]">{topThree[0].name}</p>
                  <p
                    style={TEXT_PRIMARY_COLOR(1)}
                    className="font-semibold">{topThree[0].point.toLocaleString()} Points
                  </p>
                </div>
              )}
              {/* 3rd place - Only show if exists */}
              {topThree[2] && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                      <ProfileImage
                        color={campus?.customization.primaryColor}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
                        3
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-sm font-medium text-center text-[#5d5d5d]">{topThree[2].name}</p>
                  <p
                    style={TEXT_PRIMARY_COLOR(1)}
                    className="font-semibold">
                    {topThree[2].point.toLocaleString()} Points
                  </p>
                </div>
              )}
            </div>
            {/* Others */}
            <div className="space-y-3">
              {others.map((player, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      style={BACKGROUND_PRIMARY_COLOR(0.5)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white font-bold text-sm">{i + 4}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow">
                      <ProfileImage
                        color={campus?.customization.primaryColor}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#5d5d5d]">{player.name}</p>
                    </div>
                    <p
                      style={TEXT_PRIMARY_COLOR(1)}
                      className="font-semibold">
                      {player.point.toLocaleString()} Points
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <EmptyState count={players.length} type="leaderboard" />
          </>
        )}
      </div>
    </SubLayout>
  )
}

export default LeaderboardPage;