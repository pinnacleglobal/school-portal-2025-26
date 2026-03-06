<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Student Portal</title>

<style>
body {
    font-family: Arial;
    margin: 0;
    background: #f2f5ff;
}

/* HEADER */
.header {
    background: #0b3d91;
    text-align: center;
    padding: 20px;
    color: white;
}

.logo {
    width: 140px;
    margin-bottom: 10px;
}

/* LOGIN */
.login-box {
    text-align: center;
    padding: 30px;
}

input {
    padding: 12px;
    width: 230px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 12px 25px;
    font-size: 16px;
    background: #0b3d91;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background: gray;
}

/* LOADER */
.loader {
    display: none;
    text-align: center;
    padding: 20px;
    font-size: 18px;
}

/* PROFILE INFO */
.profile {
    text-align: center;
    background: white;
    margin: 15px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    line-height: 1.6;
}

.student-name {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
}

.center-detail, .info {
    font-size: 16px;
    margin-bottom: 5px;
}

/* Section header */
.section-title {
    background: #d4af37;
    color: black;
    padding: 12px;
    margin: 15px;
    border-radius: 6px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}

/* DESKTOP TABLE */
.table-container {
    margin: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

th {
    background: #0b3d91;
    color: white;
    padding: 10px;
    font-size: 14px;
}

td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
    font-size: 14px;
}

/* MOBILE CARDS */
@media(max-width:600px) {
    table, thead, tbody {
        display: none;
    }
    #feeCards {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin: 10px;
    }
    .fee-card {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .fee-card:nth-child(odd) { background: #e6f0ff; }
    .fee-card div {
        font-size: 14px;
    }
    .fee-card span {
        font-weight: bold;
        color: #0b3d91;
        margin-right: 5px;
    }
}

.logout {
    text-align: center;
    margin: 20px;
}
</style>
</head>

<body>

<div class="header">
    <img src="images/logo.png" class="logo">
    <h2>Student Fee Portal</h2>
</div>

<div class="login-box" id="loginBox">
    <h3>Student Login</h3>
    <input type="text" id="loginCode" placeholder="Enter Login Code">
    <br><br>
    <button id="loginBtn" onclick="login()">Login</button>
</div>

<div class="loader" id="loader">Loading Student Data...</div>

<div id="portal" style="display:none">
    <div class="profile">
        <div class="student-name" id="studentName"></div>
        <div class="center-detail" id="class"></div>
        <div class="center-detail" id="adm"></div>
        <div class="info" id="father"></div>
        <div class="info" id="mother"></div>
        <div class="info" id="phone"></div>
        <div class="info" id="address"></div>
    </div>

    <div class="section-title">Fee Details</div>

    <div class="table-container">
        <!-- Desktop Table -->
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Slip No.</th>
                    <th>Amount</th>
                    <th>Fee Type</th>
                    <th>Session</th>
                    <th>Tuition</th>
                    <th>Transport</th>
                    <th>Exam</th>
                </tr>
            </thead>
            <tbody id="feeTable"></tbody>
        </table>
        <!-- Mobile Cards -->
        <div id="feeCards"></div>
    </div>

    <div class="logout">
        <button onclick="logout()">Logout</button>
    </div>
</div>

<script src="script.js"></script>
</body>
</html>
