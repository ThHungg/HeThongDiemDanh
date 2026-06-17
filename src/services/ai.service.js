const { getVietnamTime } = require("../utils/getVietnamTime");
const { getWeekRange } = require("../utils/getWeekRange");
const { getMonthRange } = require("../utils/getMonthRange");

const filterAllStudentsTool = {
  type: "function",
  function: {
    name: "get_all_students_filters",
    description:
      "Trich xuat tham so loc de tim kiem sinh vien dua tren cau hoi cua Thu ky Khoa.",
    parameters: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Ten hoac Ma sinh vien can tim.",
        },
        khoa: {
          type: "string",
          description: "Khoa tuyen sinh (VD: '34' hoac '34,35').",
        },
        nganh: {
          type: "string",
          description: "Nganh hoc viet tat (VD: 'TT' hoac 'TT,PM').",
        },
        maLop: {
          type: "string",
          description:
            "Ma lop chuyen nganh (VD: 'TT35CL07' hoac 'TT35CL07,PM34CL02').",
        },
        minScore: {
          type: "number",
          description: "Diem chuyen can toi thieu (0-10).",
        },
        maxScore: {
          type: "number",
          description: "Diem chuyen can toi da (0-10).",
        },
        startDate: {
          type: "string",
          description: "Ngay bat dau tim kiem (YYYY-MM-DD).",
        },
        endDate: {
          type: "string",
          description: "Ngay ket thuc tim kiem (YYYY-MM-DD).",
        },
      },
    },
  },
};

const geminiApiKey = process.env.GEMINI_API_KEY;
const orimiseApiKey = process.env.ORIMISE_KEY;

const AIService = async (userMessage) => {
  if (!geminiApiKey && !orimiseApiKey) {
    return {
      status: "Err",
      message: "Tro ly AI dang ban, vui long thu lai sau.",
    };
  }

  const vnTime = getVietnamTime();
  const year = vnTime.getFullYear();
  const month = String(vnTime.getMonth() + 1).padStart(2, "0");
  const date = String(vnTime.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${date}`;

  // Tinh toan cac khoang thoi gian relative
  const thisWeek = getWeekRange(vnTime);

  const lastWeekTime = new Date(vnTime);
  lastWeekTime.setDate(vnTime.getDate() - 7);
  const lastWeek = getWeekRange(lastWeekTime);

  const thisMonth = getMonthRange(vnTime);

  const dynamicInstruction = `Ban la Tro ly AI ho tro Thu ky Khoa quan ly du lieu sinh vien.
Nhiem vu: Nhan cau lenh tu nhien, phan tich va tra ve JSON chua tham so goi ham get_all_students_filters.
Thoi gian hien tai (Hom nay): Ngay ${date} thang ${month} nam ${year} (hoac ${todayStr}).
Quy tac:
1. "cam thi", "rot mon", "canh bao" -> maxScore = 3.9.
2. "xuat sac", "diem tuyet doi", "khong cup hoc" -> minScore = 9, maxScore = 10.
3. Neu cau hoi yeu cau loc nhieu khoa, nhieu nganh hoac nhieu lop, hay liet ke tat ca cac gia tri ngan cach boi dau phay trong truong tuong ung (VD: khoa = "34,35"; nganh = "TT,PM"; maLop = "TT35CL07,PM34CL02").
4. Neu nguoi dung chi nhap ngay va thang (vi du: "10/06" hoac "10 thang 6") ma khong co nam, hay lay nam hien tai (${year}) lam nam mac dinh de dien vao filter (vi du: "${year}-06-10").
5. "Hom nay" hoac "nay" luon tuong ung voi ngay ${todayStr}.
6. Khi nguoi dung dung cac tu khoa thoi gian tuong doi, hay anh xa ve cac khoang ngay duoc tinh san duoi day:
   - "Tuan nay": tu ngay ${thisWeek.startDate} den ngay ${thisWeek.endDate}
   - "Tuan truoc": tu ngay ${lastWeek.startDate} den ngay ${lastWeek.endDate}
   - "Thang nay": tu ngay ${thisMonth.startDate} den ngay ${thisMonth.endDate}
7. "khong di hoc" -> minScore = 0, maxScore = 0.
Chi tra ve chuoi JSON hop le, tuyet doi khong giai thich van ban.`;

  try {
    let response;
    let usedBackup = false;

    // Thu goi truc tiep Google Gemini API truoc
    if (geminiApiKey) {
      try {
        console.log("Calling Google Gemini API directly...");
        response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${geminiApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gemini-2.5-flash",
              messages: [
                { role: "system", content: dynamicInstruction },
                { role: "user", content: userMessage },
              ],
              tools: [filterAllStudentsTool],
              tool_choice: {
                type: "function",
                function: { name: "get_all_students_filters" },
              },
            }),
          },
        );

        if (!response.ok) {
          console.warn(
            `Direct Google Gemini API failed with status ${response.status}. Falling back to Orimise...`,
          );
          response = null; // Kich hoat fallback
        }
      } catch (err) {
        console.error(
          "Direct Google Gemini API connection error:",
          err.message,
          "Falling back to Orimise...",
        );
        response = null; // Kich hoat fallback
      }
    }

    // Backup: Neu goi truc tiep loi hoac khong co key Google, goi qua Orimise proxy
    if (!response) {
      if (!orimiseApiKey) {
        return {
          status: "Err",
          message: "Tro ly AI dang ban, vui long thu lai sau.",
        };
      }

      console.log("Calling Orimise API backup...");
      try {
        response = await fetch("https://api.orimise.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${orimiseApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash",
            messages: [
              { role: "system", content: dynamicInstruction },
              { role: "user", content: userMessage },
            ],
            tools: [filterAllStudentsTool],
            tool_choice: {
              type: "function",
              function: { name: "get_all_students_filters" },
            },
          }),
        });
        usedBackup = true;
      } catch (err) {
        console.error("Orimise API connection error:", err.message);
        return {
          status: "Err",
          message: "Tro ly AI dang ban, vui long thu lai sau.",
        };
      }
    }

    if (!response || !response.ok) {
      console.error(`Both AI API calls failed (usedBackup: ${usedBackup})`);
      return {
        status: "Err",
        message: "Tro ly AI dang ban, vui long thu lai sau.",
      };
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;
    if (!message) return null;

    // 1. Try parsing OpenAI tool_calls if returned
    const toolCall = message.tool_calls?.[0];
    if (toolCall && toolCall.function?.name === "get_all_students_filters") {
      return JSON.parse(toolCall.function.arguments);
    }

    // 2. Fallback: Parse the JSON string from content
    if (message.content) {
      try {
        const text = message.content.trim();
        const jsonText = text.replace(/^```json\s*|```$/gi, "").trim();
        return JSON.parse(jsonText);
      } catch (e) {
        const match = message.content.match(/\{[\s\S]*?\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch (err) {
            console.error("Failed to parse regex-extracted JSON:", err);
          }
        }
      }
    }

    console.log("No tool call or parseable content in AI response:", data);
    return null;
  } catch (error) {
    console.error("AIService error:", error);
    return {
      status: "Err",
      message: "Tro ly AI dang ban, vui long thu lai sau.",
    };
  }
};

module.exports = { AIService };
