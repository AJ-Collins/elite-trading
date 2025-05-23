const { Subscription, UserSubscription } = require('../models');
const { sequelize } = require('../models');

// Get all subscriptions
async function getAllSubscriptions (req, res) {
  try {
    const subscriptions = await Subscription.findAll({
    include: [
        {
          model: sequelize.models.Course, // Include the Course model
          attributes: [], // Don't return course details, just the count
        }
      ],
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('Courses.id')), // Count the courses
            'coursesCount'
          ]
        ]
      },
      group: ['Subscription.id'], // Group by Subscription id to ensure correct counting
    });
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

// Create a new subscription
async function createSubscription (req, res) {
  try {
    const { type, price, duration, feature, currency, benefits, isActive } = req.body;
    const newSub = await Subscription.create({
      type,
      price,
      duration,
      feature,
      currency,
      benefits,
      isActive
    });
    res.status(201).json(newSub);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

// Update a subscription
async function updateSubscription (req, res) {
  try {
    const { id } = req.params;
    const { type, price, duration, feature, currency, benefits, isActive } = req.body;
    const sub = await Subscription.findByPk(id);

    if (!sub) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await sub.update({ type, price, duration, feature, currency, benefits, isActive });
    res.json(sub);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
};

// Delete a subscription
async function deleteSubscription (req, res) {
  try {
    const { id } = req.params;
    const sub = await Subscription.findByPk(id);

    if (!sub) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await sub.destroy();
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
};

async function getUserSubscriptions(req, res) {
  try {
    const userId = req.user.id; // Provided by your auth middleware

    const userSubs = await UserSubscription.findAll({
      where: { userId },
      include: [
        {
          model: Subscription,
          as: 'subscription', // Make sure this alias matches your association
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: userSubs
    });
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch user subscriptions' });
  }
}

async function getPublicSubscriptions(req, res) {
  try {
    const subscriptions = await Subscription.findAll({
      where: { isActive: true }, // Only active plans
      order: [['price', 'ASC']], // Optional sorting
    });
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching public subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
}

async function subscribeUser(req, res) {
  const { subscriptionId } = req.body;
  const userId = req.user.id;

  const plan = await SubscriptionPlan.findByPk(subscriptionId);
  if (!plan) return res.status(400).json({ error: 'Invalid plan' });

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + plan.durationDays);

  await UserSubscription.create({
    userId,
    subscriptionId,
    startDate,
    endDate,
  });

  res.json({ success: true, message: 'Subscription activated' });
}

module.exports = {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getUserSubscriptions,
  getPublicSubscriptions,
  subscribeUser
};
