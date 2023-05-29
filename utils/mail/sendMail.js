import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
const __dirname = path.resolve();
console.log(__dirname);
const sendEmail = async (email, subject, payload, template) => {
  try {
    //Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = Handlebars.compile(source);
    const options = () => {
      return {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        return error;
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};
export default sendEmail;
