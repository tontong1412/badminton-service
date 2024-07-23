// routes/auth.js
import userSchema from '../../schema/user'
import jwt from 'jsonwebtoken'
import { AUTH_ALGORITHM } from '../../config'
import crypto from 'crypto'

const User = userSchema.model
function base64UrlDecode(data) {
  return Buffer.from(data, 'base64url').toString('utf8');
}
const setPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const decodedToken = base64UrlDecode(token)

  try {
    const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);

    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, AUTH_ALGORITHM).toString('hex')

    const updateParam = {
      salt,
      hash
    }

    const user = await User.findByIdAndUpdate(decoded.id, updateParam);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Invalid or expired token' });
  }
}

export default setPassword
