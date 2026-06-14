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

const systemInstruction = `Ban la Tro ly AI ho tro Thu ky Khoa quan ly du lieu sinh vien.
Nhiem vu: Nhan cau lenh tu nhien, phan tich va tra ve JSON chua tham so goi ham get_all_students_filters.
Quy tac:
1. "cam thi", "rot mon", "canh bao" -> maxScore = 3.9.
2. "xuat sac", "diem tuyet doi", "khong cup hoc" -> minScore = 9, maxScore = 10.
3. Neu cau hoi yeu cau loc nhieu khoa, nhieu nganh hoac nhieu lop, hay liet ke tat ca cac gia tri ngan cach boi dau phay trong truong tuong ung (VD: khoa = "34,35"; nganh = "TT,PM"; maLop = "TT35CL07,PM34CL02").
Chi tra ve chuoi JSON hop le, tuyet doi khong giai thich van ban.`;

const apiKey = process.env.GEMINI_API_KEY;

const AIService = async (userMessage) => {
  if (!apiKey) {
    return {
      status: "Err",
      message: "Tro ly AI dang ban, vui long thu lai sau.",
    };
  }

  try {
    const response = await fetch(
      "https://api.orimise.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // model: "gemini-2.5-flash",
          model: "gemini-3.1-pro",
          messages: [
            { role: "system", content: systemInstruction },
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
      console.log(`AI API request failed with status: ${response.status}`);
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
