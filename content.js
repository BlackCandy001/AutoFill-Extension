/**
 * AutoFill Pro - Content Script
 * Chức năng: Phát hiện, lưu và tự động điền form
 */

(function () {
  // Kiểm tra xem extension có đang được bật hay không
  let isEnabled = true;

  // Lấy domain hiện tại làm tiền tố cho key lưu trữ
  let domain = window.location.hostname;
  if (!domain) {
    domain = "local_file"; // Hỗ trợ khi chạy file HTML nội bộ (file://)
  }

  /**
   * Hàm lấy key lưu trữ cho một phần tử form
   * Ưu tiên dùng 'name', sau đó đến 'id'
   */
  function getStorageKey(element) {
    const identifier = element.name || element.id;
    if (!identifier) return null;
    return `${domain}_${identifier}`;
  }

  /**
   * Hàm lưu dữ liệu vào chrome.storage
   */
  function saveValue(element) {
    if (!isEnabled) return;
    const key = getStorageKey(element);
    if (!key) return;

    let value = element.value;

    // Xử lý đặc biệt cho các loại input (nếu cần mở rộng sau này)
    // Hiện tại .value hoạt động tốt cho text, email, password, number, textarea, select

    chrome.storage.local.get(["autoFillData"], (result) => {
      const data = result.autoFillData || {};
      data[key] = value;
      chrome.storage.local.set({ autoFillData: data }, () => {
        console.log(`[AutoFill] Đã lưu: ${key} = ${value}`);
      });
    });
  }

  /**
   * Hàm tự động điền dữ liệu vào form
   */
  function fillForm() {
    if (!isEnabled) return;

    chrome.storage.local.get(["autoFillData"], (result) => {
      const data = result.autoFillData || {};

      // Tìm tất cả input, textarea, select
      const fields = document.querySelectorAll("input, textarea, select");

      fields.forEach((field) => {
        const key = getStorageKey(field);
        if (key && data[key] !== undefined) {
          // Chỉ điền nếu trường đang trống hoặc là password/select (để đảm bảo không ghi đè dữ liệu mới nhập)
          // Hoặc đơn giản là điền tất cả theo yêu cầu "tự động điền lại"
          field.value = data[key];

          // Kích hoạt sự kiện 'input' và 'change' để các script khác trên trang nhận biết sự thay đổi
          field.dispatchEvent(new Event("input", { bubbles: true }));
          field.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });
  }

  /**
   * Lắng nghe sự kiện để lưu dữ liệu
   */
  function initListeners() {
    const saveHandler = (event) => {
      const target = event.target;
      if (target && target.matches && target.matches("input, textarea, select")) {
        saveValue(target);
      }
    };

    // Bắt các sự kiện cơ bản khi người dùng gõ hoặc chọn
    document.addEventListener("input", saveHandler, true);
    document.addEventListener("change", saveHandler, true);

    // Bắt sự kiện khi focus out (giúp lưu khi trình duyệt tự động điền)
    document.addEventListener("blur", saveHandler, true);
    document.addEventListener("focusout", saveHandler, true);

    // Bắt sự kiện submit form để lưu lại toàn bộ dữ liệu lần cuối trước khi reload
    document.addEventListener("submit", (event) => {
      const form = event.target;
      if (form && form.querySelectorAll) {
        const inputs = form.querySelectorAll("input, textarea, select");
        inputs.forEach((input) => saveValue(input));
      }
    }, true);
  }

  /**
   * Kiểm tra trạng thái On/Off từ storage
   */
  function checkStatusAndInit() {
    chrome.storage.local.get(["extensionEnabled"], (result) => {
      isEnabled = result.extensionEnabled !== false; // Mặc định là true
      if (isEnabled) {
        fillForm();
        initListeners();

        // Quan sát sự thay đổi của DOM để hỗ trợ các form load động (AJAX)
        const observer = new MutationObserver((mutations) => {
          fillForm();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  }

  // Khởi chạy
  checkStatusAndInit();

  /**
   * Tạo dữ liệu giả và điền vào form
   */
  function fillWithFakeData() {
    if (!isEnabled) return;
    const fields = document.querySelectorAll("input, textarea, select");

    fields.forEach((field) => {
      const type = field.type ? field.type.toLowerCase() : "";
      if (
        ["hidden", "submit", "button", "image", "reset", "checkbox", "radio"].includes(type) ||
        field.readOnly ||
        field.disabled
      ) {
        return;
      }

      const nameOrId = (field.name || field.id || "").toLowerCase();
      let fakeValue = "";

      if (field.tagName === "SELECT") {
        const options = field.querySelectorAll("option");
        if (options.length > 0) {
          let startIndex = options[0].value === "" && options.length > 1 ? 1 : 0;
          const randomIndex = Math.floor(Math.random() * (options.length - startIndex)) + startIndex;
          fakeValue = options[randomIndex].value;
        }
      } else if (type === "email" || nameOrId.includes("email")) {
        const randomStr = Math.random().toString(36).substring(2, 7);
        fakeValue = `user_${randomStr}@example.com`;
      } else if (type === "password" || nameOrId.includes("pass")) {
        fakeValue = "Airlines@123!";
      } else if (type === "number" || nameOrId.includes("age") || nameOrId.includes("tuoi")) {
        fakeValue = Math.floor(Math.random() * 45) + 18; // 18-62
      } else if (nameOrId.includes("phone") || nameOrId.includes("mobile") || nameOrId.includes("sdt")) {
        fakeValue = "09" + Math.floor(10000000 + Math.random() * 90000000);
      } else if (nameOrId.includes("first") || nameOrId.includes("ten") && !nameOrId.includes('extension')) {
        const firstNames = ["An", "Bình", "Châu", "Duy", "Hải", "Linh", "Minh", "Nam", "Quỳnh", "Sơn", "Khoa"];
        fakeValue = firstNames[Math.floor(Math.random() * firstNames.length)];
      } else if (nameOrId.includes("last") || nameOrId.includes("ho") && !nameOrId.includes('phone')) {
        const lastNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng"];
        fakeValue = lastNames[Math.floor(Math.random() * lastNames.length)];
      } else if (nameOrId.includes("address") || nameOrId.includes("diachi")) {
        fakeValue = `${Math.floor(Math.random() * 999) + 1} Đường Nguyễn Huệ, TP.HCM`;
      } else if (nameOrId.includes("credit") || nameOrId.includes("card")) {
        fakeValue = "411111111111" + Math.floor(1000 + Math.random() * 9000);
      } else if (nameOrId.includes("id") || nameOrId.includes("user")) {
         fakeValue = "user" + Math.floor(1000 + Math.random() * 9000);
      } else {
        fakeValue = "Fake " + Math.random().toString(36).substring(2, 6);
      }

      if (fakeValue !== "") {
        field.value = fakeValue;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    console.log("[AutoFill] Đã điền Fake Data");
  }

  // Lắng nghe tin nhắn từ popup để bật/tắt tức thì
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateStatus") {
      isEnabled = request.enabled;
      if (isEnabled) {
        fillForm();
        // Ta không cần add lại Listeners vì chúng đã được add vào document
      }
    } else if (request.action === "fillFakeData") {
      fillWithFakeData();
    }
  });
})();
