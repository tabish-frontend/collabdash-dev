// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { ThemeColor } from 'src/layouts/dashboard/types'

export type StatsCardProps = {
  title: string
  stats: string
  icon: ReactNode
  subtitle: string
  color?: ThemeColor
  trendNumber: string
  trend?: 'positive' | 'negative'
}
