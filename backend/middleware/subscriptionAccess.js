const { UserSubscription, Course } = require('../models');
const { Op } = require('sequelize');

const checkCourseAccess = async (req, res, next) => {
  const userId = req.user.id;
  const courseId = req.params.id;

  const course = await Course.findByPk(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const validSub = await UserSubscription.findOne({
    where: {
      userId,
      subscriptionId: course.subscriptionId,
      isActive: true,
      startDate: { [Op.lte]: new Date() },
      endDate: { [Op.gte]: new Date() },
    },
  });

  if (!validSub) {
    return res.status(403).json({ message: 'You must have an active subscription to access this course.' });
  }

  next(); // user has access
};

module.exports = checkCourseAccess;
