const { GoogleGenerativeAI } = require("@google/generative-ai");

const filterAllStudentsTool = {
  name: "get_all_students_filters",
  description:
    "Trich xuat tham so loc de tim kiem sinh vien dua tren cau hoi cua Thu ky Khoa.",
  parameters: {
    type: "OBJECT",
    properties: {
      search: {
        type: "STRING",
        description:
          "Ten hoac Ma sinh vien can tim. Vi du: 'Tim Nguyen Van A' -> 'Nguyen Van A'.",
      },
      maLop: {
        type: "STRING",
        description:
          "Ma lop chuyen nganh. Vi du: 'lop TT35CL07' -> 'TT35CL07'.",
      },
      minScore: {
        type: "NUMBER",
        description:
          "Diem chuyen can toi thieu (0-10). Vi du: 'diem lon hon 5' -> 5.",
      },
      maxScore: {
        type: "NUMBER",
        description:
          "Diem chuyen can toi da. Neu nhac 'cam thi', 'rot mon', 'bao dong' -> 3.9.",
      },
      startDate: {
        type: "STRING",
        description: "Ngay bat dau tim kiem (YYYY-MM-DD).",
      },
      endDate: {
        type: "STRING",
        description: "Ngay ket thuc tim kiem (YYYY-MM-DD).",
      },
    },
  },
};

const systemInstruction = `Ban la Tro ly AI ho tro Thu ky Khoa quan ly du lieu sinh vien.
Nhiem vu: Nhan cau lenh tu nhien, phan tich va goi ham get_all_students_filters.
Quy tac:
1. "cam thi", "rot mon", "canh bao" -> maxScore = 3.9.
2. "xuat sac", "diem tuyet doi", "khong cup hoc" -> minScore = 9, maxScore = 10.
Chi tra ve tham so goi ham, tuyet doi khong giai thich van ban.`;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI
  ? genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ functionDeclarations: [filterAllStudentsTool] }],
      systemInstruction,
    })
  : null;

const AIService = async (userMessage) => {
  console.log("model", model);
  if (!model) {
    console.log(model);
    return {
      status: "Err",
      message: "Tro ly AI dang ban, vui long thu lai sau.",
    };
  }

  try {
    const result = await model.generateContent(userMessage);
    const response = result.response;
    console.log("result", result);
    console.log("response", response);

    const functionCall = response.functionCalls()?.[0];
    if (functionCall && functionCall.name === "get_all_students_filters") {
      return functionCall.args;
    }
    console.log("functionCall", functionCall.args);
    return null;
  } catch (error) {
    return {
      status: "Err",
      message: "Tro ly AI dang ban, vui long thu lai sau.",
    };
  }
};

module.exports = { AIService };
