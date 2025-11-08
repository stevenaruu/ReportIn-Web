import { db } from "@/config/firebase"
import type { IReport } from "@/types/model/report"
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

interface UseReportsOptions {
  sortBy?: "count" | "status" | "area" | "category" | "upvote"
  order?: "asc" | "desc"
  filters?: {
    status?: string[]
    areas?: string[]
    categories?: string[]
  }
}

// 🔹 always fallback ke createdDate desc
const byDateDesc = (a: IReport, b: IReport) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()

const comparator = (options?: UseReportsOptions) => {
  return (a: IReport, b: IReport) => {
    if (!options?.sortBy) return byDateDesc(a, b)

    const order = options.order === "asc" ? 1 : -1
    let diff = 0

    switch (options.sortBy) {
      case "count":
        diff = (a.count - b.count) * order
        break
      case "status": {
        const statusOrder = { PENDING: 0, "IN PROGRESS": 1, DONE: 2 }
        const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 3
        const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 3
        diff = (statusA - statusB) * order
        break
      }
      case "area": {
        diff = (a.area?.name ?? "").localeCompare(b.area?.name ?? "") * order
        break
      }
      case "category": {
        diff = (a.category?.name ?? "").localeCompare(b.category?.name ?? "") * order
        break
      }
      case "upvote":
        diff = ((a.upvote?.length ?? 0) - (b.upvote?.length ?? 0)) * order
        break
    }

    // jika sama → thenBy createdDate desc
    return diff !== 0 ? diff : byDateDesc(a, b)
  }
}

export function useReports(campusId?: string, options?: UseReportsOptions) {
  const [allReports, setAllReports] = useState<IReport[]>([])
  const [reports, setReports] = useState<IReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!campusId) return

    const q = query(collection(db, "Report"), where("campusId", "==", campusId), where("isDeleted", "==", false))

    const unsub = onSnapshot(q, (snapshot) => {
      let reportData: IReport[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<IReport, "id">
        return { id: doc.id, ...data }
      })

      setAllReports(reportData)

      // ✅ Filtering
      if (options?.filters?.status?.length) {
        reportData = reportData.filter((r) => options.filters!.status!.includes(r.status))
      }
      if (options?.filters?.areas?.length) {
        reportData = reportData.filter((r) => options.filters!.areas!.includes(r.area?.name ?? ""))
      }
      if (options?.filters?.categories?.length) {
        reportData = reportData.filter((r) => options.filters!.categories!.includes(r.category?.name ?? ""))
      }

      // ✅ Sorting with fallback
      reportData = reportData.sort(comparator(options))

      setReports(reportData)
      setLoading(false)
    })

    return () => unsub()
  }, [campusId, options])

  return { allReports, reports, loading }
}

export function useReportById(reportId?: string) {
  const [report, setReport] = useState<IReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reportId) {
      setLoading(false)
      return
    }

    const getReport = async () => {
      try {
        setLoading(true)
        setError(null)

        const docRef = doc(db, "Report", reportId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<IReport, "id">
          setReport({ id: docSnap.id, ...data })
        } else {
          setError("Report not found")
          setReport(null)
        }
      } catch {
        setError("Failed to fetch report")
        setReport(null)
      } finally {
        setLoading(false)
      }
    }

    getReport()
  }, [reportId])

  return { report, loading, error }
}