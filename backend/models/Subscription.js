module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
      type: DataTypes.STRING,
      price: DataTypes.FLOAT,
      duration: DataTypes.INTEGER, // in days
      feature: DataTypes.STRING,
      currency: DataTypes.STRING,
      benefits: DataTypes.JSON,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    });
  
    Subscription.associate = (models) => {
      Subscription.belongsToMany(models.User, {
        through: models.UserSubscription,
        foreignKey: 'subscriptionId',
      });
      Subscription.hasMany(models.Course, { foreignKey: 'subscriptionId' });
    };
  
    return Subscription;
  };
  