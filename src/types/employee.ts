import { Shift } from "./shift";

export interface Employee {
  _id?: string;
  full_name: string;
  bio?: string;
  dob?: Date | null;
  country: string;
  role: string;
  gender: string;
  department: string;
  designation: string;
  avatar?: string;
  username: string;
  mobile: string;
  email: string;
  qualification: string;
  company: string;
  account_status: string;
  national_identity_number?: number | undefined;
  time_zone: {
    name: string;
    value: string;
  };
  shift?: Shift;
  Today_Status?: string;
  bank_details?: {
    bank_name: string;
    account_holder_name: string;
    account_number: number | undefined;
    iban_number: number | undefined;
    city: string;
    branch: string;
  };
}
