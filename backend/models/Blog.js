module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define(
      'Blog',
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        excerpt: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING, // Stores file path for uploaded images or URL
          allowNull: true,
        },
        isLocalImage: {
          type: DataTypes.BOOLEAN,
          defaultValue: true, // True for uploaded images
        },
        category: {
          type: DataTypes.STRING, // e.g., trading, brokers, prop-firms, events
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM('Active', 'Locked'),
          defaultValue: 'Active',
          allowNull: false,
        },
        reported: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        views: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        comments: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        timestamps: true, // Enable createdAt and updatedAt
        paranoid: true, // Enable soft deletes
      }
    );
  
    Blog.associate = (models) => {
      Blog.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course',
        onDelete: 'SET NULL', // Keep blog if course is deleted
        allowNull: true,
      });
    };
  
    return Blog;
  };