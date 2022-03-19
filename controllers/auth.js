import User from '../models/user';
import {comparehashData, hashData} from '../utils/hashData'

export const register = async (req, res) => {
  console.log(req.body);
  let { email, password, name } = req.body;
  if (!name) {
    return res.json({ error: "Name is required" }).status(400)
  }
  if (!password || password.length<6) {
    return res.json({ error: "Please provide a password of length min 6 charecters" }).status(400)
  }
  if (!email) {
    return res.json({ error: "Email is required" }).status(400)
  }
  let userExist = await User.findOne({ email });
  if (userExist) {
    return res.json({ error: "User already exist"}).status(400)
  }

  let hashedPassword = await hashData(password);
   console.log(hashedPassword)
  let newUser = await new User({email,name, password:hashedPassword}).save();

  if(newUser){
    res.json({data:"Rehistration done"}).status(200)
  } else{
    res.json({error:"Registration failed"}).status(400)
  }

};
