//custom max min header filter
var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams){

    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 100);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    function buildValues(){
        success({
            start:start.value,
            end:end.value,
        });
    }

    function keypress(e){
        if(e.keyCode == 13){
            buildValues();
        }

        if(e.keyCode == 27){
            cancel();
        }
    }

    end = start.cloneNode();

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);


    container.appendChild(start);
    container.appendChild(end);

    return container;
}

//custom max min filter function
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    if(rowValue){
        if(headerValue.start != ""){
            if(headerValue.end != ""){
                return rowValue >= headerValue.start && rowValue <= headerValue.end;
            }else{
                return rowValue >= headerValue.start;
            }
        }else{
            if(headerValue.end != ""){
                return rowValue <= headerValue.end;
            }
        }
    }

    return false; //must return a boolean, true if it passes the filter.
}

var table = new Tabulator("#example-table", {
    layout:"fitData",
    height:"100%",
    movableRows:true,
    layout:"fitColumns",
    pagination:"local",
    paginationSize:15,
    paginationSizeSelector:[30, 60, 90],
    placeholder:"No Data Set",
    columns:[
        {rowHandle:true, formatter:"handle", headerSort:false, frozen:true, width:40, minWidth:40},
        {title:"Event Name", field:"name", sorter:"string", headerFilter:"input"},
        {title:"Dates", field:"dates", sorter:"string", headerFilter:"input"},
        {title:"Location", field:"location", sorter:"string", headerFilter:"input"},
        {title:"URL", field:"url", sorter:"string", headerFilter:"input"},
        {title:"Announcement", field:"announcement", sorter:"string", headerFilter:"input"},
    ],
});

//Trigger sort when "Trigger Sort" button is clicked
$("#sort-trigger").click(function(){
    table.setSort($("#sort-field").val(), $("#sort-direction").val());
});

$(document).ready(function(){
    var ajaxConfig = {
        dataType: 'json',
        headers: {
            "X-DreamFactory-Api-Key": config.apiKey
        },
    };

    table.setData(config.spreadsheetUrl, {}, ajaxConfig);
});
