const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');
const { validate, registerValidation, loginValidation } = require('../middleware/validator');

router.post('/login', validate(loginValidation), authUser);
router.route('/').post(validate(registerValidation), registerUser).get(protect, admin, getUsers);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

module.exports = router;
