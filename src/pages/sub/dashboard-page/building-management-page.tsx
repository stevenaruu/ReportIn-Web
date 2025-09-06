import { db } from "@/config/firebase";
import { SubLayout } from "@/layouts/layout";
import { IReport } from "@/types/model/report";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
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
import { getSubdomainResponseExample } from "@/examples/campuses";
import { hexToRgba } from "@/lib/hex-to-rgba";

const BuildingManagementPage = () => {
  const [reports, setReports] = useState<IReport[]>([]);

  const campusId = getSubdomainResponseExample.data.campusId;
  const primaryColor = getSubdomainResponseExample.data.customization.primaryColor;

  useEffect(() => {
    if (!campusId) return;

    const q = query(
      collection(db, "Report"),
      where("campusId", "==", campusId),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const reportData: IReport[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<IReport, "id">;
        return { id: doc.id, ...data };
      });
      setReports(reportData);
    });

    return () => unsub();
  }, [campusId]);

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
      if (statusMap[r.status] !== undefined) {
        statusMap[r.status]++;
      }
    });

    return { yearlyTrend, monthlyCategories, dailyCount, statusCounts: statusMap };
  }, [reports]);

  // Cari max untuk scale opacity
  const maxValue = Math.max(...monthlyCategories.map(c => c.value), 1);

  return (
    <SubLayout>
      <h1
        style={{ color: hexToRgba(primaryColor, 1) }}
        className="text-3xl mt-3 mb-5"
      >
        Report Analytics
      </h1>

      {/* Charts */}
      <div className="grid md:grid-cols-12 gap-6 mb-6">
        {/* Yearly Report Trends */}
        <Card className="md:col-span-7">
          <CardHeader>
            <CardTitle style={{ color: hexToRgba(primaryColor, 1) }}>
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
            <CardTitle style={{ color: hexToRgba(primaryColor, 1) }}>
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
              style={{ color: hexToRgba(primaryColor, 1) }}
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
                style={{ color: hexToRgba(primaryColor, 1) }}
                className="text-3xl font-bold"
              >
                {item.value}
              </div>
              <div
                style={{ color: hexToRgba(primaryColor, 1) }}
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