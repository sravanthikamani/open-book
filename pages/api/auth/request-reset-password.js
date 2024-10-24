import db from '../../../models';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_URL}/api/auth/reset-password?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    });

    res.status(200).json({ message: 'Password reset email sent' });
}
