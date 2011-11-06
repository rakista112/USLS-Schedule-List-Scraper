// ==UserScript==
// @name USLS Schedule List Scraper
// @description Makes it easier to extract and save your schedule in other file formats
// @include http://localhost/gmScripts/USLS_Sched_Scraper*
// @include http://*students.usls.edu.ph/index.cfm?*
// @version 0.42
// @copyright Ray John E. Alovera
// @run-at document-end
// @unwrap
// ==/UserScript==

// ui-tabs-1
// class_sched

/*
  Insert save button
  After press, do xmlhttprequest
  Format output
  Print output
*/

String.prototype.trim = function(){
    return this.replace(/^\s*/, '').replace(/\s*$/, '');
}

function formatSched(tblSched){
    
    // Dummy elements for output
    var dummyDiv = document.createElement('div');
    var tblResult = document.createElement('table');
    tblResult.className = 'class_sched';

    for(row = 0; row < tblSched.length; row++){
	var tr = document.createElement('tr');

	// iterate through table and put elements in table
	for(col = 0; col < tblSched[0].length; col++){
	    var td = document.createElement('td');
	    td.textContent = tblSched[row][col];

	    tr.appendChild(td);

	}

	tblResult.appendChild(tr);
	dummyDiv.appendChild(tblResult);

    }

    return dummyDiv;

}

function extractSched(response){
    var dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = response.responseText;
    var tblSched = '';
    var tblRows = [];

    // Iterate through div DOM for element with
    // class_sched id
    for(i = 0; i < dummyDiv.children.length; i++){
	if(dummyDiv.children[i].id == "class_sched"){
	    tblSched = dummyDiv.children[i];
	}
    }


    // Loop for rows
    for(row = 0; row < tblSched.rows.length; row++){
	tblRows[row] = new Array();
	// Loop for columns
	for(col = 0; col < tblSched.rows[row].children.length; col++){
	    tblRows[row][col] = tblSched.rows[row].children[col].textContent.trim();
	}
    }

    var formattedSched = formatSched(tblRows);

    var JSONSched = JSON.stringify(tblRows);

    GM_openInTab('data:text/html;charset=UTF-8,' + encodeURIComponent(formattedSched.innerHTML));
}


function insertSaveButton(){

    var uiTabs = document.getElementById('tabs');
    var saveLink = document.createElement('a');

    saveLink.innerHTML = "Save Schedule";
    saveLink.id = "btnSchedSave";
    saveLink.href ='#';
    
    GM_addStyle("\
        #btnSchedSave{\
        background: #459E00;\
        padding: 8px 10px;\
        color: white;\
        font-weight: bold;\
        margin: 15px;\
        cursor: pointer;\
        hover: #4EB300;\
        text-decoration:none;\
        border-radius:5px;\
        -moz-border-radius:5px;\
        -o-border-radius:5px;\
        -webkit-border-radius:5px;\
        }\
        \
        #btnSchedSave:hover{\
            background:#60DB00;\
        \
        }\
        \
        #btnSchedSave:active{\
            background:#FF2617;\
        \
        }\
        \
        ");

    // Add click event listener
    saveLink.addEventListener('click', function (){
	GM_xmlhttpRequest({
	    method: "GET",
	    url: "http://students.usls.edu.ph/modules/modules.class_schedule.cfm",
	    onload: extractSched
	});
	return false;

    }, false);

    uiTabs.appendChild(saveLink);

}
insertSaveButton();



