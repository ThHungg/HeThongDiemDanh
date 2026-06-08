
const cacheService = require("../services/cacheService");

const clearCacheBeforeUpdate = {
  classData: async (req, res, next) => {
    const { classCode } = req.params;
    if (classCode) {
      await cacheService.invalidate.classData(classCode);
    }
    next();
  },

  lecturerClasses: async (req, res, next) => {
    const lecturerId = req.user?.code;
    if (lecturerId) {
      await cacheService.invalidate.lecturerClasses(lecturerId);
    }
    next();
  },

  studentClasses: async (req, res, next) => {
    const studentId = req.user?.code;
    if (studentId) {
      await cacheService.invalidate.studentClasses(studentId);
    }
    next();
  },

  allStudents: async (req, res, next) => {
    await cacheService.invalidate.allStudents();
    next();
  },

  semester: async (req, res, next) => {
    await cacheService.invalidate.semester();
    next();
  },

  attendance: async (req, res, next) => {
    const { classCode } = req.params || req.body;
    if (classCode) {
      await cacheService.invalidate.attendance(classCode);
    }
    next();
  },
};

const invalidateCacheAfter = async (cacheType, result, options = {}) => {
  if (result && result.status === "Ok") {
    switch (cacheType) {
      case "classData":
        if (options.classCode) {
          await cacheService.invalidate.classData(options.classCode);
        }
        break;
      case "lecturerClasses":
        if (options.lecturerId) {
          await cacheService.invalidate.lecturerClasses(options.lecturerId);
        }
        break;
      case "studentClasses":
        if (options.studentId) {
          await cacheService.invalidate.studentClasses(options.studentId);
        }
        break;
      case "attendance":
        if (options.classCode) {
          const studentId = options.studentId || null;
          await cacheService.invalidate.attendance(
            options.classCode,
            studentId,
          );
        }
        break;
      case "semester":
        await cacheService.invalidate.semester();
        break;
      case "allStudents":
        await cacheService.invalidate.allStudents();
        break;
      default:
        break;
    }
  }
  return result;
};


const clearAllCache = async (req, res, next) => {
  const result = await cacheService.invalidate.all();
  if (result) {
    res.json({
      status: "Ok",
      message: "Cache cleared successfully",
    });
  } else {
    res.status(500).json({
      status: "Err",
      message: "Failed to clear cache",
    });
  }
};

const getCacheStats = async (req, res, next) => {
  try {
    const redis = require("../config/redis");
    const info = await redis.info("stats");
    const dbSize = await redis.dbsize();

    res.json({
      status: "Ok",
      data: {
        stats: info,
        dbSize,
        totalKeys: dbSize,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Err",
      message: error.message,
    });
  }
};

module.exports = {
  clearCacheBeforeUpdate,
  invalidateCacheAfter,
  clearAllCache,
  getCacheStats,
};
