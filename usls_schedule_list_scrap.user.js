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

String.prototype.trim = function(){
    return this.replace(/^\s*/, '').replace(/\s*$/, '');
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

    var JSONSched = JSON.stringify(tblRows);

    GM_openInTab('data:text/plain;charset=UTF-8,' + encodeURIComponent(JSONSched));
}

GM_xmlhttpRequest({
    method: "GET",
    url: "http://students.usls.edu.ph/modules/modules.class_schedule.cfm",
    onload: extractSched
});

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

    uiTabs.appendChild(saveLink);

}
insertSaveButton();

