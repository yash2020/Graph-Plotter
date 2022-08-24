
var canvas = document.getElementById("graphPlot");
var context = canvas.getContext("2d");
var gridNumber = 10;
var xstart, xend, ystart, yend, heig, wid;

var plotingPoints = [];
var plotingRangeX = 9;
var plotingRangeY = 9;

var diagonal = false;

init();

function init(){
    heig = window.innerHeight;
    wid = window.innerHeight;

    //make safe Area.
    xstart = makeSafeAre(5, wid); //this point starts form top of canvas...
    xend = wid - makeSafeAre(5, wid);
    ystart = makeSafeAre(5, heig);
    yend = heig - makeSafeAre(5, heig);

    document.getElementById("input-height").value = heig;
    document.getElementById("input-width").value = wid;

    drawCanvas(heig,wid,xstart,xend,ystart,yend); 
}

function refreshRange(dim){
    plotingRangeX = document.getElementById("input-range-x").value;
    plotingRangeY = document.getElementById("input-range-y").value;

    if(dim == 'x'){
        updateCanvaPloting("x",plotingRangeX,xstart,xend,plotingPoints);
    }else if(dim == 'y'){
        updateCanvaPloting("y",plotingRangeY,yend,ystart,plotingPoints);
    }else{
        console.log('Will Update Soon for range');
    }
    refreshCanvas();
}

function refreshSize(dim){
    heig = document.getElementById("input-height").value;
    wid = document.getElementById("input-width").value;
    // update ploting Points...
    //make safe Area.
    xstart = makeSafeAre(5, wid); //this point starts form top of canvas...
    xend = wid - makeSafeAre(5, wid);
    ystart = makeSafeAre(5, heig);
    yend = heig - makeSafeAre(5, heig);
    console.log(dim);
    if(dim == 'x'){
        updateCanvaPloting("x",plotingRangeX,xstart,xend,plotingPoints);
    }else if(dim == 'y'){
        updateCanvaPloting("y",plotingRangeY,yend,ystart,plotingPoints);
    }else{
        console.log('Will Update Soon');
    }
    
    refreshCanvas();
}

function refreshCanvas(){
    drawCanvas(heig,wid,xstart,xend,ystart,yend); 
}

function drawCanvas(height,width,xstart,xend,ystart,yend){
    canvas.height = height;
    canvas.width = width;
    // Draw x-axis
    canvas_arrow(xstart, yend, xend + 15, yend);
    //Draw y-axis
    canvas_arrow(xstart, yend, xstart, ystart - 15);

    //Text
    context.font = "15px Arial";
    context.fillText("X-axis", yend - 50, xend + 20);
    //Draw Grid...
    DrawGrid(xstart, xend, ystart, yend, gridNumber);
    
    if(diagonal){
        drawLine(xstart,ystart,xend,yend);
        drawLine(xstart,yend,xend,ystart);   
    }

    // Ploting Points... and line
    for(var i = 0 ; i < plotingPoints.length; i++){
        if(plotingPoints[i]){
            plotPoint(plotingPoints[i]['canvasX'],plotingPoints[i]['canvasY']);
            if(plotingPoints[i]['line']){
                if(plotingPoints[i-1]){
                    drawLine(plotingPoints[i-1]["canvasX"],plotingPoints[i-1]["canvasY"],plotingPoints[i]["canvasX"],plotingPoints[i]["canvasY"]);
                }else if(plotingPoints[i]){
                    drawLine(xstart,yend,plotingPoints[i]["canvasX"],plotingPoints[i]["canvasY"]);
                }
            }
        }
    }
}

function makeSafeAre(per, total) {
    return per * total / 100;
}

function DrawGrid(xstart, xend, ystart, yend, gridNumber) {
    var xdiff = xend / gridNumber;
    var ydiff = yend / gridNumber;
    for (var i = 1; i < gridNumber; i++) {
        // for X axis
        drawLine(xstart, yend - (ydiff * i), xend, yend - (ydiff * i), "rgba(255, 255, 255, 0.58)");
        // for y axis
        drawLine(xstart + (xdiff * i), ystart, xstart + (xdiff * i), yend, "rgba(255, 255, 255, 0.58)");
    }
}
function drawLine(xstart, ystart, xend, yend, colorString) {
    context.beginPath();
    context.moveTo(xstart, ystart);
    context.lineTo(xend, yend);
    context.lineWidth = 1;
    context.strokeStyle = colorString;
    context.stroke();
}

function canvas_arrow(fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 5), toy - headlen * Math.sin(angle - Math.PI / 5));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 5), toy - headlen * Math.sin(angle + Math.PI / 5));
    context.lineWidth = 2;
    context.strokeStyle = "rgba(255, 255, 255, 1)";
    context.stroke();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    // console.log(color);  // comment temperory...
    return color;
}

function plotPoint(x, y) {
    context.beginPath();
    context.arc(x, y, 4, 0, Math.PI * 2, false);
    context.lineWidth = 4;
    context.strokeStyle = getRandomColor();
    context.stroke();
}

function round5(num) {
    return Math.round(num / 5) * 5;
}

