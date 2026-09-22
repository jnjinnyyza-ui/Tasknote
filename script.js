/* =========================
   DATA
========================= */

let users =
  JSON.parse(localStorage.getItem("homeworkUsers")) || [];

let currentUsername =
  localStorage.getItem("homeworkCurrentUser");

let guestMode = false;


/* =========================
   STORAGE
========================= */

function saveUsers() {
  localStorage.setItem(
    "homeworkUsers",
    JSON.stringify(users)
  );
}


function getUser() {
  return users.find(
    user => user.username === currentUsername
  );
}


/* =========================
   PAGE CONTROL
========================= */

function hideAllPages() {

  document.getElementById("homePage")
    .classList.add("hidden");

  document.getElementById("registerPage")
    .classList.add("hidden");

  document.getElementById("loginPage")
    .classList.add("hidden");

  document.getElementById("mainPage")
    .classList.add("hidden");
}


function showHome() {

  hideAllPages();

  document.getElementById("homePage")
    .classList.remove("hidden");
}


function showRegister() {

  hideAllPages();

  document.getElementById("registerPage")
    .classList.remove("hidden");

  document.getElementById("regError")
    .textContent = "";
}


function showLogin() {

  hideAllPages();

  document.getElementById("loginPage")
    .classList.remove("hidden");

  document.getElementById("loginError")
    .textContent = "";
}


/* =========================
   REGISTER
========================= */

function register() {

  const username =
    document.getElementById("regUser")
      .value.trim();

  const password =
    document.getElementById("regPass")
      .value;

  const confirmPassword =
    document.getElementById("regConfirm")
      .value;

  const error =
    document.getElementById("regError");

  error.textContent = "";


  if (!username || !password || !confirmPassword) {

    error.textContent =
      "กรอกข้อมูลให้ครบก่อน";

    return;
  }


  if (password !== confirmPassword) {

    error.textContent =
      "รหัสผ่านไม่ตรงกัน";

    return;
  }


  if (password.length < 4) {

    error.textContent =
      "รหัสผ่านควรมีอย่างน้อย 4 ตัวอักษร";

    return;
  }


  if (
    users.some(
      user => user.username === username
    )
  ) {

    error.textContent =
      "ชื่อผู้ใช้นี้มีอยู่แล้ว";

    return;
  }


  users.push({

    username: username,

    password: password,

    tasks: []

  });


  saveUsers();


  currentUsername = username;

  localStorage.setItem(
    "homeworkCurrentUser",
    username
  );


  guestMode = false;

  openMain();
}


/* =========================
   LOGIN
========================= */

function login() {

  const username =
    document.getElementById("loginUser")
      .value.trim();

  const password =
    document.getElementById("loginPass")
      .value;


  const error =
    document.getElementById("loginError");


  const user =
    users.find(
      item =>
        item.username === username &&
        item.password === password
    );


  if (!user) {

    error.textContent =
      "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";

    return;
  }


  currentUsername = username;

  localStorage.setItem(
    "homeworkCurrentUser",
    username
  );


  guestMode = false;

  openMain();
}


/* =========================
   GUEST
========================= */

function guestLogin() {

  guestMode = true;

  currentUsername = null;

  localStorage.removeItem(
    "homeworkCurrentUser"
  );


  openMain();
}


/* =========================
   MAIN
========================= */

function openMain() {

  hideAllPages();


  document.getElementById("mainPage")
    .classList.remove("hidden");


  if (guestMode) {

    document.getElementById("currentUser")
      .textContent =
      "👤 ผู้เยี่ยมชม";

    showGuestTasks();

    return;
  }


  const user = getUser();

  if (!user) {

    showHome();

    return;
  }


  document.getElementById("currentUser")
    .textContent =
    "👤 " + user.username;


  showTasks();
}


/* =========================
   LOGOUT
========================= */

function logout() {

  currentUsername = null;

  guestMode = false;

  localStorage.removeItem(
    "homeworkCurrentUser"
  );


  showHome();
}


/* =========================
   MODAL
========================= */

function openAdd() {

  document.getElementById("taskForm")
    .reset();

  document.getElementById("editId")
    .value = "";

  document.getElementById("modalTitle")
    .textContent = "เพิ่มงาน";

  document.getElementById("taskModal")
    .classList.add("show");
}


function closeModal() {

  document.getElementById("taskModal")
    .classList.remove("show");
}


/* =========================
   SAVE TASK
========================= */

function saveTask(event) {

  event.preventDefault();


  if (guestMode) {

    alert(
      "โหมดผู้เยี่ยมชมไม่สามารถบันทึกงานได้\nกรุณาสมัครสมาชิกก่อน"
    );

    closeModal();

    return;
  }


  const user = getUser();

  if (!user) return;


  const name =
    document.getElementById("taskName")
      .value.trim();

  const subject =
    document.getElementById("taskSubject")
      .value;

  const date =
    document.getElementById("taskDate")
      .value;

  const detail =
    document.getElementById("taskDetail")
      .value.trim();

  const editId =
    document.getElementById("editId")
      .value;


  if (editId) {

    const task =
      user.tasks.find(
        item =>
          item.id === Number(editId)
      );


    if (task) {

      task.name = name;

      task.subject = subject;

      task.date = date;

      task.detail = detail;

    }

  } else {

    user.tasks.push({

      id: Date.now(),

      name: name,

      subject: subject,

      date: date,

      detail: detail,

      done: false

    });

  }


  saveUsers();

  showTasks();

  closeModal();
}


/* =========================
   SHOW TASKS
========================= */

