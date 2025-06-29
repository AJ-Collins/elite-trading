const { Course, Subscription, CourseVideo, CourseNote, ArchivedCourse, User, UserSubscription, LiveSession } = require('../models');
const { sequelize } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op, where } = require('sequelize');
const { assert } = require('console');

async function getUserFreeCourses(req, res) {
    try {
        // Step 1: Get all free subscriptions for all users
        const freeSubscriptions = await Subscription.findAll( {
            where: {
                isActive: true,
                price: 0
            },
        });

        const freeSubscriptionIds = freeSubscriptions.map(sub => sub.id);

        // Step 2: Get all courses under those subscriptions
        const freeCourses = await Course.findAll({
            where: {
            subscriptionId: freeSubscriptionIds
            },
            include: [
                { model: CourseVideo },
                { model: CourseNote }
            ]
        });


        // console.log('freeCourses: ', freeCourses);

        if (!freeSubscriptions ) {
            res.status(200).json([]); // No access
        }
    
        res.status(200).json(freeCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
}

async function getUserPremiumCourses(req, res) {
    try {
        // Step 1: Get all premium subscriptions for all users
        const userId = req.params.id;

        const premiumSubscriptions = await UserSubscription.findAll( {
            where: {
                userId: userId,
                isActive: true,
            },
        });
        // console.log('premiumSubscriptions: ', premiumSubscriptions);

        const premiumSubscriptionIds = premiumSubscriptions.map(sub => sub.subscriptionId);

        // Step 2: Get all courses under those subscriptions
        const premiumCourses = await Course.findAll({
            where: {
            subscriptionId: premiumSubscriptionIds
            },
            include: [
                { model: CourseVideo },
                { model: CourseNote }
            ]
        });


        // console.log('premiumCourses: ', premiumCourses);

        if (!premiumCourses ) {
            res.status(200).json([]);
        }
    
        res.status(200).json(premiumCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
}

async function getUserLiveSessions(req, res) {
    try {
        const userId = req.params.id;

        const premiumLiveUserSubscriptions = await UserSubscription.findAll( {
            where: {
                userId: userId,
                isActive: true,
            },
        });

        // console.log('user premium Subscriptions: ', premiumLiveUserSubscriptions);

        const premiumLiveUserSubscriptionIds = premiumLiveUserSubscriptions.map(sub => sub.subscriptionId);

        // console.log('premium live sessions ids: ', premiumLiveUserSubscriptionIds);


        // Step 2: Get all user live sessions
        const premiumLiveSessions = await LiveSession.findAll({
            attributes: {
                exclude: ['instructorId'],
            },
            include: [
                { 
                    model: Subscription, 
                    as: 'subscriptions',
                    attributes: [], 
                    through: { 
                        attributes: [],
                    },
                    where: {
                        id: premiumLiveUserSubscriptionIds,
                    },
                    required: true,
                },
                {
                    model: User,
                    as: 'instructor',
                    attributes: [ 'username'],
                },
            ],
        });

        console.log('premium live sessions: ', premiumLiveSessions);

        if (!premiumLiveSessions ) {
            res.status(200).json([]);
        }
    
        res.status(200).json(premiumLiveSessions);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses' });
    }
}

async function archiveCourse(req, res) {
    try {
      const { courseId, userId } = req.body;
  
      if (!courseId || !userId) {
        return res.status(400).json({ message: "Missing courseId or userId" });
      }
  
      // Find the course
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Set the course as archived
      course.archived = true;
      await course.save();
  
      // Create ArchivedCourse record (if it doesn't already exist)
      await ArchivedCourse.findOrCreate({
        where: { courseId, userId },
        defaults: {
          courseId,
          userId,
        },
      });
  
      res.status(200).json({ message: "Course archived successfully" });
    } catch (error) {
      console.error("Error archiving course:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}

async function unArchiveCourse(req, res) {
    try {
      const userId = req.user.id;
      const { courseId } = req.body;
  
      if (!courseId) {
        return res.status(400).json({ message: 'Missing courseId in request body' });
      }
  
      console.log(`Unarchiving course ID: ${courseId} for user ID: ${userId}`);
  
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Set the course as archived
      course.archived = false;
      await course.save();
      
      // Remove the entry from the ArchivedCourse join table
      await ArchivedCourse.destroy({
        where: {
          courseId,
          userId,
        },
      });
  
      res.status(200).json({ message: 'Course successfully unarchived' });
    } catch (error) {
      console.error('Error unarchiving course:', error);
      res.status(500).json({ message: 'Failed to unarchive course' });
    }
}

async function getArchivedCourses(req, res) {
    try {
        const userId = req.user.id;

        console.log(`Fetching archived courses for user ID: ${userId}`);

        const archivedCourses = await Course.findAll({
            include: [{
              model: User,
              as: 'ArchivedByUsers',
              where: { id: userId },
              through: { attributes: [] },
              attributes: [],
              required: true,
            }],
        });

        archivedCourses.forEach((course, index) => {
            console.log(`  ${index + 1}. ${course.title} (ID: ${course.id})`);
        });

        res.status(200).json(archivedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
}

module.exports = {
    getUserFreeCourses,
    getUserPremiumCourses,
    getUserLiveSessions,
    archiveCourse,
    unArchiveCourse,
    getArchivedCourses
}