import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import User from "../model/user.model.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password || !req.file) {
    return res.status(400).json({ message: "name, email, password and photo are required" });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "password must be at least 6 character" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: "email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const photo = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "profile-photos", resource_type: "image" },
      (error, result) => error ? reject(error) : resolve(result),
    );
    stream.end(req.file.buffer);
  });
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashedPassword,
    photoUrl: photo.secure_url,
  });

  res.status(201).json({
    message: "user registered",
    user: { id: user._id, name: user.name, email: user.email, photoUrl: user.photoUrl },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "email and password is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "invalid email or password" });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ message: "login successfully", token });
};
