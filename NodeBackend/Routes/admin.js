const express = require('express');
const router = express.Router();
const AdminMessage = require('../models/AdminMessage');
const User = require('../models/User');

// GET /api/admin/users - Get all users with pagination and filtering
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    let filter = {};
    if (role && role !== 'all') {
      filter.role = role;
    }
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { roleId: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users with pagination
    const users = await User.find(filter)
      .select('email roleId role createdAt')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    // Format users
    const formattedUsers = users.map(user => ({
      id: user._id,
      email: user.email,
      roleId: user.roleId,
      role: user.role,
      createdAt: user.createdAt,
      status: 'active' // You can add status field to User model later
    }));

    res.status(200).json({
      users: formattedUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        hasNextPage: skip + users.length < totalUsers,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/users/stats - Get user statistics
router.get('/users/stats', async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();

    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRegistrations = await User.countDocuments({
      createdAt: { $gte: today }
    });

    res.status(200).json({
      totalUsers,
      usersByRole,
      recentRegistrations,
      todayRegistrations
    });

  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/users/:userId - Update user
router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, role } = req.body;

    // Validate input
    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required' });
    }

    // Check if email already exists for another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, role },
      { new: true }
    ).select('email roleId role createdAt');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        roleId: updatedUser.roleId,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      }
    });

  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/users/:userId - Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      userId
    });

  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/logs - Get system logs with real-time data
