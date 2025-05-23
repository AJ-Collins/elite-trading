module.exports = (sequelize, DataTypes) => {
  const CourseNote = sequelize.define(
    'CourseNote',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING, // Stores file path for uploaded files
        allowNull: false,
      },
      isLocal: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // True for uploaded files
      },
      type: {
        type: DataTypes.ENUM('PDF', 'Image', 'Slides'),
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      access: {
        type: DataTypes.ENUM('Free', 'Premium'),
        allowNull: false,
      },
    },
    {
      timestamps: true, // Enable createdAt and updatedAt
      paranoid: true, // Enable soft deletes
    }
  );

  CourseNote.associate = (models) => {
    CourseNote.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
      onDelete: 'CASCADE',
    });
  };

  return CourseNote;
};