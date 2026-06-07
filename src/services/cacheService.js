const redis = require("../config/redis");

// Cache TTL constants (in seconds)
// const CACHE_TTL = {
//   SHORT: 5 * 60,
//   MEDIUM: 30 * 60,
//   LONG: 2 * 60 * 60,
//   VERY_LONG: 24 * 60 * 60,
// };

const CACHE_TTL = {
  SHORT: 0,
  MEDIUM: 0,
  LONG: 0,
  VERY_LONG: 0,
};

// Cache key patterns
const CACHE_KEYS = {
  // Semester
  CURRENT_SEMESTER: "semester:current",
  ALL_SEMESTERS: "semester:all",

  // Lecturer Classes
  LECTURER_CLASSES: (lecturerId, semester) =>
    `lecturer:${lecturerId}:classes:${semester}`,
  LECTURER_CLASS_DETAIL: (classCode) => `lecturer:class:${classCode}`,
  LECTURER_CURRENT_CLASSES: (lecturerId) =>
    `lecturer:${lecturerId}:current_classes`,

  // All Classes (Admin)
  ALL_CLASSES: (semester, page, limit, lecturerId, searchText) =>
    `classes:all:${semester}:p${page}:l${limit}:lec${lecturerId || "all"}:s${searchText || ""}`,
  ALL_LECTURERS: "lecturers:all",

  // Student Classes
  STUDENT_CLASSES: (studentId, semester) =>
    `student:${studentId}:classes:${semester}`,
  STUDENT_CLASS_DETAIL: (studentId, classCode) =>
    `student:${studentId}:class:${classCode}`,

  // All Students
  ALL_STUDENTS: (semester, page, limit, filters) =>
    `students:all:${semester}:p${page}:l${limit}:f${JSON.stringify(filters)}`,

  // Attendance
  ATTENDANCE_BY_CLASS: (classCode) => `attendance:class:${classCode}`,
  STUDENT_ATTENDANCE: (studentId, classCode) =>
    `attendance:student:${studentId}:class:${classCode}`,
  CLASS_SESSIONS: (classCode) => `sessions:class:${classCode}`,

  // Conduct Score
  CONDUCT_SCORE: (registrationId) => `conduct:registration:${registrationId}`,
};

const get = async (key) => {
  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`[Cache HIT] ${key}`);
      return JSON.parse(data);
    }
    console.log(`[Cache MISS] ${key}`);
    return null;
  } catch (error) {
    console.error(`[Cache GET Error] ${key}:`, error);
    return null;
  }
};

const set = async (key, value, ttl = CACHE_TTL.MEDIUM) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    console.log(`[Cache SET] ${key} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    console.error(`[Cache SET Error] ${key}:`, error);
    return false;
  }
};

const del = async (key) => {
  try {
    const result = await redis.del(key);
    if (result > 0) {
      console.log(`[Cache DELETE] ${key}`);
    }
    return result > 0;
  } catch (error) {
    console.error(`[Cache DELETE Error] ${key}:`, error);
    return false;
  }
};

const mDel = async (keys) => {
  if (keys.length === 0) return true;
  try {
    const result = await redis.del(...keys);
    console.log(`[Cache MDELETE] Deleted ${result} keys`);
    return result > 0;
  } catch (error) {
    console.error(`[Cache MDELETE Error]:`, error);
    return false;
  }
};

const clearByPattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) return 0;

    const result = await redis.del(...keys);
    console.log(`[Cache CLEAR PATTERN] ${pattern} - Deleted ${result} keys`);
    return result;
  } catch (error) {
    console.error(`[Cache CLEAR PATTERN Error] ${pattern}:`, error);
    return 0;
  }
};

const invalidate = {
  // Semester
  semester: async () => {
    await mDel([CACHE_KEYS.CURRENT_SEMESTER, CACHE_KEYS.ALL_SEMESTERS]);
  },

  // All classes related to lecturer
  lecturerClasses: async (lecturerId) => {
    await clearByPattern(`lecturer:${lecturerId}:*`);
    await clearByPattern("classes:all:*");
  },

  // All classes related to a specific class
  classData: async (classCode) => {
    await mDel([
      CACHE_KEYS.LECTURER_CLASS_DETAIL(classCode),
      CACHE_KEYS.CLASS_SESSIONS(classCode),
      CACHE_KEYS.ATTENDANCE_BY_CLASS(classCode),
    ]);
    // Clear all classes list
    await clearByPattern("classes:all:*");
  },

  // Student classes
  studentClasses: async (studentId) => {
    await clearByPattern(`student:${studentId}:*`);
  },

  // All students list
  allStudents: async () => {
    await clearByPattern("students:all:*");
  },

  // Attendance
  attendance: async (classCode, studentId = null) => {
    const keysToDelete = [CACHE_KEYS.ATTENDANCE_BY_CLASS(classCode)];
    if (studentId) {
      keysToDelete.push(CACHE_KEYS.STUDENT_ATTENDANCE(studentId, classCode));
    } else {
      // Clear all student attendance for this class
      await clearByPattern(`attendance:student:*:class:${classCode}`);
    }
    await mDel(keysToDelete);
  },

  // Conduct score
  conductScore: async (registrationId, classCode = null) => {
    const keysToDelete = [CACHE_KEYS.CONDUCT_SCORE(registrationId)];
    await mDel(keysToDelete);
    if (classCode) {
      await invalidate.attendance(classCode);
    }
  },

  // Clear all cache
  all: async () => {
    try {
      await redis.flushdb();
      console.log("[Cache FLUSH ALL]");
      return true;
    } catch (error) {
      console.error("[Cache FLUSH ALL Error]:", error);
      return false;
    }
  },
};

const withCache = async (key, fn, ttl = CACHE_TTL.MEDIUM) => {
  try {
    // Try to get from cache
    const cached = await get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function
    const result = await fn();

    // Cache the result
    if (result !== null && result !== undefined) {
      await set(key, result, ttl);
    }

    return result;
  } catch (error) {
    console.error(`[Cache withCache Error] ${key}:`, error);
    // Return function result even if caching fails
    return fn();
  }
};

module.exports = {
  get,
  set,
  del,
  mDel,
  clearByPattern,
  invalidate,
  withCache,
  CACHE_TTL,
  CACHE_KEYS,
};
