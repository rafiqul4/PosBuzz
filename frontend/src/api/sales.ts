import { api } from './client';
import { Product } from './products';

export interface SaleItem {
  productId: number;
  quantity: number;
}

export interface CreateSaleDto {
  items: SaleItem[];
}

export interface Sale {
  id: number;
  userId: number;
  total: number;
  createdAt: string;
  saleItems: {
    id: number;
    quantity: number;
    price: number;
    product: Product;
  }[];
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

export const salesApi = {
  getAll: async (): Promise<Sale[]> => {
    const response = await api.get('/sales');
    return response.data;
  },

  getOne: async (id: number): Promise<Sale> => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  create: async (data: CreateSaleDto): Promise<Sale> => {
    const response = await api.post('/sales', data);
    return response.data;
  },
};
