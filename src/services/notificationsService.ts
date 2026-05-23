import axiosInstance from "./axiosInstance";

export const sendEmailService = async (
  listMsv: string[],
  classCode: string,
  subject: string,
  content: string,
) => {
  try {
    const res = await axiosInstance.post("/notifications/sendEmail", {
      listMsv,
      subject,
      content,
      classCode,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const sendEmailToStudentsService = async (
  msv: string,
  classCode: string,
  subject: string,
  content: string,
) => {
  return sendEmailService([msv], classCode, subject, content);
};

// Backward compatibility - pass array directly
export const sendBulkEmailToStudentsService = async (
  listMsv: string[],
  classCode: string,
  subject: string,
  content: string,
) => {
  return sendEmailService(listMsv, classCode, subject, content);
};
