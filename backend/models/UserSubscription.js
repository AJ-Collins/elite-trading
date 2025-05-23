module.exports = (sequelize, DataTypes) => {
    const UserSubscription = sequelize.define('UserSubscription', {
      userId: DataTypes.INTEGER,
      subscriptionId: DataTypes.INTEGER,
      startDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      endDate: DataTypes.DATE,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    });

    UserSubscription.associate = (models) => {
      UserSubscription.belongsTo(models.Subscription, {
        foreignKey: 'subscriptionId',
        as: 'subscription'
      });
    
      UserSubscription.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    };
  
    return UserSubscription;
};