function addNewPoint() {
    console.log('Adding new Point');
    var ulselector = document.getElementById('input-tray');
    var liNum = ulselector.children.length;


    var liCreater = document.createElement("li");
    var textx = document.createTextNode("X: ");
    var textY = document.createTextNode(" Y: ");
    var pointConnect = document.createTextNode(`join ${liNum} - ${liNum + 1}`);
    var span = document.createElement("span");

    var inputXcret = document.createElement("input");
    inputXcret.setAttribute("type", "number");
    inputXcret.setAttribute("onchange", "updatePoint(this)");
    inputXcret.setAttribute("value", "0");
    var inputYcret = document.createElement("input");
    inputYcret.setAttribute("type", "number");
    inputYcret.setAttribute("onchange", "updatePoint(this)");
    inputYcret.setAttribute("value", "0");

    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("onchange", "updateLine(this)");
    span.appendChild(pointConnect);
    span.appendChild(checkbox);

    liCreater.appendChild(textx);
    liCreater.appendChild(inputXcret);
    liCreater.appendChild(textY);
    liCreater.appendChild(inputYcret);
    liCreater.appendChild(span);


    ulselector.appendChild(liCreater);
}

var dobdata;
function updateLine(data){    
    var indexconarr = Array.from(data.parentElement.parentElement.parentElement.children).indexOf(data.parentElement.parentElement);
    if(data.checked){
        //draw line
        if(plotingPoints[indexconarr-1]){
            drawLine(plotingPoints[indexconarr-1]["canvasX"],plotingPoints[indexconarr-1]["canvasY"],plotingPoints[indexconarr]["canvasX"],plotingPoints[indexconarr]["canvasY"]);
            plotingPoints[indexconarr]["line"] = data.checked;
        }else if(plotingPoints[indexconarr]){
            drawLine(xstart,yend,plotingPoints[indexconarr]["canvasX"],plotingPoints[indexconarr]["canvasY"]);
            plotingPoints[indexconarr]["line"] = data.checked;
        }else{
            alert('Enter Some Value...for Point');
        }
    }else{
        if(plotingPoints[indexconarr]){
            plotingPoints[indexconarr]["line"] = data.checked;
        }else{
            console.log('Enter some revelent Data..');
        }
        refreshCanvas();
    }
}

function updatePoint(data) {
    var indexOfLi = Array.from(data.parentElement.parentNode.children).indexOf(data.parentElement);
    var inputValues = data.parentElement.querySelectorAll('input');
    if (inputValues[2]) {
        var lineData = inputValues[2].checked;
    } else {
        var lineData = false;
    }
    
    var updateArray = checkPlotingRange(parseFloat(inputValues[0].value), parseFloat(inputValues[1].value));
    
    var canx = mapingRange(inputValues[0].value,0,plotingRangeX,xstart,xend);
    var cany = mapingRange(inputValues[1].value,0,plotingRangeY,yend,ystart);
    var dataToPush = {
        x: inputValues[0].value,
        y: inputValues[1].value,
        line: lineData,
        canvasX: canx,
        canvasY: cany
    };
    
    if(plotingPoints[indexOfLi] == undefined && !updateArray){
        // just Plot point
        plotPoint(canx,cany)
        plotingPoints[indexOfLi] = dataToPush;
    }else{
        // Refresh Canvas
        plotingPoints[indexOfLi] = dataToPush;
        refreshCanvas();
    }
    
    //Methord use full...
    /*Array.from(globData.parentElement.parentNode.children).indexOf(globData.parentElement)*/
}

function checkPlotingRange(x, y) {
    
    if (x < plotingRangeX && y < plotingRangeY) {
        // Continue....
        return false;
    } else if(x >= plotingRangeX) {
        plotingRangeX = round5(round5(makeSafeAre(20, x)) > 0 ? x + round5(makeSafeAre(20, x)) : x + 5);
        document.getElementById("input-range-x").value = plotingRangeX;
        updateCanvaPloting("x",plotingRangeX,xstart,xend,plotingPoints);
        return true;
    }else if(y >= plotingRangeY){
        plotingRangeY = round5(round5(makeSafeAre(20, y)) > 0 ? y + round5(makeSafeAre(20, y)) : y + 5);
        document.getElementById("input-range-y").value = plotingRangeY;
        updateCanvaPloting("y",plotingRangeY,yend,ystart,plotingPoints);
        return true;
    }

    // Return True and false...
    /*
    if return true refresh whole 
        "plotingPoinr" Array... and chane the canvas x and canvas y in data of plotingPoint array....
        update canvas
    else "false"
        refresh canvas for new update point... with existing array
    */
}

function mapingRange(unknownX,range1start,range1end,range2start,range2end){
   return (unknownX-range1start)/(range1end-range1start) * (range2end-range2start) + range2start;
}
function updateCanvaPloting(dimension,plotingRange,canvasStart,canvasEnd,plotingArray){
    // dimension give x and y value 
    // console.log(dimension,plotingRange,plotingArray);
    for(var i = 0; i < plotingArray.length;i++){
        // console.log(plotingArray[i]["canvas"+dimension.toUpperCase()]);
        if(plotingArray[i]){
            plotingArray[i]["canvas"+dimension.toUpperCase()] = mapingRange(plotingArray[i][dimension],0,plotingRange,canvasStart,canvasEnd);
        }
    }
}