const canva = $("canvas").get( 0 );
canva.width = Number.parseInt(window.getComputedStyle(canva).width);
const gridLineSize = 1;
canva.height =Number.parseInt(window.getComputedStyle(canva).height);
const l = Math.round(canva.getBoundingClientRect().left);
const t = Math.round(canva.getBoundingClientRect().top);
let gameState = [[]];
const gameProperties = {
    started: false,
}


const r = canva.getContext("2d");
const dims = (
    function() {
        var rows = 30;
        var cols = 57;
        resizeGameState(rows, cols);
        return {
            updateRow: function(val){
                rows = val;
                resizeGameState(rows, cols)
                makeGrid(val, cols);
            },
            updateCol: function(val){
                cols = val;
                resizeGameState(rows, cols);
                makeGrid(rows, val);
            },
            doNothing: function(){
                resizeGameState(rows, cols);
                gameState.forEach(e =>{
                    e.fill(false);
                })
                makeGrid(rows, cols);
            },
            getRows: function(){
                return rows;
            },
            getCols: function(){
                return cols;
            }
        }
    })();
makeGrid(dims.getRows(), dims.getCols());
$("#start").click(e =>{
    $(".counter button").attr("disabled", true);
    $("#reset").attr("disabled", false);
    $("#start").attr("disabled", true);
    gameProperties.started = true;  
})
$("#reset").click(e =>{
    $(".counter button").attr("disabled", false);
    $("#start").attr("disabled", false);
    $("#reset").attr("disabled", true);
    gameProperties.started = false;
    dims.doNothing();
})
$(".counter").click(function(e){
    const a = $(this).attr("id");
    const t = $(e.target).parent();
    const direction = t.attr("class");
    const number = Number.parseInt(t.parent().children("div").children("span").text());
    
    if (Number.isNaN(number))
        return;
    if (direction == "up"){
        t.parent().children("div").children("span").text(number + 1)
        if (a == "rows")
            dims.updateRow(number + 1);
        else
            dims.updateCol(number + 1)
    }
    else{
        t.parent().children("div").children("span").text(number - 1)
        if (a == "rows")
            dims.updateRow(number - 1)
        else
            dims.updateCol(number - 1)
    }
})
function getGridCellHeight(height){
    return Math.round((height - gridLineSize * (dims.getRows() - 1)) / dims.getRows());
}
function getGridCellWidth(width){
    return Math.round((width - gridLineSize * (dims.getCols() - 1)) / dims.getCols());
}
function resizeGameState(rows, cols){
    const tmp = new Array(rows).fill(new Array(cols).fill(false));
    for (let i = 0; i < Math.min(gameState.length, rows); i++){
        for (let j = 0; j < Math.min(gameState[0].length, cols); j++){
            tmp[i][j] = gameState[i][j];
        }
    }
    gameState = tmp;
}
function paintGrid(){
    const gridCellWidth = getGridCellWidth(canva.width);
    const gridCellHeight = getGridCellHeight(canva.height);
    
    function paintCell(x, y){
        r.fillRect(x * (gridCellWidth + gridLineSize), y * (gridCellHeight +  gridLineSize), gridCellWidth, gridCellHeight);
    }
    for (let i = 0; i < gameState.length; i++){
        for (let j = 0; j < gameState[0].length; j++){
            r.fillStyle = gameState[i][j] ? "black" : "white";
            paintCell(j, i);
        }
    }
}
r.fillStyle = "black";
function makeGrid(row, col){
    const {width, height} = canva;
    r.fillStyle = "black";
    r.clearRect(0, 0, width, height);
    const gridCellWidth = getGridCellWidth(width);
    const gridCellHeight= getGridCellHeight(height);
    for (let i = 0; i < col - 1; i++)
        // console.log(gridCellWidth * (i + 1) + i* gridLineSize);
        r.fillRect(gridCellWidth * (i + 1) + i* gridLineSize, 0, gridLineSize, height);
    for (let i = 0; i < row - 1; i++)
        r.fillRect(0, gridCellHeight * (i + 1) + i * gridLineSize, width, gridLineSize);
}
// $(canva).click(e => {
//     const {width, height} = canva;
//     const gridCellWidth = getGridCellWidth(width);
//     const gridCellHeight = getGridCellHeight(height);
    
//     const x = Math.floor((e.clientX - l) / (gridLineSize + gridCellWidth));
//     const y = Math.floor((e.clientY - t) / (gridCellHeight + gridLineSize));
//     handleClick(x, y);
// })
const handleMouseMovement = (function(){
    var dragging = false;
    return function(e){
        const {width, height} = canva;
        const gridCellWidth = getGridCellWidth(width);
        const gridCellHeight = getGridCellHeight(height);
        
        const x = Math.floor((e.clientX - l) / (gridLineSize + gridCellWidth));
        const y = Math.floor((e.clientY - t) / (gridCellHeight + gridLineSize));
        if (e.type == "mousedown"){
            handleClick(x, y, "down")
            dragging = true;
        }
        if (e.type == "mouseup"){
            dragging = false;
            handleClick(x, y, "up")
        }
        if (e.type == "mousemove" && dragging){
            handleClick(x, y, "drag");    
        }
    }
})();
$(canva).on("mousedown mouseup mousemove", handleMouseMovement);
function handleClick(x, y, type){
    if (type == "up"){
        this.color = !gameState[y][x];
        gameState[y][x] = this.color;
    }
    if (type == "drag"){
        gameState[y][x] = this.color;
    }
    r.fillStyle = this.color ? "black" : "white";
    r.fillRect(x * (gridCellWidth + gridLineSize), y * (gridCellHeight +  gridLineSize), gridCellWidth, gridCellHeight);

}
function startGame(){
    const {width, height} = canva;
    
}