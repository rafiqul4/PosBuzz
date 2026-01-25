import { api } from './client';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  stock_quantity?: number;
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  getOne: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
