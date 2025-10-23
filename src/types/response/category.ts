import type { IAccess } from "../model/access"

export type IGetCategoryResponse = {
  id: string
  name: string
  campusId: string
  estimationCompletionValue?: number
  estimationCompletionUnit?: "hours" | "days" | "weeks"
} & IAccess
