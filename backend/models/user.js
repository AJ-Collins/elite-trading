const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    referralCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      allowNull: false,
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.associate = (models) => {
    // Subscription relation
    User.belongsToMany(models.Subscription, {
      through: models.UserSubscription,
      foreignKey: 'userId',
    });

    User.hasMany(models.UserSubscription, {
      foreignKey: 'userId',
      as: 'userSubscriptions',
    });

    // Archived courses
    User.belongsToMany(models.Course, {
      through: models.ArchivedCourse,
      foreignKey: 'userId',
      as: 'ArchivedCourses',
    });

    // Payments
    User.hasMany(models.Payment, {
      foreignKey: 'userId',
    });
  };

  return User;
};
