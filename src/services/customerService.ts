import bcrypt from 'bcrypt';
import * as customerRepository from '../repositories/customerRepository';

export const registerCustomer = async (customerData: any) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(customerData.password, salt);
  const newCustomer = {
    ...customerData,
    password: hashedPassword,
  };
  return customerRepository.createCustomer(newCustomer);
};

export const getAllCustomers = () => {
  return customerRepository.findAllCustomers();
};
