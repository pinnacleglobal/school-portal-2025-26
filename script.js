const SHEET_ID="1TBykyZx-eRMBDrRGBGGA8p_49iHlVDKN3wt9wijHJWM";
const API_KEY="AIzaSyB5VIy4kIySW7bVrjNYMpL5rkqZ7Oe758E";

async function getSheet(name){

const url=`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${name}?key=${API_KEY}`;

const res=await fetch(url);

const data=await res.json();

return data.values || [];

}

async function login(){

const code=document.getElementById("code").value.trim();

if(!code){
document.getElementById("msg").innerText="Enter Login Code";
return;
}

document.getElementById("loader").style.display="flex";

const aw=await getSheet("AW");

let admission="";
let name="";

for(let i=1;i<aw.length;i++){

if(aw[i][29] && aw[i][29].trim()==code){

admission=aw[i][1];
name=aw[i][3];

break;

}

}

if(!admission){

document.getElementById("loader").style.display="none";

document.getElementById("msg").innerText="Invalid Code";

return;

}

loadDashboard(admission,name);

}

async function loadDashboard(admission,name){

const master=await getSheet("Master Data 25 (New)");

let studentClass="";

for(let i=1;i<master.length;i++){

if(master[i][1] && master[i][1]==admission){

studentClass=master[i][13];

break;

}

}

const fees=await getSheet("Fees Collection");

let table="";
let cards="";

for(let i=1;i<fees.length;i++){

if(fees[i][2] && fees[i][2]==admission){

let date=fees[i][1]||"NA";
let slip=fees[i][0]||"NA";
let deposit=fees[i][5]||"NA";
let type=fees[i][6]||"NA";
let session=fees[i][7]||"NA";
let tuition=cleanValue(fees[i][8]);
let transport=cleanValue(fees[i][9]);
let exam=cleanValue(fees[i][10]);
let payment=fees[i][11]||"NA";

table+=`
<tr>
<td>${date}</td>
<td>${slip}</td>
<td>${deposit}</td>
<td>${type}</td>
<td>${session}</td>
<td>${tuition}</td>
<td>${transport}</td>
<td>${exam}</td>
<td>${payment}</td>
</tr>
`;

cards+=`
<div class="fee-card">

<b>Date:</b> ${date}<br>
<b>Slip Number:</b> ${slip}<br>
<b>Fee Deposited:</b> ${deposit}<br>
<b>Fee Type:</b> ${type}<br>
<b>Session:</b> ${session}<br>
<b>Tuition Months:</b> ${tuition}<br>
<b>Transport Months:</b> ${transport}<br>
<b>Exam Months:</b> ${exam}<br>
<b>Payment Mode:</b> ${payment}

</div>
`;

}

}

document.getElementById("feesTable").innerHTML=table;
document.getElementById("cardContainer").innerHTML=cards;

document.getElementById("welcome").innerText="Welcome "+name;
document.getElementById("admission").innerText=admission;
document.getElementById("class").innerText=studentClass;

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("dashboard").classList.remove("hidden");

document.getElementById("loader").style.display="none";

}

function cleanValue(v){

if(!v) return "NA";

v=v.trim();

if(v.toLowerCase()=="no") return "NA";

return v;

}

function logout(){

document.getElementById("dashboard").classList.add("hidden");
document.getElementById("loginPage").classList.remove("hidden");
document.getElementById("code").value="";

}
