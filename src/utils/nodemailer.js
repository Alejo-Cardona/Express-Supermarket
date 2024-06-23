import nodemailer from 'nodemailer'
import { EMAIL_PASS_NODEMAILER, EMAIL_USER_NODEMAILER } from '../config/config.js';

const transporter = nodemailer.createTransport({
    //host: 'smtp.gmail.com'
    service:'gmail',
    port: 587,
    secure: true,
    auth: {
        user: EMAIL_USER_NODEMAILER, 
        pass: EMAIL_PASS_NODEMAILER
    }
});

export default transporter