router.get('/logs', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      level, 
      search, 
      startDate, 
      endDate 
    } = req.query;

    // Generate mock logs for demonstration (in real app, this would come from a logging system)
    const mockLogs = generateMockLogs(parseInt(limit));
    
    // Filter logs based on parameters
    let filteredLogs = mockLogs;
    
    if (level && level !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    if (search) {
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.source.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (startDate) {
      const start = new Date(startDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= end);
    }

    // Pagination
    const totalLogs = filteredLogs.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedLogs = filteredLogs.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      logs: paginatedLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLogs / parseInt(limit)),
        totalLogs,
        hasNextPage: skip + paginatedLogs.length < totalLogs,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/logs/stats - Get log statistics
router.get('/logs/stats', async (req, res) => {
  try {
    const mockLogs = generateMockLogs(1000);
    
    // Calculate statistics
    const totalLogs = mockLogs.length;
    const errorLogs = mockLogs.filter(log => log.level === 'error').length;
    const warningLogs = mockLogs.filter(log => log.level === 'warning').length;
    const infoLogs = mockLogs.filter(log => log.level === 'info').length;
    
    // Get logs by hour for the last 24 hours
    const last24Hours = mockLogs.filter(log => {
      const logTime = new Date(log.timestamp);
      const now = new Date();
      return (now - logTime) <= 24 * 60 * 60 * 1000;
    });
    
    const logsByHour = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - i);
      const hourStart = new Date(hour);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourStart.getHours() + 1);
      
      const count = last24Hours.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= hourStart && logTime < hourEnd;
      }).length;
      
      return {
        hour: hourStart.toISOString(),
        count
      };
    }).reverse();

    res.status(200).json({
      totalLogs,
      errorLogs,
      warningLogs,
      infoLogs,
      logsByHour,
      systemHealth: calculateSystemHealth(errorLogs, totalLogs)
    });

  } catch (err) {
    console.error('Error fetching log stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/reports - Get comprehensive system reports
router.get('/reports', async (req, res) => {
  try {
    const { type, period = '7d' } = req.query;
    
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get recent activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Get daily registrations for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get message statistics
    const totalMessages = await AdminMessage.countDocuments();
    const messagesByRole = await AdminMessage.aggregate([
      { $unwind: '$roles' },
      { $group: { _id: '$roles', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Calculate growth metrics
    const growthRate = await calculateGrowthRate();
    
    res.status(200).json({
      userMetrics: {
        totalUsers,
        recentUsers,
        usersByRole,
        dailyRegistrations,
        growthRate
      },
      messageMetrics: {
        totalMessages,
        messagesByRole
      },
      systemMetrics: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform
      }
    });

  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/settings - Get system settings
router.get('/settings', async (req, res) => {
  try {
    // In a real application, these would come from a settings collection or environment
    const settings = {
      system: {
        maintenanceMode: false,
        registrationEnabled: true,
        maxUsersPerRole: 1000,
        sessionTimeout: 3600,
        backupFrequency: 'daily'
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        notificationFrequency: 'realtime'
      },
      security: {
        passwordMinLength: 8,
        requireTwoFactor: false,
        maxLoginAttempts: 5,
        lockoutDuration: 15
      },
      features: {
        enableMessaging: true,
        enableReports: true,
        enableLogs: true,
        enableUserManagement: true
      }
    };

    res.status(200).json(settings);

  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/settings - Update system settings
router.put('/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    
    // In a real application, you would save these to a database
    // For now, we'll just validate and return success
    
    // Validate settings structure
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Invalid settings format' });
    }
    
    // Here you would typically save to database
    // await Settings.findOneAndUpdate({}, settings, { upsert: true });
    
    res.status(200).json({
      message: 'Settings updated successfully',
      settings
    });

  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/users-by-role
router.get('/users-by-role', async (req, res) => {
  try {
    const { role } = req.query;
    
    if (!role) {
      return res.status(400).json({ message: 'Role parameter is required' });
    }

    const users = await User.find({ role })
      .select('email roleId role createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const formattedUsers = users.map(user => ({
      id: user._id,
      email: user.email,
      roleId: user.roleId,
      role: user.role,
      createdAt: user.createdAt
    }));

    res.status(200).json({
      users: formattedUsers,
      count: formattedUsers.length
    });

  } catch (err) {
    console.error('Error fetching users by role:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/send-message
router.post('/send-message', async (req, res) => {
  try {
    const { subject, message, roles, targetUsers } = req.body;

    if (!subject || !message || !roles || !roles.length) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new AdminMessage({
      subject,
      message,
      roles,
      targetUsers: targetUsers || [], // If no specific users, message goes to all in roles
      // sentBy: req.user._id, // If using auth middleware
    });

    await newMessage.save();

    res.status(201).json({
      message: 'Message sent & stored successfully',
      data: newMessage,
    });

  } catch (err) {
    console.error('Error saving admin message:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/getMessages', async (req, res) => {
    try {
      const { role, userId } = req.query;
      console.log('Role from query:', role);
      console.log('User ID from query:', userId);

      let filter = {};
      if (role) {
        filter = { roles: role };
      }
      
      // If userId is provided, also check if this user is in targetUsers
      if (userId) {
        filter.$or = [
          { targetUsers: { $size: 0 } }, // Messages sent to all users in role
          { targetUsers: userId } // Messages specifically sent to this user
        ];
      }
      
      console.log('MongoDB filter:', filter);

      const messages = await AdminMessage.find(filter)
        .sort({ sentAt: -1 })
        .lean();
  
      const formatted = messages.map(msg => ({
        id: msg._id,
        subject: msg.subject,
        sent_at: msg.sentAt || msg.createdAt,
        content: msg.message,
      }));
  
      return res.status(200).json({ messages: formatted });
  
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ message: 'Server error while fetching messages' });
    }
  });

// Helper functions
function generateMockLogs(count) {
  const levels = ['info', 'warning', 'error'];
  const sources = ['auth', 'database', 'api', 'system', 'user'];
  const messages = [
    'User login successful',
    'Database connection established',
    'API request processed',
    'System backup completed',
    'User registration failed',
    'Password reset requested',
    'Email sent successfully',
    'File upload completed',
    'Database query executed',
    'Cache cleared',
    'Session expired',
    'Rate limit exceeded',
    'Invalid token detected',
    'Backup failed',
    'Email delivery failed'
  ];
  
  const logs = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    logs.push({
      id: `log_${i}`,
      timestamp: timestamp.toISOString(),
      level: levels[Math.floor(Math.random() * levels.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      details: `Additional details for log entry ${i}`
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function calculateSystemHealth(errorCount, totalCount) {
  if (totalCount === 0) return 100;
  const errorRate = (errorCount / totalCount) * 100;
  return Math.max(0, 100 - errorRate);
}

async function calculateGrowthRate() {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const currentWeekUsers = await User.countDocuments({
    createdAt: { $gte: lastWeek }
  });
  
  const previousWeekUsers = await User.countDocuments({
    createdAt: { $gte: twoWeeksAgo, $lt: lastWeek }
  });
  
  if (previousWeekUsers === 0) return currentWeekUsers > 0 ? 100 : 0;
  
  return ((currentWeekUsers - previousWeekUsers) / previousWeekUsers) * 100;
}

module.exports = router;
