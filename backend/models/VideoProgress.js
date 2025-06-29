module.exports = (sequelize, DataTypes) => {
    const VideoProgress = sequelize.define('VideoProgress', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      videoId: {
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
          fields: ['userId', 'courseId', 'videoId'], // Ensure one record per user-course-video
        },
      ],
    });
  
    VideoProgress.associate = (models) => {
      VideoProgress.belongsTo(models.User, { foreignKey: 'userId' });
      VideoProgress.belongsTo(models.Course, { foreignKey: 'courseId' });
      VideoProgress.belongsTo(models.CourseVideo, { foreignKey: 'videoId' });
    };
  
    return VideoProgress;
  };