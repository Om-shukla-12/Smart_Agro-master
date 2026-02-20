const Farmer = require('../models/Farmer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  normalizeEmail,
  isValidGmail,
  isStrongPassword,
} = require('../utils/authValidation');

// Register farmer
exports.registerFarmer = async (req, res) => {
  const { name, email, password, role } = req.body; // Include 'role'
  const normalizedEmail = normalizeEmail(email);

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required.' });
  }

  if (!isValidGmail(normalizedEmail)) {
    return res
      .status(400)
      .json({ success: false, message: 'Please use a valid Gmail address (example@gmail.com).' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        'Password must be at least 8 characters with one uppercase letter and one special character.',
    });
  }

  try {
    const farmer = await Farmer.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role || 'Farmer',
    });
    const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login farmer
exports.loginFarmer = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!isValidGmail(normalizedEmail)) {
    return res
      .status(400)
      .json({ success: false, message: 'Please use a valid Gmail address (example@gmail.com).' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        'Password must be at least 8 characters with one uppercase letter and one special character.',
    });
  }

  try {
    const farmer = await Farmer.findOne({ email: normalizedEmail });
    if (!farmer || !(await bcrypt.compare(password, farmer.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch Farmer Profile
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id).select('-password');
    res.json({ success: true, farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile data.' });
  }
};

// Update Farmer Profile
exports.updateFarmerProfile = async (req, res) => {
  const { name, role, profilePicture } = req.body; // Include 'role' and 'profilePicture'

  try {
    const farmer = await Farmer.findById(req.user.id);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }
    farmer.name = name || farmer.name;
    farmer.role = role || farmer.role;
    farmer.profilePicture = profilePicture || farmer.profilePicture;

    const updatedFarmer = await farmer.save();
    res.json({ success: true, farmer: updatedFarmer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile data.' });
  }
};
