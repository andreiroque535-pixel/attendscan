function loadDashboard(data) {

    document.getElementById("totalStudents").textContent =
        data.totalStudents;

    document.getElementById("presentStudents").textContent =
        data.present;

    document.getElementById("absentStudents").textContent =
        data.absent;
}

const script = document.createElement("script");

script.src =
"https://script.google.com/macros/s/AKfycbwEWKsCZ48YblGnv_QdEBLKyaQ72_xHm2d8pYIxd3JC0mOqvAYkuN9ymyLGwZaZkA8aQA/exec?action=dashboard&callback=loadDashboard";

document.body.appendChild(script);