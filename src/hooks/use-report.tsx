/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/config/firebase";
import { IReport } from "@/types/model/report";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

interface UseReportsOptions {
  sortBy?: "count" | "status" | "area" | "category";
  order?: "asc" | "desc";
  filters?: {
    status?: string[];
    areas?: string[];
    categories?: string[];
  };
}

// 🔹 always fallback ke createdDate desc
const byDateDesc = (a: IReport, b: IReport) =>
  new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();

const comparator = (options?: UseReportsOptions) => {
  return (a: IReport, b: IReport) => {
    if (!options?.sortBy) return byDateDesc(a, b);

    const order = options.order === "asc" ? 1 : -1;
    let diff = 0;

    switch (options.sortBy) {
      case "count":
        diff = (a.count - b.count) * order;
        break;
      case "status":
        diff = a.status.localeCompare(b.status) * order;
        break;
      case "area":
        diff = ((a.area?.name ?? "").localeCompare(b.area?.name ?? "")) * order;
        break;
      case "category":
        diff = ((a.category?.name ?? "").localeCompare(b.category?.name ?? "")) * order;
        break;
    }

    // jika sama → thenBy createdDate desc
    return diff !== 0 ? diff : byDateDesc(a, b);
  };
};

export function useReports(campusId?: string, options?: UseReportsOptions) {
  const [allReports, setAllReports] = useState<IReport[]>([]);
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campusId) return;

    const q = query(
      collection(db, "Report"), 
      where("campusId", "==", campusId),
      where("isDeleted", "==", false)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      let reportData: IReport[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<IReport, "id">;
        return { id: doc.id, ...data };
      });

      setAllReports(reportData);

      // ✅ Filtering
      if (options?.filters?.status?.length) {
        reportData = reportData.filter((r) =>
          options.filters!.status!.includes(r.status),
        );
      }
      if (options?.filters?.areas?.length) {
        reportData = reportData.filter((r) =>
          options.filters!.areas!.includes(r.area?.name ?? ""),
        );
      }
      if (options?.filters?.categories?.length) {
        reportData = reportData.filter((r) =>
          options.filters!.categories!.includes(r.category?.name ?? ""),
        );
      }

      // ✅ Sorting with fallback
      reportData = reportData.sort(comparator(options));

      setReports(reportData);
      setLoading(false);
    });

    return () => unsub();
  }, [campusId, options]);

  return { allReports, reports, loading };
}