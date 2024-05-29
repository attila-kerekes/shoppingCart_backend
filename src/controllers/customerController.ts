import { Request, Response, NextFunction } from 'express';
import * as customerService from '../services/customerService';

export const registerCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerService.registerCustomer(req.body);
    res.status(201).send(customer);
  } catch (err) {
    next(err);
  }
};

export const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).send(customers);
  } catch (err) {
    next(err);
  }
};
