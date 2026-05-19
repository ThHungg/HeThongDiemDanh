# 📊 Export Excel Đơn Giản - Hướng Dẫn Sử Dụng

## 🎯 Cách Hoạt Động

```
GET /api/v1/attendance/export/{classCode}
  ↓ (Export dữ liệu từ hàm getAttendanceByClass)
  ↓ (Tạo file Excel)
  ↓
Response: { fileName: "DiemDanh_CS101_...xlsx" }
  ↓
GET /api/v1/attendance/download/{fileName}
  ↓ (Download file)
  ↓ (Xóa file tự động)
```

---

## 📝 API Endpoints

### 1. Export Data
```
GET /api/v1/attendance/export/CS101
```

**Response:**
```json
{
  "status": "Ok",
  "code": 200,
  "message": "Xuất file thành công",
  "data": {
    "fileName": "DiemDanh_CS101_1705123456789.xlsx",
    "filePath": "/path/to/exports/..."
  }
}
```

### 2. Download File
```
GET /api/v1/attendance/download/DiemDanh_CS101_1705123456789.xlsx
```

**Response:** File Excel (tự động xóa sau download)

---

## 🧪 Test Ngay

### Dùng cURL

**Bước 1: Export**
```bash
curl http://localhost:3001/api/v1/attendance/export/CS101
```

**Bước 2: Download** (thay tên file)
```bash
curl http://localhost:3001/api/v1/attendance/download/DiemDanh_CS101_1705123456789.xlsx -o report.xlsx
```

### Dùng Postman

1. **Export:**
   - GET: `http://localhost:3001/api/v1/attendance/export/CS101`
   
2. **Download:**
   - GET: `http://localhost:3001/api/v1/attendance/download/` + fileName từ step 1

---

## 📊 File Excel Gồm Có

| Cột | Nội Dung |
|-----|---------|
| STT | Số thứ tự (1, 2, 3...) |
| Mã SV | Mã sinh viên |
| Họ tên | Tên đầy đủ |
| Lớp | Lớp chuyên ngành |
| Điểm trung bình | Điểm chuyên cần |

---

## 🔧 Code Structure

### Service: `attendanceService.js`
```javascript
exportAttendanceToExcel(classCode)
  ├── Gọi getAttendanceByClass() lấy dữ liệu
  ├── Tạo workbook ExcelJS
  ├── Thêm header và styling
  ├── Thêm dữ liệu sinh viên
  └── Lưu file vào folder `exports/`
```

### Controller: `attendanceController.js`
```javascript
exportAttendanceByClass(req, res)
  ├── Validate classCode
  └── Gọi service, return JSON

downloadAttendanceFile(req, res)
  ├── Validate filename (chặn path traversal)
  ├── Check file exists
  ├── Download file
  └── Xóa file tự động
```

### Routes: `attendanceRoutes.js`
```javascript
GET /export/:classCode       → exportAttendanceByClass
GET /download/:fileName      → downloadAttendanceFile
```

---

## 💾 Dữ Liệu Lưu Ở Đâu

Files được lưu ở: `Be/exports/`

**Tên file format:** `DiemDanh_{classCode}_{timestamp}.xlsx`

**Ví dụ:** `DiemDanh_CS101_1705123456789.xlsx`

---

## ⚙️ Files Sửa Đổi

| File | Thay Đổi |
|------|----------|
| `src/services/attendanceService.js` | ✅ Thêm hàm `exportAttendanceToExcel()` |
| `src/controllers/attendanceController.js` | ✅ Thêm 2 controllers export & download |
| `src/routes/attendanceRoutes.js` | ✅ Thêm 2 routes |

---

## 🚀 Giờ Frontend Gọi Cách Nào?

### Simple - cURL từ Browser Console

```javascript
// Bước 1: Export
fetch('/api/v1/attendance/export/CS101')
  .then(r => r.json())
  .then(data => {
    if (data.status === 'Ok') {
      console.log('✅ File:', data.data.fileName);
      // Bước 2: Download
      window.location = `/api/v1/attendance/download/${data.data.fileName}`;
    }
  });
```

### React/Fetch

```typescript
const handleExport = async (classCode: string) => {
  try {
    // Step 1: Export
    const exportRes = await fetch(`/api/v1/attendance/export/${classCode}`);
    const exportData = await exportRes.json();

    if (exportData.status === 'Ok') {
      // Step 2: Download
      const downloadUrl = `/api/v1/attendance/download/${exportData.data.fileName}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = exportData.data.fileName;
      link.click();
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## ✅ Checklist

- [x] Import ExcelJS
- [x] Thêm hàm export service
- [x] Thêm 2 controllers
- [x] Thêm 2 routes
- [ ] Test API
- [ ] Tích hợp Frontend

---

## 🐛 Lỗi Có Thể Gặp

| Lỗi | Giải Pháp |
|-----|---------|
| "Cannot find module 'exceljs'" | `npm install exceljs` |
| 404 File không tồn tại | Export lại file |
| Empty file | Kiểm tra database có data không |

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra backend logs
2. Kiểm tra folder `exports/` có file không
3. Kiểm tra classCode chính xác
4. Test cURL trước
