export interface UserAccountDetails {
  username: string
  full_name: string
  avatar: string
  email: string
  gender: string
  designation: string
  company: string
}

export interface UserBasicInformation {
  bio: string
  mobile: number
  dob: Date | null
  country: string
  languages: string[]
  qualification: string
  natinal_identity_number: number
}

export interface UserBankDetails {
  bank_name: string
  account_holder_name: string
  account_number: number | undefined
  iban_number: number | undefined
  city: string
  branch: string
}

export interface User {
  _id?: string
  bio?: string
  mobile?: number
  dob?: Date
  country?: string
  languages?: string[]
  username: string
  full_name: string
  role: string
  avatar: string
  account_status?: string
  company?: string
  natinal_identity_number?: number
  bank_details?: UserBankDetails
  email: string
  gender?: string
  qualification?: string
  join_date?: Date | null
  leave_date?: Date | null
  designation?: string
  qualification_certificates?: string[]
}
