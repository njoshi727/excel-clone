let addSheetBtnContainer = document.querySelector(".add-Sheet-container");
let numberColContainer = document.querySelector(".number-column-container");
let alphabetRowContainer = document.querySelector(".row-alphabet-container");
let cellsContainer = document.querySelector(".cells-container");
let addressBarContainer = document.querySelector(".address-bar");
let allAlignmentBtnList = document.querySelectorAll(".alignmentBtnList");
let allFormattingBtnList = document.querySelectorAll(".formatting-btn");
let sizeList = document.getElementById("size-list");
let colorOptions = document.querySelectorAll(".colorOptions");
let activeSheetIdx = 0;


//allSheetDataBase
let allSheetDB = {};

let currentSelectedCell = {
    colid :0 ,
    rowid : 0
}

addColAlphabet();
addRowIdx();
addRowColInGrid();
             
//After Adding rows and cols in our grid , we will attach an event listener to it 
let allCells = document.querySelectorAll(".cell");
allCells.forEach(function(cell){
    cell.addEventListener("click",function(e){
        let rowid = Number(cell.getAttribute("rid"));
        let colid = Number(cell.getAttribute("cid"));

        let address = `${String.fromCharCode(65+colid)}${rowid+1}`;
        //currentSelectedCell is a global object which keep track of current selected cell
        //Its default/initial value is 0.
        currentSelectedCell = {colid,rowid};
        addressBarContainer.value = address;


        //currentCellDB
        let currentSheet = allSheetDB[activeSheetIdx];
        let currentCellDB = currentSheet[currentSelectedCell.rowid][currentSelectedCell.colid];

        //currentCellUI
        let currentCellIdx = currentSelectedCell.rowid*26+currentSelectedCell.colid;
        let currentCellUI = allCells[currentCellIdx];

        // As per DataBase we have to change formattiing Property of currentCellUI
        // as well as , we have to add or remove active classes from various button

        if(currentCellDB.bold){
            currentCellUI.style.fontWeight = "bold";
            allFormattingBtnList[0].classList.add("active-btn");
        } 
        else{
            currentCellUI.style.fontWeight = "normal";
            allFormattingBtnList[0].classList.remove("active-btn");
        }

        if(currentCellDB.underline){
            currentCellUI.style.textDecoration = "underline";
            allFormattingBtnList[1].classList.add("active-btn");
        }
        else {
            currentCellUI.style.textDecoration = "none";
            allFormattingBtnList[1].classList.remove("active-btn");
        }
        
        if(currentCellDB.underline){
            currentCellUI.style.fontStyle = "italic";
            allFormattingBtnList[2].classList.add("active-btn");
        }
        else{
            currentCellUI.style.fontStyle = "normal";
            allFormattingBtnList[0].classList.remove("active-btn");
        }

        //We can choose any one out of L C R for text alignment
        allAlignmentBtnList.forEach(function(btn){
            btn.classList.remove("active-btn");
        })
        let selectedAlignmentButton = document.querySelector(`button[value="${currentCellDB.textAlignment}"]`);
        selectedAlignmentButton.classList.add("active-btn");
        currentCellUI.style.textAlignment = `${currentCellDB.textAlignment}`;

        //fontFamily
        
        for (var option of document.getElementById("fonts-list").options)
        {
            if (option.value === currentCellDB.fonttype)
            {
                option.selected = true;
                break;
            }
        }
        currentCellUI.style.fontFamily = currentCellDB.fonttype;

        //fontSize

        for (var option of document.getElementById("size-list").options)
        {
            if (option.value === currentCellDB.fontSize)
            {
                option.selected = true;
                break;
            }
        }
        currentCellUI.style.fontSize = currentCellDB.fontSize+"px";

        //color (fontColor)
        document.getElementById("color").value = currentCellDB.fontcolor;
        currentCellUI.style.color = currentCellDB.fontcolor; 

        //backgroundColor
        document.getElementById("backgroundColor").value = currentCellDB.backgroundColor;
        currentCellUI.style.backgroundColor = currentCellDB.backgroundColor;

        currentCellUI.innerText = currentCellDB.value;
    })

    cell.addEventListener("blur",function(e){
        let rowid = Number(cell.getAttribute("rid"));
        let colid = Number(cell.getAttribute("cid"));

        //currentSelectedCell is a global object which keep track of current selected cell
        //Its default/initial value is 0.
        currentSelectedCell = {colid,rowid};

        //currentCellDB
        let currentSheet = allSheetDB[activeSheetIdx];
        let currentCellDB = currentSheet[currentSelectedCell.rowid][currentSelectedCell.colid];
        currentCellDB.value = cell.innerText;
    })

})

