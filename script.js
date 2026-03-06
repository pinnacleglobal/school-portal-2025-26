const sheetID = "1TBykyZx-eRMBDrRGBGGA8p_49iHlVDKN3wt9wijHJWM";
const apiKey = "AIzaSyB5VIy4kIySW7bVrjNYMpL5rkqZ7Oe758E";

const masterSheet = "Master Data 25 (New)";
const feesSheet = "Fees Collection";
const awSheet = "AW";

async function login() {
    let code = document.getElementById("loginCode").value.trim();
    if (!code) {
        alert("Enter Login Code");
        return;
    }

    document.getElementById("loginBtn").disabled = true;
    document.getElementById("loader").style.display = "block";

    try {
        // Fetch AW sheet once
        const awURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${awSheet}?key=${apiKey}`;
        const awData = await fetch(awURL).then(res => res.json());
        const awRows = awData.values;

        // Find student row by login code (AD → index 29)
        const studentRow = awRows.find(row => row[29] && row[29].trim() === code);

        if (!studentRow) {
            alert("Invalid Login Code");
            document.getElementById("loginBtn").disabled = false;
            document.getElementById("loader").style.display = "none";
            return;
        }

        const admission = studentRow[1]; // B
        const studentName = studentRow[3]; // D
        const father = studentRow[6] || "NA";
        const mother = studentRow[5] || "NA";
        const phone = studentRow[22] || "NA";
        const address = studentRow[7] || "NA";
        let photoUrl = studentRow[28] || "images/default.png"; // AC

        if (photoUrl.includes("drive.google.com")) {
            const fileIdMatch = photoUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
            if (fileIdMatch && fileIdMatch[1]) {
                photoUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
            }
        }

        // Fetch Master sheet for class
        const masterURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${masterSheet}?key=${apiKey}`;
        const masterData = await fetch(masterURL).then(res => res.json());
        const masterRows = masterData.values;
        const masterRow = masterRows.find(row => row[1] == admission);
        const studentClass = masterRow ? masterRow[13] || "NA" : "NA";

        // Populate student details
        document.getElementById("studentName").innerText = "Welcome " + studentName;
        document.getElementById("class").innerText = "Class : " + studentClass;
        document.getElementById("adm").innerText = "Admission No : " + admission;
        document.getElementById("father").innerText = "Father : " + father;
        document.getElementById("mother").innerText = "Mother : " + mother;
        document.getElementById("phone").innerText = "Phone : " + phone;
        document.getElementById("address").innerText = "Address : " + address;

        const imgEl = document.getElementById("photo");
        imgEl.src = photoUrl;
        imgEl.onerror = () => { imgEl.src = "images/default.png"; };

        // Fetch Fees sheet
        const feesURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${feesSheet}?key=${apiKey}`;
        const feesData = await fetch(feesURL).then(res => res.json());
        const feeRows = feesData.values;

        let table = "";
        for (let i = 1; i < feeRows.length; i++) {
            if (feeRows[i][2] == admission) {
                const tuition = feeRows[i][8] || "NA";
                const transport = feeRows[i][9] || "NA";
                const exam = feeRows[i][10] || "NA";

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

        // Show portal
        document.getElementById("loader").style.display = "none";
        document.getElementById("portal").style.display = "block";

    } catch (err) {
        console.error(err);
        alert("Error loading student data. Please try again.");
        document.getElementById("loginBtn").disabled = false;
        document.getElementById("loader").style.display = "none";
    }
}

function logout() {
    location.reload();
}
