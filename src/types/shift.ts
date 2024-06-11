interface timeDetails {
  start: Date | null
  end: Date | null
  days: string[]
}

export interface Shift {
  _id?: string
  user: string
  shift_type: string
  hours: number
  times: timeDetails[]
  weekends: string[]
}
