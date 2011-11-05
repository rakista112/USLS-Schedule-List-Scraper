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

function extractSched(response){
    GM_openInTab('data:text/html;' + response.responseText);
}

GM_xmlhttpRequest({
    method: "GET",
    url: "http://students.usls.edu.ph/modules/modules.class_schedule.cfm",
    onload: extractSched
});
