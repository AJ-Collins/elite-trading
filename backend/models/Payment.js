module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      amount: DataTypes.FLOAT,
      paymentMethod: DataTypes.STRING, // e.g., 'mpesa', 'binance', 'stripe'
      status: { type: DataTypes.STRING, defaultValue: 'completed' },
      transactionId: DataTypes.STRING,
    });
  
    Payment.associate = (models) => {
      Payment.belongsTo(models.User, { foreignKey: 'userId' });
      Payment.belongsTo(models.Subscription, { foreignKey: 'subscriptionId' });
    };
  
    return Payment;
};