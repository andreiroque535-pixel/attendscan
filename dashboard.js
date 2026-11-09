
function loadDashboard(data) {

    if (!data.success) {
        console.error("Dashboard error:", data.message);
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

    // UPDATE STUDENT LISTS
    displayStudentList("presentList", data.presentStudents, "Present");

    displayStudentList("absentList", data.absentStudents, "Absent");
}


// DISPLAY STUDENT LIST
function displayStudentList(elementId, students, status) {

    const container = document.getElementById(elementId);

    if (!container) return;

    container.replaceChildren();

    if (!students || students.length === 0) {

        const message = document.createElement("p");

        message.textContent = "No students found.";

        container.appendChild(message);

        return;
    }

    students.forEach(function(student) {

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
        badge.className = status === "Present"
            ? "badge present-badge"
            : "badge absent-badge";

        badge.textContent = status;

        info.appendChild(name);
        info.appendChild(id);

        item.appendChild(info);
        item.appendChild(badge);

        container.appendChild(item);

    });
}


// LOAD DASHBOARD DATA
function updateDashboard() {

    const oldScript = document.getElementById("dashboardRequest");

    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement("script");

    script.id = "dashboardRequest";

    script.src =
        "https://script.google.com/macros/s/AKfycbwEWKsCZ48YblGnv_QdEBLKyaQ72_xHm2d8pYIxd3JC0mOqvAYkuN9ymyLGwZaZkA8aQA/exec?action=dashboard&callback=loadDashboard";

    script.onerror = function() {
        console.error("Unable to load dashboard data.");
    };

    document.body.appendChild(script);
}


// INITIAL LOAD
updateDashboard();


// AUTOMATIC REFRESH EVERY 5 SECONDS
setInterval(updateDashboard, 5000);
