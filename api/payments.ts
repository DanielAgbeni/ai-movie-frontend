import { getData, postData } from './index';

export const createCheckoutSession = (data: {
	movieId: string;
	type: 'rent' | 'buy';
}) => {
	return postData<typeof data, any>('/api/v1/payments/checkout', data);
};

export const getOrders = () => {
	return getData<any>('/api/v1/payments/orders');
};

export const getEntitlements = () => {
	return getData<any>('/api/v1/payments/entitlements');
};
