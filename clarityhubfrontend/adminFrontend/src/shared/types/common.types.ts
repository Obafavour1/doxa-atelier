export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface IProduct {
  name: string;
  category?: string;
  price: number;
  description: string;
  image: string;
  _id: string;
}
