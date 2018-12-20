    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var table_array = [];   
    function tableCreate(){
    var body = document.body,
    tbl = document.createElement('table');
    tbl.style.border = '1px solid black';
    tbl.id = 'tasktable';
    tbl.className = "table";
    var tr = tbl.insertRow();
    tr.className = "success";
    for(var j = 0; j < 2; j++){
                var td = tr.insertCell();
                if (j==0) td.appendChild(document.createTextNode('Task'));
                if (j==1) {td.appendChild(document.createTextNode('Date'));td.style.width = '50%';}
                td.style.border = '1px solid black';
                
    }
     divtable.appendChild(tbl);
        
     if (window.localStorage.getItem('table') != null){
        table_array = JSON.parse(window.localStorage.getItem('table'));
        row_count_in_storage = table_array.length;
         
         for (var i=0; i<table_array.length; i++){
            var tr = tbl.insertRow();        
            tr.id = `Row${i}`;
            setColor(tr.id,table_array[i].date);
            for(var j = 0; j < 2; j++){
                var td = tr.insertCell();
                if (j==0) td.appendChild(document.createTextNode(`${table_array[i].task} `));  
                if (j==1) td.appendChild(document.createTextNode(`${table_array[i].date}`));
                td.style.border = '1px solid black';
                }
         }
        }       
     
     }
       
    function setColor(rowid,date){
        date_arr = date.split('.');
        var table = document.getElementById('tasktable');
        if ((date_arr[2] < year) | ((date_arr[2] == year) & (date_arr[1] < month)) | ((date_arr[2] == year) & (date_arr[1] == month) & (date_arr[0] < day))) document.getElementById(`${rowid}`).style.color = "red";
        if ((date_arr[2] == year) & (date_arr[1] == month) & (date_arr[0] < day+3) & (date_arr[0] >= day)) document.getElementById(`${rowid}`).style.color = "blue";
        if ((date_arr[2] > year) | ((date_arr[2] == year) & (date_arr[1] > month)) | ((date_arr[2] == year) & (date_arr[1] == month) & (date_arr[0] > day+3))) document.getElementById(`${rowid}`).style.color = "black";
    }
             
    tableCreate();
       
    // select table row on click       
    var selectedTd;
    var selected_td;
    tasktable.onclick = function(event){
        var target = event.target;
        if (target.tagName != 'TD') return;
        highlight(target);
        showDescription(target);
    }
    function highlight(node){
        selectedTd = node;
        if (selected_td){
            selected_td.parentNode.style.background = 'white';
           if (selected_td == selectedTd){
             selected_td = 0;
             return;
           } 
        }
            selectedTd.parentNode.style.background = 'gray';  // highlight row
            selected_td = selectedTd;
            console.log(selected_td.parentNode.id);
    }
    function showDescription(node){
        selectedTd = node;
        var selectedrow = document.getElementById(selectedTd.parentNode.id);
        table_array = JSON.parse(window.localStorage.getItem('table'));
        document.getElementById("panel").innerHTML = table_array[selectedrow.rowIndex-1].descr;
    }

    // del, move row
    addEventListener("keydown", moveRow);
    function moveRow(key){
        switch(key.keyCode){
            case 38: move_row_up();
                     break;
            case 40: move_row_down();
                     break;
           // case 46: del_row();
            //         break;
        }
    }
    
    function del_row(){
        var table = document.getElementById('tasktable');
        if (selected_td){
          var delrow = document.getElementById(selected_td.parentNode.id);
          console.log(delrow.rowIndex);
          
          table_array = JSON.parse(window.localStorage.getItem('table'));  // del from localstorage
                    table_array.forEach(function(item, index, arr) {
                console.log(item, index);
                });
          table_array.splice((delrow.rowIndex-1),1);
          window.localStorage.setItem('table',JSON.stringify(table_array));
          document.getElementById('panel').innerHTML = ' ';
          table.deleteRow(delrow.rowIndex);
        
            table_array.forEach(function(item, index, arr) {
                console.log(item, index);
                });
        }
    }
       
    function move_row_up(){
        if (selected_td){
          var moverow = document.getElementById(selected_td.parentNode.id); 
            if (moverow.rowIndex > 1){
                table_array = JSON.parse(window.localStorage.getItem('table'));
                table_array.exchange((moverow.rowIndex-1),(moverow.rowIndex-2));
                window.localStorage.setItem('table',JSON.stringify(table_array));
                moverow.parentNode.insertBefore(moverow,moverow.previousSibling);
            }
        }
    }
       
    function move_row_down(){
        if (selected_td){
          var moverow = document.getElementById(selected_td.parentNode.id);  
          table_array = JSON.parse(window.localStorage.getItem('table'));
          table_array.exchange((moverow.rowIndex-1),(moverow.rowIndex));
          window.localStorage.setItem('table',JSON.stringify(table_array));         
          moverow.parentNode.insertBefore(moverow.nextSibling,moverow);
        }
    }    
       
    Array.prototype.exchange = function (a, b) {
    if (this[a] && this[b]) {
        var c = this[a];
        this[a] = this[b];
        this[b] = c
    }
    return this
    };
   
    var editedrow;
    tasktable.ondblclick = function(event){
        var target = event.target;
        if (target.tagName != 'TD') return;
        editedrow = document.getElementById(target.parentNode.id);
        table_array = JSON.parse(window.localStorage.getItem('table'));
        document.getElementById('edittask').value = table_array[editedrow.rowIndex-1].task;
        document.getElementById('editdate').value = table_array[editedrow.rowIndex-1].date;
        document.getElementById('editdescr').value = table_array[editedrow.rowIndex-1].descr;
        $("#myModalBox").modal('show');
    }
        
    document.getElementById('dateinput').value = `${day}.${month}.${year}`;
    document.getElementById('button').onclick = function(){addTask();}
            function addTask(){
            var taskinput = document.getElementById('taskinput').value;
            var dateinput = document.getElementById('dateinput').value;
            var table = document.getElementById('tasktable');
            var tr = table.insertRow();        
            tr.id = `Row${table.rows.length}`;
            setColor(tr.id,dateinput);
            for(var j = 0; j < 2; j++){
                var td = tr.insertCell();
                if (j==0) td.appendChild(document.createTextNode(`${taskinput}`));
                if (j==1) td.appendChild(document.createTextNode(`${dateinput}`));
                td.style.border = '1px solid black';
                }
            var row_count_in_storage = 0; 
            if (window.localStorage.getItem('table') != null){
                 table_array = JSON.parse(window.localStorage.getItem('table'));
                 row_count_in_storage = table_array.length;
                }            
            table_array[row_count_in_storage] = {task:`${taskinput}`,date:`${dateinput}`,descr:' '};
            window.localStorage.setItem('table',JSON.stringify(table_array));
            table_array.forEach(function(item, index, arr) {
                console.log(item, index);
                });
            
        }
        
        document.getElementById('delbtn').onclick = function(){del_row();}
        
        document.getElementById('savebtn').onclick = function(){editTask();}
            function editTask(){
                var edittask = document.getElementById('edittask').value;
                var editdate = document.getElementById('editdate').value;
                var editdescr = document.getElementById('editdescr').value;
                document.getElementById('panel').innerHTML = document.getElementById('editdescr').value;
                table_array = JSON.parse(window.localStorage.getItem('table'));
                table_array[editedrow.rowIndex-1].task = edittask;
                table_array[editedrow.rowIndex-1].date = editdate;
                table_array[editedrow.rowIndex-1].descr = editdescr;
                window.localStorage.setItem('table',JSON.stringify(table_array));
                cells = editedrow.getElementsByTagName('td');
                for (var i=0,len=cells.length; i<len; i++){
                    if (i==0) cells[0].innerHTML = edittask;
                    if (i==1) cells[1].innerHTML = editdate;
                }
                setColor(editedrow.id,editdate);
            }