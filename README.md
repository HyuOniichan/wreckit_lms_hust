
## Description

+ Tool tim dap an quiz cua [LMS Hust](https://lms.hust.edu.vn/)
+ Ki hoc moi nhat: $2026.1$



## Setup 
# Wreck-It LMS HUST

Extension nhỏ dùng trên LMS HUST để tra đáp án quiz và có thêm một khung chat hỏi đáp.

## Cài đặt

1. Mở `chrome://extensions` trên Chrome.
2. Bật **Developer mode**.
3. Chọn **Load unpacked**.
4. Chọn thư mục có file `manifest.json`.

Sau mỗi lần sửa code, quay lại trang extensions và bấm **Reload**.

## Dùng extension

### License

Mở popup của extension, nhập license key rồi bấm **Activate**. License phải tồn tại trong hệ thống thì chức năng tra đáp án mới hoạt động.

### Tra đáp án

Mở một trang quiz trên LMS rồi:

- Bấm extension để gửi yêu cầu hiển thị đáp án.
- Hoặc nhấn phím `S` khi đang ở trang quiz.

Extension sẽ highlight đáp án tìm được ngay trên trang.

### Chatbox

Khung chat nằm ở góc dưới bên phải màn hình. Nhập câu hỏi rồi bấm **Gửi**; có thể nhấn `Enter` để gửi và `Shift + Enter` để xuống dòng.

Để dùng phần trả lời bằng Groq:

1. Tạo API key tại [console.groq.com](https://console.groq.com/keys).
2. Mở popup extension.
3. Dán key vào ô **Groq API Key**.
4. Bấm **Lưu Groq Key**.

Key được lưu trong storage local của extension. Không chia sẻ key hoặc commit key vào repository.

## Ghi chú

Extension chỉ chạy trên các trang thuộc `lms.hust.edu.vn`.

Các câu hỏi và dữ liệu quiz được lấy từ Firestore của project. Nếu một câu hỏi chưa có trong dữ liệu, extension sẽ không highlight được đáp án.

## Tham khảo

- [LMS HUST](https://lms.hust.edu.vn/)
- [Tài liệu quiz IT3180](https://www.scribd.com/document/934739846/Cong-ngh%E1%BB%87-ph%E1%BA%A7n-m%E1%BB%81m-quiz-LMS-ki-20242)

