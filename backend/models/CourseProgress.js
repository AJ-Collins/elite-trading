module.exports = (sequelize, DataTypes) => {
    const CourseProgress = sequelize.define('CourseProgress', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'courseId'], // Ensure one record per user-course
        },
      ],
    });
  
    CourseProgress.associate = (models) => {
      CourseProgress.belongsTo(models.User, { foreignKey: 'userId' });
      CourseProgress.belongsTo(models.Course, { foreignKey: 'courseId' });
    };
  
    return CourseProgress;
};