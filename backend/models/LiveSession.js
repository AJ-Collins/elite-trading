module.exports = (sequelize, DataTypes) => {
    const LiveSession = sequelize.define('LiveSession', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Thumbnail stored as a string URL or file path (optional)
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    }, {
      tableName: 'live_sessions',
      timestamps: true,
    });
  
    LiveSession.associate = (models) => {
      // One instructor per live session (User)
      LiveSession.belongsTo(models.User, {
        foreignKey: 'instructorId',
        as: 'instructor',
      });
  
      // Many-to-many with Subscriptions, a session can be linked to many subscriptions
      LiveSession.belongsToMany(models.Subscription, {
        through: 'LiveSessionSubscriptions',
        foreignKey: 'liveSessionId',
        otherKey: 'subscriptionId',
        as: 'subscriptions',
      });
    };
  
    return LiveSession;
  };
  