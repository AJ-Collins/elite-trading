const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, editUser, deleteUser, suspendUser, updateUserStatus, resetUserPassword, getAllInstructors } = require('../controllers/adminUsersController');
const isAdmin = require('../middleware/isAdmin');
const authenticate = require('../middleware/auth'); 

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

//Admin User management routes
router.get('/users', getAllUsers);
router.post('/users/create', createUser);
router.put('/users/edit/:id', editUser);
router.delete('/users/delete/:id', deleteUser);
router.patch('/users/:id/suspend', suspendUser);
router.patch('/users/:id/status', updateUserStatus);
router.post('/users/:id/reset-password', resetUserPassword);
router.get('/users/instructors', getAllInstructors);

module.exports = router;
