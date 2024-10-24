import { Contact } from '../../../models';
import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  timezone: Joi.string().optional(),
});

export default async function contactById(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const contact = await Contact.update(req.body, { where: { id } });
    return res.status(200).json(contact);
  } else if (req.method === 'DELETE') {
    await Contact.update({ deletedAt: new Date() }, { where: { id } });
    return res.status(204).end();
  }
  return res.status(405).end();
}
