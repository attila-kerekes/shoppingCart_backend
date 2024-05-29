import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const Customer = model('Customer', customerSchema);

export default Customer;