makeNewSheet();

//makeNewSheet Function 
function makeNewSheet(idx=0){
    let sheetListContainer = document.querySelector(".sheet-list-container");
    let activeSheet = sheetListContainer.querySelector(".active-sheet");
    if(activeSheet != null){
        activeSheet.classList.remove("active-sheet");
    }

    let html = `<div class="sheet active-sheet" sheetid="${idx}"> Sheet ${Number(idx+1)}</div>`;
    sheetListContainer.innerHTML += html;

    //add a event listener to current sheet div so that when they get selected , they become active sheet
    //Using sheetId we can get current sheet 
    // let currentSheet = sheetListContainer.querySelector(`div[sheetid="${idx}"]`);
    let allSheetsArray = sheetListContainer.querySelectorAll(".sheet");
    allSheetsArray.forEach(sheet => {
        sheet.addEventListener("click",function(e){
            let activeSheet = sheetListContainer.querySelector(".active-sheet");
            if(activeSheet != null){
                activeSheet.classList.remove("active-sheet");
            }
            sheet.classList.add("active-sheet");

            //Update current Sheet Idx 
            activeSheetIdx = Number(sheet.getAttribute("sheetid"));
            //click all button on current sheet

            allCells.forEach(function(cell){
                cell.click();
            })
            allCells[0].click();
        }) 
    })

    makeNewSheetDataBase(idx);
    activeSheetIdx = Number(idx);
    allCells.forEach(function(cell){
        cell.click();
    })
    
    allCells[0].click();
}

//addRow
function addRowIdx(){
    let html = ``;
    for(let i=0;i<100;i++){
        html += `<div class = "number-column"> ${i+1} </div>`;
    }
    numberColContainer.innerHTML = html;
}

function addColAlphabet(){
    let html = ``;
    for(let i=0;i<26;i++){
        html += `<div class="row-alphabet"> ${String.fromCharCode(65+i)} </div>`;
    }
    alphabetRowContainer.innerHTML = html;
}

function addRowColInGrid(){
    let html = ``;
    for(let row=0;row<100;row++){
        html += `<div class="row-container">`;
        // ${String.fromCharCode(65+col)}${row+1}
        for(let col = 0;col < 26;col++){
            html += `<div class="cell" cid=${col} rid=${row} contenteditable="true"></div>`
        }
        html += `</div>`;
    }
    cellsContainer.innerHTML = html;
}

addSheetBtnContainer.addEventListener("click",function(e){
    let allSheetArray = document.querySelectorAll(".sheet");
    //allSheetArray[allSheetArray.length-1] will contain the last element of allSheetArray
    let lastSheetId = allSheetArray[allSheetArray.length-1].getAttribute("sheetId");
    lastSheetId  = Number(lastSheetId);
    //now make a new sheet having id = lastSheetId+1
    makeNewSheet(lastSheetId+1);
})

allAlignmentBtnList.forEach(function(btn){
    btn.addEventListener("click",function(e){
        let textAlignment = e.target.value;
        let currentCellIdx = currentSelectedCell.rowid*26+currentSelectedCell.colid;
        allCells[currentCellIdx].style.textAlign = textAlignment;
    })
})

sizeList.addEventListener('input',function(){
    let updatedSize = sizeList.value;
    let currentCellIdx = currentSelectedCell.rowid*26+currentSelectedCell.colid;
    allCells[currentCellIdx].style.fontSize = updatedSize+"px";
})

