import Customer from '../models/Customer';

export const findAllCustomers = () => {
  return Customer.find();
};

export const findCustomerById = (id: string) => {
  return Customer.findById(id);
};

export const createCustomer = (customerData: any) => {
  const customer = new Customer(customerData);
  return customer.save();
};
