import { ApplicationStatus } from "./applicationStatus.model";

export interface Application {
  id?: number;
  userId: number;
  offerId: string;
  title: string;
  company: string;
  location: string;
  url: string;
  status: ApplicationStatus;
  notes: string;
  dateAdded: string;
  apiSource?: string;
}