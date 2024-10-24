import moment from 'moment-timezone';
import Contact from '../../models/contact'; // Adjust the import based on your model structure

export default async function contacts(req, res) {
  if (req.method === 'GET') {
    try {
      const contacts = await Contact.findAll();
      const contactsWithTimezone = contacts.map(contact => ({
        ...contact.toJSON(),
        createdAt: moment(contact.createdAt).tz(contact.timezone).format(),
        updatedAt: moment(contact.updatedAt).tz(contact.timezone).format(),
      }));
      return res.status(200).json(contactsWithTimezone);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve contacts' });
    }
  }
  return res.status(405).end(); // Method Not Allowed
}
