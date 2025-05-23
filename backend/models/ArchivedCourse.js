module.exports = (sequelize, DataTypes) => {
    const ArchivedCourse = sequelize.define('ArchivedCourse', {
        archivedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
  
    return ArchivedCourse;
};
  