# AutoFill Extension 📝🍫

Một Chrome Extension (Manifest V3) hỗ trợ ghi nhớ, tự động điền lại form và tạo dữ liệu giả (Fake Data) thông minh cho dân lập trình/tester, với giao diện mang phong cách **Black Candy 🍫**.

## ✨ Tính năng chính

- **Lưu trữ tự động (Auto-Save):** Tự động bắt sự kiện `input`, `change`, `blur`, `focusout` và `submit` để lưu lại toàn bộ dữ liệu bạn nhập trên các trường form (`input`, `textarea`, `select`) vào bộ nhớ local của Chrome.
- **Tự động điền (Auto-Fill):** Tự động khôi phục và điền lại các giá trị form đã lưu mỗi khi bạn tải lại trang (hỗ trợ cả các form được render động bằng AJAX thông qua `MutationObserver`).
- **Tạo dữ liệu ngẫu nhiên (Fake Data):** Tích hợp nút tạo dữ liệu giả siêu tốc:
  - Tự động nhận diện Tên/Họ và điền các tên tiếng Việt phổ biến.
  - Tự động sinh Số điện thoại (chuẩn 10 số đầu 09), độ tuổi, địa chỉ.
  - Tạo ngẫu nhiên Email, thẻ tín dụng chuẩn định dạng.
  - Tự động chọn ngẫu nhiên trong các thẻ `<select>`.
- **Trang Quản lý dữ liệu trực quan:**
  - Có trang Dashboard riêng (`data.html`) giúp xem toàn bộ dữ liệu đã lưu.
  - Nhóm theo Domain và Key (Tên/ID trường).
  - Tìm kiếm nhanh, cho phép **Chỉnh sửa (Sửa giá trị giả)** hoặc **Xóa** từng mục đơn lẻ.
- **Bật tắt nhanh chóng:** Popup được thiết kế hiện đại, cung cấp nút gạt bật/tắt quyền hoạt động của extension tức thời mà không cần reload trang.

## 🚀 Hướng dẫn cài đặt (Dành cho Developer)

1. **Clone project hoặc tải về máy:**
   ```bash
   git clone https://github.com/BlackCandy001/AutoFill-Extension.git
   ```
2. Mở trình duyệt Chrome và truy cập vào địa chỉ: `chrome://extensions/`
3. Bật công tắc **Developer mode** (Chế độ cho nhà phát triển) ở góc phải trên cùng màn hình.
4. Bấm vào nút **Load unpacked** (Tải tiện ích đã giải nén).
5. Trỏ tới thư mục mã nguồn mà bạn vừa clone/tải về (`AutoFill-Extension`).
6. Ghim Extension lên thanh công cụ của Chrome để tiện sử dụng.

## 🛠 Hướng dẫn sử dụng thử

1. Bật file `sample_test.html` có sẵn trong thư mục lên bằng Google Chrome để test.
2. Mở Popup của extension lên, bấm nút **"Điền dữ liệu ngẫu nhiên (Fake)"**.
3. Bạn sẽ thấy các trường tự động được lấp đầy với họ tên, email, sđt giả.
4. (Tuỳ chọn) Bạn có thể sửa trực tiếp lại các trường đó theo ý mình.
5. F5 (Refresh) lại trang, bạn sẽ thấy toàn bộ dữ liệu tự động được điền lại y như cũ!
6. Mở Popup và chọn **"Xem & Quản lý dữ liệu"** để xem và sửa đổi những gì extension đã thu thập được từ trang trên.

## 📁 Cấu trúc thư mục

```
/
├── manifest.json       # Cấu hình lõi của Chrome Extension (V3)
├── content.js          # File chạy ngầm trên các trang web (Xử lý bắt/điền form)
├── data.html           # Giao diện trang Quản lý dữ liệu
├── data.css            # Style cho trang quản lý
├── data.js             # Logic của trang quản lý (Tìm kiếm, sửa, xóa)
├── sample_test.html    # Trang HTML dùng để test form
├── popup/
│   ├── popup.html      # Giao diện Popup khi bấm vào icon extension
│   ├── popup.css       # Style cho Popup
│   └── popup.js        # Logic điều khiển trong Popup
└── icons/              # Thư mục chứa Icon các kích thước
```

## 📄 Giấy phép (License)

Dự án được tạo bởi **Black Candy 🍫**. Phân phối dưới giấy phép MIT. Thoải mái sao chép và chỉnh sửa theo nhu cầu cá nhân của bạn.
