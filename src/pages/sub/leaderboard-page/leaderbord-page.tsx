import { SubLayout } from "@/layouts/layout"
import { Card, CardContent } from "@/components/ui/card"
import ProfileImage from "@/assets/sub/profile"
import { getSubdomainResponseExample } from "@/examples/campuses"
import { hexToRgba } from "@/lib/hex-to-rgba"
import LeaderboardLogo from "@/assets/sub/leaderboard"

type Player = {
  id: number
  name: string
  points: number
}

const players: Player[] = [
  { id: 1, name: "Alya Nur Hasannah", points: 4500 },
  { id: 2, name: "Zain Fatin Mardhiyyah", points: 4500 },
  { id: 3, name: "Julia Metta Viriyani", points: 4400 },
  { id: 4, name: "Vira Ananda Sucipta", points: 4400 },
  { id: 5, name: "Chelsea", points: 4400 },
  { id: 6, name: "Justin Nathaniel Tanujaya", points: 4400 },
  { id: 7, name: "Vinana Paramita Kwan", points: 4300 },
  { id: 8, name: "Muhammad Dani Fadhlurrahman", points: 4300 },
]

const LeaderboardPage = () => {
  const topThree = players.slice(0, 3)
  const others = players.slice(3)

  return (
    <SubLayout>
      <div className="p-6">
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
                    color={getSubdomainResponseExample.data.customization.primaryColor}
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
                style={{ color: getSubdomainResponseExample.data.customization.primaryColor }}
                className="font-semibold">{topThree[1].points.toLocaleString()} Points
              </p>
            </div>
          )}

          {/* 1st place - Always show if exists */}
          {topThree[0] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl">
                  <ProfileImage
                    color={getSubdomainResponseExample.data.customization.primaryColor}
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
                style={{ color: getSubdomainResponseExample.data.customization.primaryColor }}
                className="font-semibold">{topThree[0].points.toLocaleString()} Points
              </p>
            </div>
          )}

          {/* 3rd place - Only show if exists */}
          {topThree[2] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                  <ProfileImage
                    color={getSubdomainResponseExample.data.customization.primaryColor}
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
                style={{ color: getSubdomainResponseExample.data.customization.primaryColor }}
                className="font-semibold">
                {topThree[2].points.toLocaleString()} Points
              </p>
            </div>
          )}
        </div>

        {/* Others */}
        <div className="space-y-3">
          {others.map((player, i) => (
            <Card key={player.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  style={{ backgroundColor: hexToRgba(getSubdomainResponseExample.data.customization.primaryColor, 0.5) }}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <span className="text-white font-bold text-sm">{i + 4}</span>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden shadow">
                  <ProfileImage
                    color={getSubdomainResponseExample.data.customization.primaryColor}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#5d5d5d]">{player.name}</p>
                </div>
                <p
                  style={{ color: getSubdomainResponseExample.data.customization.primaryColor }}
                  className="font-semibold">
                  {player.points.toLocaleString()} Points
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state when no players */}
        {players.length === 0 && (
          <div className="flex justify-center items-center gap-10 flex-col py-10">
            <LeaderboardLogo
              className="w-2/3 sm:w-1/2 md:w-3/4 lg:w-2/3 max-w-sm"
              color={getSubdomainResponseExample.data.customization.primaryColor}
            />
            <div className="text-center">
              <p className="text-[#5d5d5d] text-sm mt-2">
                The leaderboard currently does not have any custodians listed.
              </p>
              <p className="text-[#5d5d5d] text-sm mt-2">
                please check back later, as new custodians may appear once they join or complete their activities.
              </p>
            </div>
          </div>
        )}
      </div>
    </SubLayout>
  )
}

export default LeaderboardPage;