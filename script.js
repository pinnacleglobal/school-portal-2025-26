const sheetID = "1TBykyZx-eRMBDrRGBGGA8p_49iHlVDKN3wt9wijHJWM";
const apiKey = "AIzaSyB5VIy4kIySW7bVrjNYMpL5rkqZ7Oe758E";

const masterSheet = "Master Data 25 (New)";
const feesSheet = "Fees Collection";
const awSheet = "AW";

async function login() {
    const code = document.getElementById("loginCode").value.trim();
    if (!code) { alert("Enter Login Code"); return; }

    document.getElementById("loginBtn").disabled = true;
    document.getElementById("loader").style.display = "block";

    try {
        const awResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${awSheet}?key=${apiKey}`);
        const awData = await awResp.json();
        const awRows = awData.values || [];

        const studentRow = awRows.find(r => r[29]?.trim() === code);
        if (!studentRow) {
            alert("Invalid Login Code");
            document.getElementById("loader").style.display = "none";
            document.getElementById("loginBtn").disabled = false;
            return;
        }

        const admission = studentRow[1] || "NA";
        const studentName = studentRow[3] || "NA";
        const father = studentRow[6] || "NA";
        const mother = studentRow[5] || "NA";
        const phone = studentRow[22] || "NA";
        const address = studentRow[7] || "NA";

        const masterResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${masterSheet}?key=${apiKey}`);
        const masterData = await masterResp.json();
        const masterRows = masterData.values || [];
        const masterRow = masterRows.find(r => r[1] === admission);
        const studentClass = masterRow?.[13] || "NA";

        document.getElementById("studentName").innerText = "Welcome, " + studentName;
        document.getElementById("class").innerText = "Class : " + studentClass;
        document.getElementById("adm").innerText = "Admission No : " + admission;
        document.getElementById("father").innerText = "Father's Name : " + father;
        document.getElementById("mother").innerText = "Mother's Name : " + mother;
        document.getElementById("phone").innerText = "Phone Number : " + phone;
        document.getElementById("address").innerText = "Address : " + address;

        const feesResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${feesSheet}?key=${apiKey}`);
        const feesData = await feesResp.json();
        const feeRows = feesData.values || [];

        let table = "";
        let cards = "";
        for (let i = 1; i < feeRows.length; i++) {
            const row = feeRows[i];
            if (row?.[2] === admission) {
                const r0 = row[0] || "NA";
                const r1 = row[1] || "NA";
                const r5 = row[5] || "NA";
                const r6 = row[6] || "NA";
                const r7 = row[7] || "NA";
                const r8 = row[8] || "NA";
                const r9 = row[9] || "NA";
                const r10 = row[10] || "NA";

                table += `<tr>
                    <td>${r1}</td>
                    <td>${r0}</td>
                    <td>${r5}</td>
                    <td>${r6}</td>
                    <td>${r7}</td>
                    <td>${r8}</td>
                    <td>${r9}</td>
                    <td>${r10}</td>
                </tr>`;

                cards += `<div class="fee-card">
                    <div><span>Date:</span>${r1}</div>
                    <div><span>Slip No.:</span>${r0}</div>
                    <div><span>Amount:</span>${r5}</div>
                    <div><span>Fee Type:</span>${r6}</div>
                    <div><span>Session:</span>${r7}</div>
                    <div><span>Tuition Months:</span>${r8}</div>
                    <div><span>Transport Months:</span>${r9}</div>
                    <div><span>Exam Months:</span>${r10}</div>
                </div>`;
            }
        }

        document.getElementById("feeTable").innerHTML = table;
        document.getElementById("feeCards").innerHTML = cards;

        document.getElementById("loginBox").style.display = "none";
        document.getElementById("loader").style.display = "none";
        document.getElementById("portal").style.display = "block";

    } catch (err) {
        console.error(err);
        alert("Error loading data: " + err.message);
        document.getElementById("loader").style.display = "none";
        document.getElementById("loginBtn").disabled = false;
    }
}

function logout() {
    location.reload();
}
