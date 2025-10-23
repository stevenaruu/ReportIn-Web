export type ITechnicianPreferenceRequest = {
  preferences: Array<{
    personId: string
    campusId: string
    categoryId: string
  }>
}
