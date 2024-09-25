// login.js

// 使用 SHA-256 加密用户输入的密码
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// 检查用户是否已经登录
function isLoggedIn() {
  return localStorage.getItem('loggedIn') === 'true';
}

// 显示登录模态框
function showLoginPopup(link) {
  // 如果用户已经登录，直接跳转到目标页面
  if (isLoggedIn()) {
    window.location.href = link;
    return;
  }

  // 动态插入模态框HTML
  const modalHTML = `
    <div id="loginModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>Login</h2>
        <form id="loginForm">
          <input type="text" id="username" class="input-field" placeholder="Username" required>
          <input type="password" id="password" class="input-field" placeholder="Password" required>
          <button type="submit" class="submit-btn">Login</button>
        </form>
      </div>
    </div>
  `;
  
  // 将模态框插入到 body 中
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 显示模态框
  document.getElementById('loginModal').style.display = 'block';

  document.getElementById('loginForm').onsubmit = async function (e) {
    e.preventDefault(); // 阻止表单默认提交行为
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 计算用户输入密码的哈希值
    const hashedPassword = await hashPassword(password);

    // 检查用户名和哈希后的密码
    const correctUsername = 'seke';
    const correctPasswordHash = '942296443919c9b6877812fd8497bbaca4a0a043523861a9a425517b0639d585'; // 'password123' 的 SHA-256 散列值

    if (username === correctUsername && hashedPassword === correctPasswordHash) {
      localStorage.setItem('loggedIn', 'true');
      window.location.href = link;
    } else {
      alert('Invalid username or password.');
    }

    // 隐藏模态框
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginModal').remove();  // 删除模态框元素
  };
}

// 用户登出函数
function logout() {
  localStorage.removeItem('loggedIn');
  alert("You have been logged out.");
  window.location.reload();
}

// 关闭模态框
function closeModal() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('loginModal').remove();
}
