import nodemailer from "nodemailer"


export const transporter =  nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "hello@roveo.in",
    pass: "?jd2hHf3X",
  },
});
