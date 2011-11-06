// ==UserScript==
// @name USLS Schedule List Scraper
// @description Makes it easier to extract and save your schedule in other file formats
// @include http://*students.usls.edu.ph/index.cfm?*
// @version 0.42
// @copyright Ray John E. Alovera
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
    var html = document.createElement('html');
    var head = document.createElement('head');
    var body = document.createElement('body');
    var tblResult = document.createElement('table');

    // For the header
    var thead = document.createElement('thead');


    // For injecting styles
    var oddCSS = document.createElement('style');

    oddCSS.type = 'text/css';
    oddCSS.textContent = 'table.tablesorter tbody tr.odd td{background-color:#DCE4CF;}';

    oddCSS.textContent += 'table.tablesorter{'+
                         'background-color:#cdcdcd;'+
                         'font-family:arial;'+
                         'margin:10px 0 15px;'+
	                 'text-align:left;' +
                         'width:100%;}';

    oddCSS.textContent += 'table.tablesorter tbody td {'+
                          'background-color: #FFFFFF;'+
                          'color: #3D3D3D;'+
                          'padding: 4px;'+
                          'vertical-align: top;}';

    oddCSS.textContent += 'table.tablesorter thead tr th, table.tablesorter tfoot tr th{' +
	                  'background-color: #C4E4A5;' +
	                  'border: 1px solid #FFFFFF;' +
                          'padding:4px;}';


    oddCSS.textContent += '.unit{text-align:center;}';


    // Change table id to class_sched
    tblResult.id = 'class_sched';
    // Change class name to tablesorter
    tblResult.className = 'tablesorter';

    // Modify table's cellspacing
    tblResult.cellSpacing = '1';

    for(row = 0; row < tblSched.length; row++){
	var tr = document.createElement('tr');

	// iterate through table and put elements in table
	for(col = 0; col < tblSched[0].length; col++){
	    var td = document.createElement('td');
	    td.textContent = tblSched[row][col];

	    // if in Units column
	    // change class to unit
	    if(col == 2 && row > 0){
		td.className = 'unit';
	    }

	    tr.appendChild(td);

	}

	    // Give odd rows odd class name

	    // Only check rows below header
	    if(row > 0 && (row - 1) % 2 == 1){
		tr.className = 'odd';
	    }

	tblResult.appendChild(tr);

    }

    // Put the header elements in thead
    thead.appendChild(tblResult.rows[0]);
    thead.innerHTML = thead.innerHTML.replace(/td/g, 'th');

    tblResult.insertBefore(thead, tblResult.firstChild);
    body.appendChild(tblResult);
    head.appendChild(oddCSS);
    html.appendChild(head);
    html.appendChild(body);
    dummyDiv.appendChild(html);

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
    var saveLink = document.createElement('p');

    saveLink.innerHTML = "Export Schedule";
    saveLink.id = "btnSchedSave";
    saveLink.href ='#';
    
    GM_addStyle("\
        #btnSchedSave{\
        background: #459E00;\
        padding: 4px 8px;\
        color: white;\
        font-weight: bold;\
        font-size:14px;\
        text-align:center;\
        margin: 15px;\
        cursor: pointer;\
        hover: #4EB300;\
        text-decoration:none;\
        width:110px;\
        border-radius:3px;\
        -moz-border-radius:3px;\
        -o-border-radius:3px;\
        -webkit-border-radius:3px;\
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



