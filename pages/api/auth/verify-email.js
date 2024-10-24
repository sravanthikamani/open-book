import { User } from '../../../models';
import jwt from 'jsonwebtoken';

export default async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.update({ verified: true }, { where: { id: decoded.id } });
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
}
