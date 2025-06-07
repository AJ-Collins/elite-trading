const { User } = require('../models');


async function getAllUsers(req, res) {
    try {
        const user = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'referralCode', 'status', 'createdAt'],
        });

        res.json(user);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function createUser(req, res) {
    const { username, email, password, status = 'active' } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Simple field validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Optional: Password length or strength validation
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        const user = await User.create({ username, email, password, status });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create user', error: err.message });
    }
}

async function editUser(req, res) {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update({ username, email });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update user', error: err.message });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Failed to delete user', error: err.message });
    }
}

async function suspendUser(req, res) {
    await updateStatus(req, res, 'suspended');
}

const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
  
    try {
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.status = status;
      await user.save();
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update status', error: err.message });
    }
};
  

async function updateStatus(req, res, status) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      await user.update({ status });
      res.json({ message: `User ${status} successfully`, user });
    } catch (err) {
      res.status(400).json({ message: 'Failed to update status', error: err.message });
    }
}

async function resetUserPassword(req, res) {
  const { id } = req.params;
  const { newPassword } = req.body;

  // Validate newPassword (e.g., length, complexity, etc.)
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Find the user by id
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    // Send a response back
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
}

async function getAllInstructors(req, res) {
  try {
      const instructors = await User.findAll({
          attributes: ['id', 'username', 'email', 'role', 'referralCode', 'status', 'createdAt'],
          where: {
              role: 'admin'
          }
      });

      res.json(instructors);
  } catch (error) {
      console.error('Error fetching instructors:', error);
      res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllUsers, createUser, editUser, deleteUser, suspendUser, updateUserStatus,resetUserPassword, getAllInstructors };
