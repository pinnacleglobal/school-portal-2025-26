const sheetID = "1TBykyZx-eRMBDrRGBGGA8p_49iHlVDKN3wt9wijHJWM";
const apiKey = "AIzaSyB5VIy4kIySW7bVrjNYMpL5rkqZ7Oe758E";

const masterSheet = "Master Data 25 (New)";
const feesSheet = "Fees Collection";
const awSheet = "AW";

async function login() {
    const code = document.getElementById("loginCode").value.trim();
    if (!code) {
        alert("Enter Login Code");
        return;
    }

    document.getElementById("loginBtn").disabled = true;
    document.getElementById("loader").style.display = "block";

    try {
        // Fetch AW sheet
        const awResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${awSheet}?key=${apiKey}`);
        if (!awResp.ok) throw new Error("Failed to fetch AW sheet");
        const awData = await awResp.json();
        const awRows = awData.values;
        if (!awRows) throw new Error("AW sheet empty");

        // Find student by login code (AD → index 29)
        const studentRow = awRows.find(r => r[29]?.trim() === code);
        if (!studentRow) {
            alert("Invalid Login Code");
            document.getElementById("loginBtn").disabled = false;
            document.getElementById("loader").style.display = "none";
            return;
        }

        const admission = studentRow[1] || "NA";
        const studentName = studentRow[3] || "NA";
        const father = studentRow[6] || "NA";
        const mother = studentRow[5] || "NA";
        const phone = studentRow[22] || "NA";
        const address = studentRow[7] || "NA";
        let photoUrl = studentRow[28] || "images/default.png";

        // Convert Drive link to direct image
        if (photoUrl.includes("drive.google.com")) {
            const match = photoUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
            if (match?.[1]) photoUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
        }

        // Fetch Master sheet for class
        const masterResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${masterSheet}?key=${apiKey}`);
        const masterData = await masterResp.json();
        const masterRows = masterData.values || [];
        const masterRow = masterRows.find(r => r[1] === admission);
        const studentClass = masterRow?.[13] || "NA";

        // Populate student info
        document.getElementById("studentName").innerText = "Welcome " + studentName;
        document.getElementById("class").innerText = "Class : " + studentClass;
        document.getElementById("adm").innerText = "Admission No : " + admission;
        document.getElementById("father").innerText = "Father : " + father;
        document.getElementById("mother").innerText = "Mother : " + mother;
        document.getElementById("phone").innerText = "Phone : " + phone;
        document.getElementById("address").innerText = "Address : " + address;

        const imgEl = document.getElementById("photo");
        imgEl.src = photoUrl;
        imgEl.onerror = () => imgEl.src = "images/default.png";

        // Fetch Fees sheet
        const feesResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${feesSheet}?key=${apiKey}`);
        const feesData = await feesResp.json();
        const feeRows = feesData.values || [];

        let table = "";
        for (let i = 1; i < feeRows.length; i++) {
            const row = feeRows[i];
            if (row?.[2] === admission) {
                table += `<tr class="fee-card">
                    <td>${row[1] || "NA"}</td>
                    <td>${row[0] || "NA"}</td>
                    <td>${row[5] || "NA"}</td>
                    <td>${row[6] || "NA"}</td>
                    <td>${row[7] || "NA"}</td>
                    <td>${row[8] || "NA"}</td>
                    <td>${row[9] || "NA"}</td>
                    <td>${row[10] || "NA"}</td>
                </tr>`;
            }
        }
        document.getElementById("feeTable").innerHTML = table;

        // Hide login, show portal
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("loader").style.display = "none";
        document.getElementById("portal").style.display = "block";

    } catch (err) {
        console.error(err);
        alert("Error loading data: " + err.message);
        document.getElementById("loginBtn").disabled = false;
        document.getElementById("loader").style.display = "none";
    }
}

function logout() {
    location.reload();
}
