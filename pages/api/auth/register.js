import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export default async function register(req, res) {
  if (req.method === 'POST') {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, verified: false });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Configure your SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Click this link to verify your email: http://localhost:3000/api/auth/verify-email?token=${token}`,
    };
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });
      } catch (dbError) {
        console.error('Database query error:', dbError);
        return res.status(500).json({ error: 'Internal server error' });
      }
      

    try {
      await transporter.sendMail(mailOptions);
      return res.status(201).json({ message: 'User registered, please verify your email' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }
  }
  return res.status(405).end();
}
