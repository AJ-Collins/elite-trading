module.exports = (sequelize, DataTypes) => {
    const NoteProgress = sequelize.define('NoteProgress', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      noteId: {
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
          fields: ['userId', 'courseId', 'noteId'], // Ensure one record per user-course-note
        },
      ],
    });
  
    NoteProgress.associate = (models) => {
      NoteProgress.belongsTo(models.User, { foreignKey: 'userId' });
      NoteProgress.belongsTo(models.Course, { foreignKey: 'courseId' });
      NoteProgress.belongsTo(models.CourseNote, { foreignKey: 'noteId' });
    };
  
    return NoteProgress;
  };