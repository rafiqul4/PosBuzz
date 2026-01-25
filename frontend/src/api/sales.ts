import apiClient from './client';
import { Product } from './products';
import { User } from './auth';

export interface SaleItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Sale {
  id: number;
  userId: number;
  total: number;
  createdAt: string;
  saleItems: SaleItem[];
  user: User;
}

export interface CreateSaleItemDto {
  productId: number;
  quantity: number;
}

export interface CreateSaleDto {
  items: CreateSaleItemDto[];
}

export const salesApi = {
  getAll: async (): Promise<Sale[]> => {
    const response = await apiClient.get('/sales');
    return response.data;
  },

  getOne: async (id: number): Promise<Sale> => {
    const response = await apiClient.get(`/sales/${id}`);
    return response.data;
  },

  create: async (data: CreateSaleDto): Promise<Sale> => {
    const response = await apiClient.post('/sales', data);
    return response.data;
  },
};
