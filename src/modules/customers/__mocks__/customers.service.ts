export const CustomersService = jest.fn().mockReturnValue({
	createCustomer: jest.fn(),
	getAllCustomers: jest.fn(),
	getCustomerById: jest.fn(),
});