function showTasks() {

  const user = getUser();

  if (!user) return;


  const search =
    document.getElementById("searchInput")
      .value.toLowerCase();

  const subject =
    document.getElementById("subjectFilter")
      .value;


  const tasks =
    user.tasks.filter(task => {

      const found =
        task.name
          .toLowerCase()
          .includes(search);


      const correctSubject =
        subject === "" ||
        task.subject === subject;


      return found && correctSubject;

    });


  const unfinished =
    tasks.filter(
      task => !task.done
    );


  const finished =
    tasks.filter(
      task => task.done
    );


  document.getElementById("workCount")
    .textContent =
    user.tasks.filter(
      task => !task.done
    ).length;


  showUnfinished(unfinished);

  showFinished(finished);
}


/* =========================
   GUEST TASKS
========================= */

function showGuestTasks() {

  document.getElementById("workCount")
    .textContent = "0";


  document.getElementById("taskList")
    .innerHTML = `
      <div class="empty">
        โหมดผู้เยี่ยมชม
        <br>
        สมัครสมาชิกเพื่อเริ่มบันทึกงาน
      </div>
    `;


  document.getElementById("finishedList")
    .innerHTML = `
      <div class="empty">
        ยังไม่มีงานที่ทำเสร็จ
      </div>
    `;
}


/* =========================
   UNFINISHED
========================= */

function showUnfinished(tasks) {

  const list =
    document.getElementById("taskList");


  if (tasks.length === 0) {

    list.innerHTML = `
      <div class="empty">
        ตอนนี้ไม่มีงานที่ต้องทำ
      </div>
    `;

    return;
  }


  list.innerHTML =
    tasks.map(
      task => `

        <div class="task">

          <button
            class="check-btn"
            onclick="finishTask(${task.id})">
          </button>


          <div class="task-info">

            <strong>
              ${safe(task.name)}
            </strong>

            <small>
              ${safe(task.subject)}
              •
              ส่ง ${formatDate(task.date)}
            </small>

          </div>


          <div class="task-buttons">

            <button
              onclick="editTask(${task.id})">
              ✏️
            </button>


            <button
              class="delete"
              onclick="deleteTask(${task.id})">
              🗑️
            </button>

          </div>

        </div>

      `
    ).join("");
}


/* =========================
   FINISHED
========================= */

function showFinished(tasks) {

  const list =
    document.getElementById("finishedList");


  if (tasks.length === 0) {

    list.innerHTML = `
      <div class="empty">
        ยังไม่มีงานที่ทำเสร็จ
      </div>
    `;

    return;
  }


  list.innerHTML =
    tasks.map(
      task => `

        <div class="finished">

          <button
            class="check-btn"
            onclick="finishTask(${task.id})">
            ✓
          </button>


          <strong>
            ${safe(task.name)}
          </strong>

        </div>

      `
    ).join("");
}


/* =========================
   FINISH TASK
========================= */

function finishTask(id) {

  if (guestMode) return;


  const user = getUser();

  if (!user) return;


  const task =
    user.tasks.find(
      item => item.id === id
    );


  if (!task) return;


  task.done = !task.done;


  saveUsers();

  showTasks();
}


/* =========================
   EDIT
========================= */

function editTask(id) {

  if (guestMode) return;


  const user = getUser();

  if (!user) return;


  const task =
    user.tasks.find(
      item => item.id === id
    );


  if (!task) return;


  document.getElementById("editId")
    .value = task.id;


  document.getElementById("taskName")
    .value = task.name;


  document.getElementById("taskSubject")
    .value = task.subject;


  document.getElementById("taskDate")
    .value = task.date;


  document.getElementById("taskDetail")
    .value = task.detail || "";


  document.getElementById("modalTitle")
    .textContent = "แก้ไขงาน";


  document.getElementById("taskModal")
    .classList.add("show");
}


/* =========================
   DELETE
========================= */

function deleteTask(id) {

  if (guestMode) return;


  const user = getUser();

  if (!user) return;


  if (!confirm("ต้องการลบงานนี้หรือไม่?")) {
    return;
  }


  user.tasks =
    user.tasks.filter(
      task => task.id !== id
    );


  saveUsers();

  showTasks();
}


/* =========================
   DATE
========================= */

function formatDate(date) {

  if (!date) return "-";


  const parts =
    date.split("-");


  if (parts.length !== 3) {
    return date;
  }


  const months = [

    "",

    "ม.ค.",

    "ก.พ.",

    "มี.ค.",

    "เม.ย.",

    "พ.ค.",

    "มิ.ย.",

    "ก.ค.",

    "ส.ค.",

    "ก.ย.",

    "ต.ค.",

    "พ.ย.",

    "ธ.ค."

  ];


  return (
    Number(parts[2]) +
    " " +
    months[Number(parts[1])]
  );
}


/* =========================
   SAFE TEXT
========================= */

function safe(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text || "";

  return div.innerHTML;
}


/* =========================
   SEARCH
========================= */

document.addEventListener(
  "input",
  function(event) {

    if (
      event.target.id === "searchInput"
    ) {

      if (guestMode) return;

      showTasks();
    }

  }
);


document.addEventListener(
  "change",
  function(event) {

    if (
      event.target.id === "subjectFilter"
    ) {

      if (guestMode) return;

      showTasks();
    }

  }
);


/* =========================
   FORM
========================= */

function init() {

  const form =
    document.getElementById("taskForm");


  if (form) {

    form.addEventListener(
      "submit",
      saveTask
    );

  }


  if (currentUsername) {

    guestMode = false;

    openMain();

  } else {

    showHome();

  }

}


if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

} else {

  init();

}
