import User from "../../models/User.js";

// Get all technical domain users
export const getTechnicalUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query for technical domain users
    let query = { domain: "Technical" };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { srmEmail: { $regex: search, $options: "i" } },
        { regNo: { $regex: search, $options: "i" } },
        { branch: { $regex: search, $options: "i" } },
      ];
    }

    // Get users with pagination
    const users = await User.find(query)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      message: "Technical users retrieved successfully",
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get technical users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single technical user details
export const getTechnicalUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      domain: "Technical",
    }).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "Technical user not found" });
    }

    res.status(200).json({
      message: "Technical user retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Get technical user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user status (omit from further recruitments)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["active", "shortlisted", "rejected", "omitted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be: active, shortlisted, rejected, or omitted" 
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, domain: "Technical" },
      { 
        status,
        notes: notes || "",
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "Technical user not found" });
    }

    res.status(200).json({
      message: `User status updated to ${status} successfully`,
      user,
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send task to technical users
export const sendTaskToUsers = async (req, res) => {
  try {
    const { userIds, taskTitle, taskDescription, deadline, priority } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "User IDs array is required" });
    }

    if (!taskTitle || !taskDescription) {
      return res.status(400).json({ message: "Task title and description are required" });
    }

    // Verify all users are from technical domain
    const users = await User.find({
      _id: { $in: userIds },
      domain: "Technical",
    });

    if (users.length !== userIds.length) {
      return res.status(400).json({ 
        message: "Some users are not from technical domain or don't exist" 
      });
    }

    // Create task object
    const task = {
      title: taskTitle,
      description: taskDescription,
      deadline: deadline || null,
      priority: priority || "medium",
      status: "assigned",
      assignedBy: req.adminId,
      assignedAt: new Date(),
      users: userIds,
    };

    // Update users with task assignment
    await User.updateMany(
      { _id: { $in: userIds } },
      { 
        $push: { 
          tasks: task,
        },
        $set: { 
          lastTaskAssigned: new Date(),
        }
      }
    );

    res.status(200).json({
      message: `Task sent to ${userIds.length} technical users successfully`,
      task,
      assignedUsers: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        regNo: user.regNo,
      })),
    });
  } catch (error) {
    console.error("Send task error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get technical domain statistics
export const getTechnicalStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ domain: "Technical" });
    const activeUsers = await User.countDocuments({ domain: "Technical", status: "active" });
    const shortlistedUsers = await User.countDocuments({ domain: "Technical", status: "shortlisted" });
    const rejectedUsers = await User.countDocuments({ domain: "Technical", status: "rejected" });
    const omittedUsers = await User.countDocuments({ domain: "Technical", status: "omitted" });

    // Get users by year of study
    const year1Users = await User.countDocuments({ domain: "Technical", yearOfStudy: 1 });
    const year2Users = await User.countDocuments({ domain: "Technical", yearOfStudy: 2 });

    // Get users by branch
    const branchStats = await User.aggregate([
      { $match: { domain: "Technical" } },
      { $group: { _id: "$branch", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      message: "Technical domain statistics retrieved successfully",
      stats: {
        totalUsers,
        statusBreakdown: {
          active: activeUsers,
          shortlisted: shortlistedUsers,
          rejected: rejectedUsers,
          omitted: omittedUsers,
        },
        yearBreakdown: {
          year1: year1Users,
          year2: year2Users,
        },
        branchBreakdown: branchStats,
      },
    });
  } catch (error) {
    console.error("Get technical stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Bulk update user status
export const bulkUpdateUserStatus = async (req, res) => {
  try {
    const { userIds, status, notes } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "User IDs array is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["active", "shortlisted", "rejected", "omitted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be: active, shortlisted, rejected, or omitted" 
      });
    }

    // Update multiple users
    const result = await User.updateMany(
      { 
        _id: { $in: userIds },
        domain: "Technical"
      },
      { 
        status,
        notes: notes || "",
        updatedAt: new Date(),
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No technical users found with provided IDs" });
    }

    res.status(200).json({
      message: `Status updated to ${status} for ${result.modifiedCount} users successfully`,
      updatedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    });
  } catch (error) {
    console.error("Bulk update user status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get shortlisted technical users
export const getShortlistedUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query for shortlisted technical users
    let query = { 
      domain: "Technical",
      status: "shortlisted"
    };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { srmEmail: { $regex: search, $options: "i" } },
        { regNo: { $regex: search, $options: "i" } },
        { branch: { $regex: search, $options: "i" } },
      ];
    }

    // Get shortlisted users with pagination
    const users = await User.find(query)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      message: "Shortlisted technical users retrieved successfully",
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get shortlisted technical users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send task email to shortlisted technical users
export const sendTaskEmailToShortlisted = async (req, res) => {
  try {
    const { taskTitle, taskDescription, deadline, priority, emailSubject, emailBody } = req.body;

    if (!taskTitle || !taskDescription) {
      return res.status(400).json({ message: "Task title and description are required" });
    }

    if (!emailSubject || !emailBody) {
      return res.status(400).json({ message: "Email subject and body are required" });
    }

    // Get all shortlisted technical users
    const shortlistedUsers = await User.find({
      domain: "Technical",
      status: "shortlisted"
    });

    if (shortlistedUsers.length === 0) {
      return res.status(404).json({ message: "No shortlisted technical users found" });
    }

    const userIds = shortlistedUsers.map(user => user._id);

    // Create task object
    const task = {
      title: taskTitle,
      description: taskDescription,
      deadline: deadline || null,
      priority: priority || "medium",
      status: "assigned",
      assignedBy: req.adminId,
      assignedAt: new Date(),
      users: userIds,
    };

    // Update users with task assignment
    await User.updateMany(
      { _id: { $in: userIds } },
      { 
        $push: { 
          tasks: task,
        },
        $set: { 
          lastTaskAssigned: new Date(),
        }
      }
    );

    // TODO: Send emails to all shortlisted users
    // This would integrate with your email service
    // For now, we'll just log the email details
    console.log(`Email to be sent to ${shortlistedUsers.length} shortlisted technical users:`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body: ${emailBody}`);
    console.log(`Task: ${taskTitle} - ${taskDescription}`);

    res.status(200).json({
      message: `Task assigned and email prepared for ${shortlistedUsers.length} shortlisted technical users`,
      task,
      emailDetails: {
        subject: emailSubject,
        body: emailBody,
        recipients: shortlistedUsers.length,
      },
      assignedUsers: shortlistedUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        regNo: user.regNo,
      })),
    });
  } catch (error) {
    console.error("Send task email to shortlisted error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getTechnicalUsers,
  getTechnicalUserById,
  updateUserStatus,
  sendTaskToUsers,
  getTechnicalStats,
  bulkUpdateUserStatus,
  getShortlistedUsers,
  sendTaskEmailToShortlisted,
};
