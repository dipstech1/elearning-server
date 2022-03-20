import User from '../models/user';
import { comparehashData, hashData } from '../utils/hashData'

import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  console.log(req.body);
  let { email, password, name } = req.body;
  if (!name) {
    return res.json({ error: "Name is required" }).status(400)
  }
  if (!password || password.length < 6) {
    return res.json({ error: "Please provide a password of length min 6 charecters" }).status(400)
  }
  if (!email) {
    return res.json({ error: "Email is required" }).status(400)
  }
  let userExist = await User.findOne({ email });
  if (userExist) {
    return res.json({ error: "User already exist" }).status(400)
  }

  let hashedPassword = await hashData(password);
  console.log(hashedPassword)
  let newUser = await new User({ email, name, password: hashedPassword }).save();

  if (newUser) {
    res.json({ data: "Rehistration done" }).status(200)
  } else {
    res.json({ error: "Registration failed" }).status(400)
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.json({ error: "Please provide email" }).status(400);

  try {
    let user = await User.findOne({ email });

    if (!user) return res.json({ error: "User doesn't exist" }).status(400);

    let passwordCheck = await comparehashData(password, user.password);
    if (!passwordCheck) return res.json({ error: "Please provide a valid email or password" }).status(400);

    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "7d" });
    user.password = undefined;
    res.cookie('token', token, { httpOnly: true });

    res.json({data:user});
  } catch (err) {
    console.log(err)
    return res.json({ error: err }).status(400)
  }

}
