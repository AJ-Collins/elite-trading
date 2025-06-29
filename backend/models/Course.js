module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      thumbnail: DataTypes.STRING, // URL or path to image
      publishedWhen: DataTypes.DATE,
      author: DataTypes.STRING,
      level: {
        type: DataTypes.STRING,
        defaultValue: 'Beginner',
      },
      archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    });
  
    Course.associate = (models) => {
      Course.belongsTo(models.Subscription, {
        foreignKey: 'subscriptionId',
      });
  
      Course.hasMany(models.CourseVideo, {
        foreignKey: 'courseId',
      });
  
      Course.hasMany(models.CourseNote, {
        foreignKey: 'courseId',
      });
  
      Course.belongsToMany(models.User, {
        through: models.ArchivedCourse,
        foreignKey: 'courseId',
        otherKey: 'userId',
        as: 'ArchivedByUsers',
      });
      Course.hasMany(models.VideoProgress, { foreignKey: 'courseId' });
      Course.hasMany(models.NoteProgress, { foreignKey: 'courseId' });
      Course.hasMany(models.CourseProgress, { foreignKey: 'courseId' });
    };
  
    return Course;
  };
  