colorOptions.forEach(function(colorOption){
    colorOption.addEventListener("input",function(e){
        let currentCellIdx = currentSelectedCell.rowid*26+currentSelectedCell.colid;
        let updatedValue = e.target.value;
        if(e.target.getAttribute("id")==="backgroundColor"){
            allCells[currentCellIdx].style.backgroundColor = updatedValue;
        }else{
            allCells[currentCellIdx].style.color = updatedValue;
        }
    })
})



//Whenever a New Sheet will be made , a corresponding 2D
//array is also needed. So , we will make a 2d Array correspond
//to new sheet using this function and will set its initial value
function makeNewSheetDataBase(idx){
    let sheetDB = [];
    for(let i=0;i<100;i++){
        let row = [];
        for(let j=0;j<26;j++){
            let cellObj = {
                bold : false,
                italic : false,
                underline : false,
                textAlignment : "left",
                fonttype : "Arial",
                fontSize : "10",
                fontcolor : "rgb(0,0,0)",
                backgroundColor : "rgb(255,255,255)",
                value : ""  
            }
            row.push(cellObj);
        }
        sheetDB.push(row);
    }
    allSheetDB[idx] = sheetDB;
    activeSheet = idx;
    currentSelectedCell.colid = 0;
    currentSelectedCell.rowid = 0;

}

//****************Formatting Button --> Bold , Italic , Underline*********************************
//If initially cell content is:
//      Bold , make it normal else make it bold
//      Italic , make it normal else make it italic
//      Underline , make it normal else make it underline

//Add or remove active class from buttons
//Whenever new sheet is formed , left will become default
// Making left as default during new sheet formation will be taken care by
// selecting (0,0) cell of the grid.

allFormattingBtnList.forEach(function(btn){
    btn.addEventListener("click",function(e){
        let btnClicked = e.currentTarget.value;

        //currentCellDB
        let currentSheet = allSheetDB[activeSheetIdx];
        let currentCellDB = currentSheet[currentSelectedCell.rowid][currentSelectedCell.colid];

        //currentCellUI
        let currentCellIdx = currentSelectedCell.rowid*26+currentSelectedCell.colid;
        let currentCellUI = allCells[currentCellIdx];
        

//For any formatting Btn , we need to do these task
//Add active class to bold btn if not present
//if active class is present remove it
//update bold property of current cell of current sheet in database

        if(btnClicked === "B"){
            //bold is clicked
            let isBoldActive = allFormattingBtnList[0].classList.contains("active-btn");
            if(isBoldActive){
                allFormattingBtnList[0].classList.remove("active-btn");
                currentCellDB.bold = false;
                currentCellUI.style.fontWeight = "normal";
            }else{
                allFormattingBtnList[0].classList.add("active-btn");
                currentCellDB.bold = true;
                currentCellUI.style.fontWeight = "bold";        
            }

        }
        else if(btnClicked == "U"){
            //Underline is clicked
            let isUnderlineActive = allFormattingBtnList[1].classList.contains("active-btn");
            if(isUnderlineActive){
                allFormattingBtnList[1].classList.remove("active-btn");
                currentCellDB.underline = false;
                currentCellUI.style.textDecoration = "none";
            }else{
                allFormattingBtnList[1].classList.add("active-btn");
                currentCellDB.underline = true;
                currentCellUI.style.textDecoration = "underline";        
            }
        }
        else if(btnClicked == "I"){
            //Italic is clicked
            let isItalicActive = allFormattingBtnList[2].classList.contains("active-btn");
            if(isItalicActive){
                allFormattingBtnList[2].classList.remove("active-btn");
                currentCellDB.italic = false;
                currentCellUI.style.fontStyle = "normal";
            }else{
                allFormattingBtnList[2].classList.add("active-btn");
                currentCellDB.italic = true;
                currentCellUI.style.fontStyle = "italic";        
            }
        }
    })
})
