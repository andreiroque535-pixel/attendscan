
// ==========================================
// ATTENDSCAN - DASHBOARD JAVASCRIPT
// ==========================================

// DISPLAY STUDENT INFORMATION
function createStudentItem(student, status) {

    const item = document.createElement("div");
    item.className = "student-item";

    const info = document.createElement("div");
    info.className = "student-info";

    const name = document.createElement("h3");
    name.className = "student-name";
    name.textContent = student.fullName;

    const id = document.createElement("p");
    id.className = "student-id";
    id.textContent = student.id;

    const badge = document.createElement("span");
    badge.className = status === "PRESENT"
        ? "badge present-badge"
        : "badge absent-badge";

    badge.textContent =
        status === "PRESENT" ? "Present" : "Absent";

    info.appendChild(name);
    info.appendChild(id);

    item.appendChild(info);
    item.appendChild(badge);

    return item;
}


// DISPLAY STUDENT LISTS
function displayStudents(students, containerId, status) {

    const container = document.getElementById(containerId);

    container.replaceChildren();

    if (!students || students.length === 0) {

        const message = document.createElement("p");

        message.textContent = "No students found.";

        container.appendChild(message);

        return;
    }

    students.forEach(function(student) {

        const item = createStudentItem(student, status);

        container.appendChild(item);

    });

}


// RECEIVE DASHBOARD DATA
window.loadDashboard = function(data) {

    if (!data || !data.success) {
        console.error("Dashboard data error:", data);
        return;
    }

    
// UPDATE STATISTICS
document.getElementById("totalStudents").textContent =
    data.totalStudents;

document.getElementById("presentStudents").textContent =
    data.present;

document.getElementById("absentStudents").textContent =
    data.absent;

document.getElementById("malePresent").textContent =
    data.malePresent;

document.getElementById("femalePresent").textContent =
    data.femalePresent;


    // DISPLAY PRESENT STUDENTS
    displayStudents(
        data.presentStudents,
        "presentList",
        "PRESENT"
    );

    // DISPLAY ABSENT STUDENTS
    displayStudents(
        data.absentStudents,
        "absentList",
        "ABSENT"
    );

};


// LOAD DATA FROM GOOGLE APPS SCRIPT

// ==========================================
// AUTOMATIC DASHBOARD REFRESH
// ==========================================

function refreshDashboard() {

    // Remove previous dashboard request
    const oldScript = document.getElementById("dashboardScript");

    if (oldScript) {
        oldScript.remove();
    }

    // Create new request
    const script = document.createElement("script");

    script.id = "dashboardScript";

    script.src =
        "https://script.google.com/macros/s/AKfycbwEWKsCZ48YblGnv_QdEBLKyaQ72_xHm2d8pYIxd3JC0mOqvAYkuN9ymyLGwZaZkA8aQA/exec?action=dashboard&callback=loadDashboard&t=" + Date.now();

    script.onerror = function() {
        console.error("Dashboard refresh failed.");
    };

    document.body.appendChild(script);
}


// INITIAL LOAD
refreshDashboard();


// AUTOMATIC REFRESH EVERY 5 SECONDS
setInterval(refreshDashboard, 5000);


const menuBtn = document.getElementById("menuBtn");
const menuPanel = document.getElementById("menuPanel");

menuBtn.addEventListener("click", function() {
    menuPanel.classList.toggle("show");
});
