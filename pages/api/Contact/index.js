import { Contact } from '../../../models';
import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().optional(),
  timezone: Joi.string().optional(),
});

export default async function contacts(req, res) {
  if (req.method === 'POST') {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const contact = await Contact.create(req.body);
    return res.status(201).json(contact);
  } else if (req.method === 'GET') {
    const contacts = await Contact.findAll();
    return res.status(200).json(contacts);
  }
  return res.status(405).end();
}
