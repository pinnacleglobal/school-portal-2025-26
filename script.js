const sheetID="1TBykyZx-eRMBDrRGBGGA8p_49iHlVDKN3wt9wijHJWM";
const apiKey="AIzaSyB5VIy4kIySW7bVrjNYMpL5rkqZ7Oe758E";

const masterSheet="Master Data 25 (New)";
const feesSheet="Fees Collection";
const awSheet="AW";

async function login(){

    let code=document.getElementById("loginCode").value.trim();

    if(code==""){
        alert("Enter Login Code");
        return;
    }

    document.getElementById("loginBtn").disabled=true;
    document.getElementById("loader").style.display="block";

    /* Fetch AW sheet to check login code */
    let awURL=`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${awSheet}?key=${apiKey}`;
    let awData=await fetch(awURL).then(res=>res.json());
    let awRows=awData.values;

    let admission="";
    let studentName="";

    for(let i=1;i<awRows.length;i++){
        // Column AD is 30th column, index 29
        if(awRows[i][29] && awRows[i][29].trim()==code){
            admission=awRows[i][1];       // Column B for admission number
            studentName=awRows[i][3];     // Column D for student name
            break;
        }
    }

    if(!admission){
        alert("Invalid Login Code");
        document.getElementById("loginBtn").disabled=false;
        document.getElementById("loader").style.display="none";
        return;
    }

    loadPortal(admission, studentName);

}

async function loadPortal(adm, name){
    document.getElementById("loginBox").style.display="none";
    document.getElementById("studentName").innerText="Welcome "+name;

    /* Fetch Master Sheet to get class */
    let masterURL=`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${masterSheet}?key=${apiKey}`;
    let masterData=await fetch(masterURL).then(res=>res.json());
    let rows=masterData.values;

    let studentClass="";

    for(let i=1;i<rows.length;i++){
        if(rows[i][1]==adm){
            studentClass=rows[i][13]; // Column N is index 13
            break;
        }
    }

    document.getElementById("class").innerText="Class : "+studentClass;
    document.getElementById("adm").innerText="Admission No : "+adm;

    /* Fetch AW again for photo, father, mother, phone, address */
    let awURL=`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${awSheet}?key=${apiKey}`;
    let awData=await fetch(awURL).then(res=>res.json());
    let awRows=awData.values;

    for(let i=1;i<awRows.length;i++){
        if(awRows[i][1]==adm){
            document.getElementById("photo").src=awRows[i][59];   // Column BH
            document.getElementById("father").innerText="Father : "+awRows[i][6];
            document.getElementById("mother").innerText="Mother : "+awRows[i][5];
            document.getElementById("phone").innerText="Phone : "+awRows[i][22];
            document.getElementById("address").innerText="Address : "+awRows[i][7];
            break;
        }
    }

    /* Fetch Fees Collection */
    let feesURL=`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${feesSheet}?key=${apiKey}`;
    let feesData=await fetch(feesURL).then(res=>res.json());
    let feeRows=feesData.values;

    let table="";
    for(let i=1;i<feeRows.length;i++){
        if(feeRows[i][2]==adm){
            let tuition=feeRows[i][8]||"NA";
            let transport=feeRows[i][9]||"NA";
            let exam=feeRows[i][10]||"NA";

            table+=`<tr>
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

    document.getElementById("feeTable").innerHTML=table;

    document.getElementById("loader").style.display="none";
    document.getElementById("portal").style.display="block";
}
function logout(){

location.reload();

}
