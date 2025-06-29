const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('./user')(sequelize, DataTypes);
const Subscription = require('./Subscription')(sequelize, DataTypes);
const UserSubscription = require('./UserSubscription')(sequelize, DataTypes);
const Course = require('./Course')(sequelize, DataTypes);
const CourseVideo = require('./CourseVideo')(sequelize, DataTypes);
const CourseNote = require('./CourseNote')(sequelize, DataTypes);
const ArchivedCourse = require('./ArchivedCourse')(sequelize, DataTypes);
const Payment = require('./Payment')(sequelize, DataTypes);
const Blog = require('./Blog')(sequelize, DataTypes);
const LiveSession = require('./LiveSession')(sequelize, DataTypes);
const NoteProgress = require('./NoteProgress')(sequelize, DataTypes);
const VideoProgress = require('./VideoProgress')(sequelize, DataTypes);
const CourseProgress = require('./CourseProgress')(sequelize, DataTypes);

// Set up associations
if (User.associate) User.associate({ Subscription, UserSubscription, Course, ArchivedCourse, Payment });
if (Subscription.associate) Subscription.associate({ User, Course, UserSubscription });
if (UserSubscription.associate) UserSubscription.associate({ User, Subscription });
if (Course.associate) Course.associate({ Subscription, CourseVideo, CourseNote, User, ArchivedCourse, CourseProgress, VideoProgress, NoteProgress });
if (CourseVideo.associate) CourseVideo.associate({ Course });
if (CourseNote.associate) CourseNote.associate({ Course });
if (ArchivedCourse.associate) ArchivedCourse.associate({ User, Course });
if (Payment.associate) Payment.associate({ User, Subscription });
if (Blog.associate) Blog.associate({ Course });
if (LiveSession.associate) LiveSession.associate({ User, Subscription });
if (NoteProgress.associate) NoteProgress.associate({ User, Course, CourseNote });
if (VideoProgress.associate) VideoProgress.associate({ User, Course, CourseVideo });
if (CourseProgress.associate) CourseProgress.associate({ User, Course });

module.exports = {
  sequelize,
  User,
  Subscription,
  UserSubscription,
  Course,
  CourseVideo,
  CourseNote,
  ArchivedCourse,
  Payment,
  Blog,
  LiveSession,
  NoteProgress, 
  VideoProgress,
  CourseProgress 
};