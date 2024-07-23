import userSchema from '../../schema/user'
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = userSchema.model

function base64UrlEncode(data) {
  return Buffer.from(data, 'utf8').toString('base64url');
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'User with this email does not exist' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const encodedToken = base64UrlEncode(token);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: 'Badminstar',
      address: process.env.EMAIL
    },
    to: user.email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${process.env.CLIENT}/reset-password/${encodedToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error sending email' });
    }
    res.json({ message: 'Password reset link sent' });
  });
}
export default forgotPassword