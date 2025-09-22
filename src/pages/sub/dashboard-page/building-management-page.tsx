import { SubLayout } from "@/layouts/layout";
import { IReport } from "@/types/model/report";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { hexToRgba } from "@/lib/hex-to-rgba";
import { useReports } from "@/hooks/use-report";
import { useSelector } from "react-redux";
import { selectCampus } from "@/store/campus/selector";
import { usePrimaryColor } from "@/lib/primary-color";

const BuildingManagementPage = () => {
  const campus = useSelector(selectCampus);
  const { TEXT_PRIMARY_COLOR } = usePrimaryColor();

  const options = useMemo(
    () => ({
      sortBy: "count" as const,
      order: "desc" as const,
    }),
    []
  );

  const { reports } = useReports(campus?.campusId, options);

  const primaryColor = campus?.customization.primaryColor;

  const {
    yearlyTrend,
    monthlyCategories,
    dailyCount,
    statusCounts,
  } = useMemo(() => {
    const validReports: IReport[] = reports.filter(
      (r) =>
        !r.isDeleted &&
        r.createdDate &&
        r.status &&
        r.category?.name
    );

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const yearMap: Record<string, number> = {};
    validReports.forEach((r) => {
      const date = new Date(r.createdDate);
      if (!isNaN(date.getTime()) && date.getFullYear() === currentYear) {
        const month = date.toLocaleString("en-US", { month: "short" });
        yearMap[month] = (yearMap[month] || 0) + 1;
      }
    });
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const yearlyTrend = months.map((m) => ({
      month: m,
      value: yearMap[m] || 0,
    }));

    const monthlyReports = validReports.filter((r) => {
      const d = new Date(r.createdDate);
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

    const catMap: Record<string, number> = {};
    monthlyReports.forEach((r) => {
      catMap[r.category.name] =
        (catMap[r.category.name] || 0) + 1;
    });
    const monthlyCategories = Object.entries(catMap).map(
      ([name, value]) => ({ name, value })
    );

    // Daily count
    const today = new Date().toISOString().split("T")[0];
    const dailyCount = validReports.filter(
      (r) => r.createdDate.split("T")[0] === today
    ).length;

    // Status
    const statusMap: Record<string, number> = {
      PENDING: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };
    validReports.forEach((r) => {
      const key = r.status.toUpperCase().replace(/\s+/g, "_");
      if (statusMap[key] !== undefined) {
        statusMap[key]++;
      }
    });

    return { yearlyTrend, monthlyCategories, dailyCount, statusCounts: statusMap };
  }, [reports]);

  // Cari max untuk scale opacity
  const maxValue = Math.max(...monthlyCategories.map(c => c.value), 1);

  return (
    <SubLayout>
      <h1
        style={TEXT_PRIMARY_COLOR(1)}
        className="text-3xl mt-2 mb-5"
      >
        Report Analytics
      </h1>

      {/* Charts */}
      <div className="grid md:grid-cols-12 gap-6 mb-6">
        {/* Yearly Report Trends */}
        <Card className="md:col-span-7">
          <CardHeader>
            <CardTitle style={TEXT_PRIMARY_COLOR(1)}>
              Yearly Report Trends ({new Date().toLocaleString("en-US", { year: "numeric" })})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={yearlyTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill={hexToRgba(primaryColor, 0.7)}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Category Report Trends */}
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle style={TEXT_PRIMARY_COLOR(1)}>
              Monthly Category Report Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={monthlyCategories}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {monthlyCategories.map((entry, i) => {
                    let opacity: number;

                    if (monthlyCategories.every(c => c.value === monthlyCategories[0].value)) {
                      opacity = 1 - i * 0.15;
                      if (opacity < 0.4) opacity = 0.4;
                    } else {
                      opacity = entry.value === maxValue
                        ? 1
                        : Math.max(0.4, entry.value / maxValue);
                    }

                    return (
                      <Cell
                        key={i}
                        fill={hexToRgba(primaryColor, opacity)}
                      />
                    );
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p
              style={TEXT_PRIMARY_COLOR(1)}
              className="text-center text-sm mt-2"
            >
              Report category totals for this month ({new Date().toLocaleString("en-US", { month: "long" })})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="h-36 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: dailyCount, label: "Daily Reports" },
          { value: statusCounts.PENDING, label: "Pending Frequency" },
          { value: statusCounts.IN_PROGRESS, label: "In Progress Frequency" },
          { value: statusCounts.DONE, label: "Done Frequency" },
        ].map((item, i) => (
          <Card className="text-center" key={i}>
            <CardContent className="pt-6 flex justify-center items-center flex-col h-full">
              <div
                style={TEXT_PRIMARY_COLOR(1)}
                className="text-3xl font-bold"
              >
                {item.value}
              </div>
              <div
                style={TEXT_PRIMARY_COLOR(1)}
                className="text-gray-500"
              >
                {item.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SubLayout>
  );
};

export default BuildingManagementPage;