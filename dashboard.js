
function loadDashboard(data) {

    document.getElementById("totalStudents").textContent =
        data.totalStudents ?? 0;

    document.getElementById("presentStudents").textContent =
        data.present ?? 0;

    document.getElementById("absentStudents").textContent =
        data.absent ?? 0;

    document.getElementById("malePresent").textContent =
        data.malePresent ?? 0;

    document.getElementById("femalePresent").textContent =
        data.femalePresent ?? 0;
}


// Retrieve dashboard information
function updateDashboard() {

    const oldScript = document.getElementById("dashboardRequest");

    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement("script");

    script.id = "dashboardRequest";

    script.src =
        "https://script.google.com/macros/s/AKfycbwEWKsCZ48YblGnv_QdEBLKyaQ72_xHm2d8pYIxd3JC0mOqvAYkuN9ymyLGwZaZkA8aQA/exec?action=dashboard&callback=loadDashboard";

    document.body.appendChild(script);
}


// Load immediately
updateDashboard();

// Refresh every 5 seconds
setInterval(updateDashboard, 5000);
