import User from "../../models/User.js";

// Get all creative domain users
export const getCreativeUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query for creative domain users
    let query = { domain: "Creatives" };

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
      message: "Creative users retrieved successfully",
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
    console.error("Get creative users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single creative user details
export const getCreativeUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      domain: "Creatives",
    }).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "Creative user not found" });
    }

    res.status(200).json({
      message: "Creative user retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Get creative user error:", error);
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
      { _id: userId, domain: "Creatives" },
      { 
        status,
        notes: notes || "",
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "Creative user not found" });
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

// Send task to creative users
export const sendTaskToUsers = async (req, res) => {
  try {
    const { userIds, taskTitle, taskDescription, deadline, priority } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "User IDs array is required" });
    }

    if (!taskTitle || !taskDescription) {
      return res.status(400).json({ message: "Task title and description are required" });
    }

    // Verify all users are from creative domain
    const users = await User.find({
      _id: { $in: userIds },
      domain: "Creatives",
    });

    if (users.length !== userIds.length) {
      return res.status(400).json({ 
        message: "Some users are not from creative domain or don't exist" 
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
      message: `Task sent to ${userIds.length} creative users successfully`,
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

// Get creative domain statistics
export const getCreativeStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ domain: "Creatives" });
    const activeUsers = await User.countDocuments({ domain: "Creatives", status: "active" });
    const shortlistedUsers = await User.countDocuments({ domain: "Creatives", status: "shortlisted" });
    const rejectedUsers = await User.countDocuments({ domain: "Creatives", status: "rejected" });
    const omittedUsers = await User.countDocuments({ domain: "Creatives", status: "omitted" });

    // Get users by year of study
    const year1Users = await User.countDocuments({ domain: "Creatives", yearOfStudy: 1 });
    const year2Users = await User.countDocuments({ domain: "Creatives", yearOfStudy: 2 });

    // Get users by branch
    const branchStats = await User.aggregate([
      { $match: { domain: "Creatives" } },
      { $group: { _id: "$branch", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      message: "Creative domain statistics retrieved successfully",
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
    console.error("Get creative stats error:", error);
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
        domain: "Creatives"
      },
      { 
        status,
        notes: notes || "",
        updatedAt: new Date(),
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No creative users found with provided IDs" });
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

// Get shortlisted creative users
export const getShortlistedUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query for shortlisted creative users
    let query = { 
      domain: "Creatives",
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
      message: "Shortlisted creative users retrieved successfully",
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
    console.error("Get shortlisted creative users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send task email to shortlisted creative users
export const sendTaskEmailToShortlisted = async (req, res) => {
  try {
    const { taskTitle, taskDescription, deadline, priority, emailSubject, emailBody } = req.body;

    if (!taskTitle || !taskDescription) {
      return res.status(400).json({ message: "Task title and description are required" });
    }

    if (!emailSubject || !emailBody) {
      return res.status(400).json({ message: "Email subject and body are required" });
    }

    // Get all shortlisted creative users
    const shortlistedUsers = await User.find({
      domain: "Creatives",
      status: "shortlisted"
    });

    if (shortlistedUsers.length === 0) {
      return res.status(404).json({ message: "No shortlisted creative users found" });
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
    console.log(`Email to be sent to ${shortlistedUsers.length} shortlisted creative users:`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body: ${emailBody}`);
    console.log(`Task: ${taskTitle} - ${taskDescription}`);

    res.status(200).json({
      message: `Task assigned and email prepared for ${shortlistedUsers.length} shortlisted creative users`,
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
  getCreativeUsers,
  getCreativeUserById,
  updateUserStatus,
  sendTaskToUsers,
  getCreativeStats,
  bulkUpdateUserStatus,
  getShortlistedUsers,
  sendTaskEmailToShortlisted,
};
