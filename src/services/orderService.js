import api from './api.js';

export const placeOrderRequest = async (payload = {}) => {
  const { data } = await api.post('/orders', payload);
  return data.order;
};

export const fetchOrders = async () => {
  const { data } = await api.get('/orders');
  return data.orders || [];
};

export const fetchOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.order;
};
