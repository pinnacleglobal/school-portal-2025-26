const sheetID = "1TBykyZx-eRMBDrRGBGGA8p_49iHlVDKN3wt9wijHJWM";
const apiKey = "AIzaSyB5VIy4kIySW7bVrjNYMpL5rkqZ7Oe758E";

const masterSheet = "Master Data 25 (New)";
const feesSheet = "Fees Collection";
const awSheet = "AW";

// LOGIN FUNCTION
async function login() {
    let code = document.getElementById("loginCode").value.trim();
    if (!code) {
        alert("Enter Login Code");
        return;
    }

    document.getElementById("loginBtn").disabled = true;
    document.getElementById("loader").style.display = "block";

    // Fetch AW sheet
    let awURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${awSheet}?key=${apiKey}`;
    let awData = await fetch(awURL).then(res => res.json());
    let awRows = awData.values;

    let admission = "";
    let studentName = "";

    for (let i = 1; i < awRows.length; i++) {
        if (awRows[i][29] && awRows[i][29].trim() === code) {
            admission = awRows[i][1]; // Column B
            studentName = awRows[i][3]; // Column D
            break;
        }
    }

    if (!admission) {
        alert("Invalid Login Code");
        document.getElementById("loginBtn").disabled = false;
        document.getElementById("loader").style.display = "none";
        return;
    }

    loadPortal(admission, studentName);
}

// LOAD STUDENT PORTAL
async function loadPortal(adm, name) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("studentName").innerText = "Welcome " + name;

    // Master Sheet for class
    let masterURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${masterSheet}?key=${apiKey}`;
    let masterData = await fetch(masterURL).then(res => res.json());
    let rows = masterData.values;

    let studentClass = "";
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][1] == adm) studentClass = rows[i][13];
    }

    document.getElementById("class").innerText = "Class : " + studentClass;
    document.getElementById("adm").innerText = "Admission No : " + adm;

    // AW sheet for photo & details
    let awURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${awSheet}?key=${apiKey}`;
    let awData = await fetch(awURL).then(res => res.json());
    let awRows = awData.values;

    for (let i = 1; i < awRows.length; i++) {
        if (awRows[i][1] == adm) {
            let photoUrl = (awRows[i][28] || "images/default.png").trim();
            if (photoUrl.includes("drive.google.com")) {
                const fileIdMatch = photoUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
                if (fileIdMatch && fileIdMatch[1]) {
                    photoUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                }
            }

            const imgEl = document.getElementById("photo");
            imgEl.src = photoUrl;
            imgEl.onerror = () => { imgEl.src = "images/default.png"; };

            document.getElementById("father").innerText = "Father : " + (awRows[i][6] || "NA");
            document.getElementById("mother").innerText = "Mother : " + (awRows[i][5] || "NA");
            document.getElementById("phone").innerText = "Phone : " + (awRows[i][22] || "NA");
            document.getElementById("address").innerText = "Address : " + (awRows[i][7] || "NA");

            // Wait for image to load before showing portal
            imgEl.onload = () => {
                document.getElementById("loader").style.display = "none";
                document.getElementById("portal").style.display = "block";
            };
            break;
        }
    }

    // Fees Collection
    let feesURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${feesSheet}?key=${apiKey}`;
    let feesData = await fetch(feesURL).then(res => res.json());
    let feeRows = feesData.values;

    let table = "";
    for (let i = 1; i < feeRows.length; i++) {
        if (feeRows[i][2] == adm) {
            let tuition = feeRows[i][8] || "NA";
            let transport = feeRows[i][9] || "NA";
            let exam = feeRows[i][10] || "NA";

            table += `<tr class="fee-card">
                <td>${feeRows[i][1]}</td>
                <td>${feeRows[i][0]}</td>
                <td>${feeRows[i][5]}</td>
                <td>${feeRows[i][6]}</td>
                <td>${feeRows[i][7]}</td>
                <td>${tuition}</td>
                <td>${transport}</td>
                <td>${exam}</td>
            </tr>`;
        }
    }
    document.getElementById("feeTable").innerHTML = table;
}

// LOGOUT
function logout() {
    location.reload();
}
