import { Job } from "./job.model";

export interface ArbeitnowResponse {
  data: Job[];
  meta: any;
}