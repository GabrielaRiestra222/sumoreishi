export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date?: string;
  verified?: boolean;
}