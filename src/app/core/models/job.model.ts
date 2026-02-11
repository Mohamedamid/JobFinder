export interface Job {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  location: string;
  created_at: number;
  isFavorite: boolean;
}

export interface ArbeitnowResponse {
  data: Job[];
  meta: any;
}

export interface Favorite {
  id?: number;
  userId: number;
  offerId: string;
  title: string;
  company: string;
  location: string;
}