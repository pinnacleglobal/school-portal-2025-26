const sheetID = "1TBykyZx-eRMBDrRGBGGA8p_49iHlVDKN3wt9wijHJWM";
const apiKey = "AIzaSyB5VIy4kIySW7bVrjNYMpL5rkqZ7Oe758E";

const masterSheet = "Master Data 25 (New)";
const feesSheet = "Fees Collection";
const awSheet = "AW";

function login(){

let adm = document.getElementById("admno").value;

if(adm==""){
alert("Enter Admission Number");
return;
}

document.getElementById("loginBox").style.display="none";
document.getElementById("loader").style.display="block";

loadStudent(adm);

}


async function loadStudent(adm){

/* MASTER DATA */

let masterURL=`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${masterSheet}?key=${apiKey}`;
let masterData=await fetch(masterURL).then(res=>res.json());

let rows=masterData.values;

let student=null;

for(let i=1;i<rows.length;i++){

if(rows[i][0]==adm){
student=rows[i];
break;
}

}

if(!student){
alert("Student not found");
location.reload();
return;
}

/* PROFILE DATA */

document.getElementById("studentName").innerText="Welcome "+student[1];

document.getElementById("class").innerText="Class : "+student[2];

document.getElementById("adm").innerText="Admission No : "+adm;


/* AW DATA */

let awURL=`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${awSheet}?key=${apiKey}`;
let awData=await fetch(awURL).then(res=>res.json());

let awRows=awData.values;

for(let i=1;i<awRows.length;i++){

if(awRows[i][1]==adm){

document.getElementById("photo").src=awRows[i][59];

document.getElementById("father").innerText="Father : "+awRows[i][6];

document.getElementById("mother").innerText="Mother : "+awRows[i][5];

document.getElementById("phone").innerText="Phone : "+awRows[i][22];

document.getElementById("address").innerText="Address : "+awRows[i][7];

break;

}

}


/* FEES DATA */

let feesURL=`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${feesSheet}?key=${apiKey}`;
let feesData=await fetch(feesURL).then(res=>res.json());

let feeRows=feesData.values;

let table="";

for(let i=1;i<feeRows.length;i++){

if(feeRows[i][2]==adm){

let tuition=feeRows[i][8] || "NA";
let transport=feeRows[i][9] || "NA";
let exam=feeRows[i][10] || "NA";

table+=`
<tr>

<td>${feeRows[i][1]}</td>

<td>${feeRows[i][0]}</td>

<td>${feeRows[i][5]}</td>

<td>${feeRows[i][6]}</td>

<td>${feeRows[i][7]}</td>

<td>${tuition}</td>

<td>${transport}</td>

<td>${exam}</td>

</tr>
`;

}

}

document.getElementById("feeTable").innerHTML=table;

document.getElementById("loader").style.display="none";

document.getElementById("portal").style.display="block";

}


function logout(){

location.reload();

}
