function ShowElement(elementId){
    var jqSelect = '#' + elementId;
    $(jqSelect).show();
}

function HideElement(elementId){
    var jqSelect = '#' + elementId;
    $(jqSelect).hide();
}

function showSpinner(show){
    if (show) {
        //Adjust to screen size
        //var pHeight = window.innerHeight;
        //var pWidth =window.innerWidth;
        //var sH = parseInt($('#spinner').css('height'));
        //var sW = parseInt($('#spinner').css('width'));
        //$('#spinner').css('top',(pHeight-sH)/2)
        //$('#spinner').css('left',(pWidth-sW)/2)
        //var maxZ = getMaxZ($.mobile.activePage) + 1;
        //$('#spinner').css('z-index',maxZ);
        //Show
        $('#spinner').show();
    } else {
        $('#spinner').hide();
    }
}


/*
function getMaxZ(element,desiredReturn, computed){
if (!desiredReturn) {desiredReturn = 'value';}
if (!element){element = $(document);}

//Set defaults
var highestZ = 0;
var champion = element;

//Start looking
var currentZ, selector;

//Get all descendants or only those with explicit z value
if (!computed){selector = '[style*="z-index"]';}
if (computed){selector = '*';}
$(element).find(selector).each(function(){

var compStyle = getComputedStyle(this, "");
currentZ = parseInt(compStyle.getPropertyValue("z-index"));

//currentZ = parseInt($(this).css('z-index'));
if (isN(currentZ) && currentZ > highestZ) {
highestZ = currentZ;
champion = $(this);
}
})
//Return value or element
if (desiredReturn == 'value'){
return highestZ;
} else if (desiredReturn == 'element') {
return champion;
} else {
return highestZ;
}
}
*/