module.exports = (sequelize, DataTypes) => {
  const CourseVideo = sequelize.define(
    'CourseVideo',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING, // Stores file path for uploaded videos or URL for external links
        allowNull: false,
      },
      isLocal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default to false, set to true for uploaded files
      },
      access: {
        type: DataTypes.ENUM('Free', 'Premium'),
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional, for sorting videos (e.g., Part 1, Part 2)
      },
    },
    {
      timestamps: true, // Enable createdAt and updatedAt
      paranoid: true, // Enable soft deletes (optional, if you want deletedAt)
    }
  );

  CourseVideo.associate = (models) => {
    CourseVideo.belongsTo(models.Course, {
      foreignKey: 'courseId',
      onDelete: 'CASCADE', // Delete videos if the associated course is deleted
    });
  };

  return CourseVideo;
};