import notificationsRepository from "./notifications.repository.js";

export const notificationsService = {
  getNotifications: async (userId) => {
    return notificationsRepository.findByUserId(userId);
  },

  markAsRead: async (id) => {
    return notificationsRepository.markAsRead(id);
  },

  markAllAsRead: async (userId) => {
    return notificationsRepository.markAllAsRead(userId);
  },

  /**
   * สร้างแจ้งเตือนเมื่อมีการมอบหมายงาน
   * @param {Object} task - Task ที่ถูกมอบหมาย (ต้องมี id, title)
   * @param {string[]} assignedUserIds - รายชื่อ user IDs ที่ถูกมอบหมาย
   * @param {string} assignerName - ชื่อผู้มอบหมาย
   */
  createTaskAssignedNotifications: async (task, assignedUserIds, assignerName) => {
    if (!assignedUserIds || assignedUserIds.length === 0) return;

    const notifications = assignedUserIds.map((userId) => ({
      type: "assigned",
      text: `${assignerName} มอบหมายงาน "${task.title}" ให้คุณ`,
      userId,
      taskId: task.id,
    }));

    try {
      await notificationsRepository.createMany(notifications);
    } catch (error) {
      // Log but don't throw — notification failure shouldn't block main operation
      console.error("Failed to create assignment notifications:", error);
    }
  },

  /**
   * สร้างแจ้งเตือนเมื่อมี activity ใหม่บน task
   * ส่งให้ team members ทุกคน ยกเว้นผู้สร้าง activity
   * @param {Object} task - Task ที่มี activity (ต้องมี id, title, team[])
   * @param {Object} activity - Activity ที่สร้าง (ต้องมี type, activity)
   * @param {string} actorUserId - user ID ของผู้สร้าง activity
   * @param {string} actorName - ชื่อผู้สร้าง activity
   */
  createActivityNotifications: async (task, activity, actorUserId, actorName) => {
    // หา team members ทั้งหมด ยกเว้นผู้กระทำ
    const recipientIds = task.team
      .map((member) => member.id || member)
      .filter((id) => id !== actorUserId);

    if (recipientIds.length === 0) return;

    const ACTIVITY_TYPE_MAP = {
      commented: "แสดงความคิดเห็น",
      started: "เริ่มทำงาน",
      completed: "ทำเสร็จแล้ว",
      in_progress: "อยู่ระหว่างดำเนินการ",
      bug: "รายงานบัค",
      assigned: "มอบหมายงาน",
    };

    const activityLabel = ACTIVITY_TYPE_MAP[activity.type] || activity.type;
    const text = `${actorName} ${activityLabel}ในงาน "${task.title}"`;

    const notifications = recipientIds.map((userId) => ({
      type: "activity",
      text,
      userId,
      taskId: task.id,
    }));

    try {
      await notificationsRepository.createMany(notifications);
    } catch (error) {
      console.error("Failed to create activity notifications:", error);
    }
  },
};

export default notificationsService;
