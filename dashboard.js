
// ==========================================
// ATTENDSCAN - DASHBOARD JAVASCRIPT
// ==========================================


// ==========================================
// 1. GOOGLE APPS SCRIPT URL
// ==========================================

const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbwEWKsCZ48YblGnv_QdEBLKyaQ72_xHm2d8pYIxd3JC0mOqvAYkuN9ymyLGwZaZkA8aQA/exec";


// ==========================================
// 2. CREATE STUDENT ITEM
// ==========================================

function createStudentItem(student, status) {

    const item = document.createElement("div");
    item.className = "student-item";

    const info = document.createElement("div");
    info.className = "student-info";

    const name = document.createElement("h3");
    name.className = "student-name";
    name.textContent = student.fullName || "Unknown Student";

    const id = document.createElement("p");
    id.className = "student-id";
    id.textContent = student.id || "";

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


// ==========================================
// 3. DISPLAY STUDENT LISTS
// ==========================================

function displayStudents(students, containerId, status) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error("Missing element:", containerId);
        return;
    }

    container.replaceChildren();

    if (!students || students.length === 0) {

        const message = document.createElement("p");
        message.textContent = "No students found.";

        container.appendChild(message);

        return;
    }

    students.forEach(function(student) {

        container.appendChild(
            createStudentItem(student, status)
        );

    });

}


// ==========================================
// 4. DISPLAY SESSION INFORMATION
// ==========================================

function displaySession(session) {

    const sectionLabel =
        document.getElementById("sessionSection");

    const dateLabel =
        document.getElementById("currentDate");

    const timeLabel =
        document.getElementById("currentTime");

    const statusLabel =
        document.getElementById("sessionStatus");

    if (!sectionLabel || !dateLabel ||
        !timeLabel || !statusLabel) {

        console.error("Session display elements are missing.");
        return;
    }

    if (session) {

        sectionLabel.textContent =
            session.section || "—";

        dateLabel.textContent =
            session.date || "Date unavailable";

        timeLabel.textContent =
            session.time || "Time unavailable";

        statusLabel.textContent =
            session.status || "ACTIVE";

        statusLabel.classList.toggle(
            "active",
            session.status === "ACTIVE"
        );

    } else {

        sectionLabel.textContent = "—";
        dateLabel.textContent = "No session";
        timeLabel.textContent = "Not started";
        statusLabel.textContent = "No Active Session";

        statusLabel.classList.remove("active");

    }

}


// ==========================================
// 5. RECEIVE DASHBOARD DATA
// ==========================================

window.loadDashboard = function(data) {

    if (!data || !data.success) {

        console.error("Dashboard data error:", data);
        return;

    }

    // TOTAL STUDENTS

    document.getElementById("totalStudents").textContent =
        data.totalStudents;


    // PRESENT STUDENTS

    document.getElementById("presentStudents").textContent =
        data.present;


    // ABSENT STUDENTS

    document.getElementById("absentStudents").textContent =
        data.absent;


    // MALE PRESENT

    document.getElementById("malePresent").textContent =
        data.malePresent;


    // FEMALE PRESENT

    document.getElementById("femalePresent").textContent =
        data.femalePresent;


    // PRESENT STUDENT LIST

    displayStudents(
        data.presentStudents,
        "presentList",
        "PRESENT"
    );


    // ABSENT STUDENT LIST

    displayStudents(
        data.absentStudents,
        "absentList",
        "ABSENT"
    );


    // SESSION INFORMATION

    displaySession(data.session);

};


// ==========================================
// 6. REFRESH DASHBOARD
// ==========================================

function refreshDashboard() {

    const oldScript =
        document.getElementById("dashboardScript");

    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement("script");

    script.id = "dashboardScript";

    script.src =
        WEB_APP_URL +
        "?action=dashboard&callback=loadDashboard&t=" +
        Date.now();

    script.onerror = function() {

        console.error("Dashboard refresh failed.");

    };

    document.body.appendChild(script);

}


// ==========================================
// 7. SEND SESSION REQUEST
// ==========================================

function sendSessionRequest(action) {

    const script = document.createElement("script");

    script.src =
        WEB_APP_URL +
        "?action=" + encodeURIComponent(action) +
        "&section=SWIFT" +
        "&callback=handleSessionAction&t=" +
        Date.now();

    script.onerror = function() {

        alert("Unable to connect to the attendance server.");

        script.remove();

    };

    document.body.appendChild(script);

}


// ==========================================
// 8. RECEIVE SESSION RESPONSE
// ==========================================

window.handleSessionAction = function(data) {

    if (!data) {

        alert("No response received from the server.");
        return;

    }

    alert(data.message || "Session request completed.");

    if (data.success) {

        refreshDashboard();

    }

};


// ==========================================
// 9. INITIALIZE BUTTONS AND DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    // MENU ELEMENTS

    const menuBtn =
        document.getElementById("menuBtn");

    const menuPanel =
        document.getElementById("menuPanel");


    // MENU BUTTON

    if (menuBtn && menuPanel) {

        menuBtn.addEventListener("click", function() {

            menuPanel.classList.toggle("show");

        });

    } else {

        console.error("Menu button or menu panel not found.");

    }


    // START ATTENDANCE BUTTON

    const startAttendanceBtn =
        document.getElementById("startAttendanceBtn");

    if (startAttendanceBtn) {

        startAttendanceBtn.addEventListener("click", function() {

            sendSessionRequest("startSession");

        });

    } else {

        console.error("Start Attendance button not found.");

    }


    // CREATE NEW SESSION BUTTON

    const newSessionBtn =
        document.getElementById("newSessionBtn");

    if (newSessionBtn) {

        newSessionBtn.addEventListener("click", function() {

            const confirmed = confirm(
                "Create a new attendance session? " +
                "The previous active session will be completed."
            );

            if (confirmed) {

                sendSessionRequest("createSession");

            }

        });

    } else {

        console.error("Create New Session button not found.");

    }


    // INITIAL DASHBOARD LOAD

    refreshDashboard();


    // AUTOMATIC REFRESH EVERY 5 SECONDS

    setInterval(refreshDashboard, 5000);

});
