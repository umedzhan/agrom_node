const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;

const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

const issueVerificationCode = async (user) => {
    const code = crypto.randomInt(100000, 1000000).toString();

    user.verificationCodeHash = hashCode(code);
    user.verificationCodeExpires = new Date(Date.now() + CODE_TTL_MS);
    user.verificationAttempts = 0;
    user.verificationSentAt = new Date();
    await user.save();

    await sendEmail({
        to: user.email,
        subject: 'AgroM — email tasdiqlash kodi',
        text: `Sizning tasdiqlash kodingiz: ${code}\nKod 10 daqiqa davomida amal qiladi.`,
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        if (!user.emailVerified) {
            return res.status(403).json({
                message: 'Email is not verified. Please enter the code sent to your email.',
                requiresVerification: true,
                email: user.email,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isFarmer: user.isFarmer,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Invalid email format');
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        emailVerified: false,
    });

    if (user) {
        await issueVerificationCode(user);
        res.status(201).json({
            requiresVerification: true,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Verify email with the code sent at registration
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    const user = await User.findOne({ email }).select(
        '+verificationCodeHash +verificationCodeExpires +verificationAttempts'
    );

    const invalid = () => {
        res.status(400);
        throw new Error('Invalid or expired verification code');
    };

    if (
        !user ||
        user.emailVerified ||
        !user.verificationCodeHash ||
        user.verificationCodeExpires < Date.now() ||
        user.verificationAttempts >= MAX_CODE_ATTEMPTS
    ) {
        invalid();
    }

    user.verificationAttempts += 1;

    if (hashCode(code) !== user.verificationCodeHash) {
        await user.save();
        invalid();
    }

    user.emailVerified = true;
    user.verificationCodeHash = undefined;
    user.verificationCodeExpires = undefined;
    user.verificationAttempts = 0;
    user.verificationSentAt = undefined;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isFarmer: user.isFarmer,
        token: generateToken(user._id),
    });
});

// @desc    Resend the email verification code
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email }).select('+verificationSentAt');

    if (user && !user.emailVerified) {
        const sentAt = user.verificationSentAt ? user.verificationSentAt.getTime() : 0;
        if (Date.now() - sentAt < RESEND_COOLDOWN_MS) {
            res.status(429);
            throw new Error('Please wait a minute before requesting a new code');
        }
        await issueVerificationCode(user);
    }

    res.json({ message: 'If the account exists and is unverified, a new code has been sent' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user would be set by middleware
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/auth/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/auth/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/auth/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // Check if isAdmin/isFarmer are provided in body (explicit boolean checks)
        if (req.body.isAdmin !== undefined) {
            user.isAdmin = req.body.isAdmin;
        }
        if (req.body.isFarmer !== undefined) {
            user.isFarmer = req.body.isFarmer;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isFarmer: updatedUser.isFarmer,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    authUser,
    registerUser,
    verifyEmail,
    resendVerification,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};
