
export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  poster?: { url: string } | null;
}


export interface MovieListResponse {
  docs: Movie[]
  total: number
  limit: number
  page: number
  pages: number
}