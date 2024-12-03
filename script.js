const notes = document.getElementById('note');
const textarea = document.getElementById('text');
const resizeBtn = document.getElementById('resize');
const colorInput = document.getElementById('colorInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const addColumnBtn = document.getElementById('addColumnBtn');
const addTodoBtn = document.getElementById('addTodoBtn');
const noteList = document.getElementById('list');
let dragging = document.getElementById('#note');
let color = colorInput.value;

/* FUNCTION CALLS */
getFromLocalStorage();
updateColListBackground();
updateNoteOutline();
document.addEventListener('DOMNodeInserted', updateColListBackground);
document.addEventListener('DOMNodeRemoved', updateColListBackground);
document.addEventListener('DOMNodeInserted', updateNoteOutline);
document.addEventListener('DOMNodeRemoved', updateNoteOutline);

/* _______________________FUNCTIONS_______________________ */

//Function to get data from local storage
function getFromLocalStorage()
{
    colorInput.value = localStorage.getItem('color');
    color = colorInput.value;
}

/* FUNCTION TO UPDATE THE BACKGROUND COLOR IN COLUMNS WHEN NO NOTE IS INSIDE */

function updateColListBackground() {
    const colLists = document.querySelectorAll('.colList');
    
    colLists.forEach(colList => {
        if (colList.children.length === 0) {
            colList.style.backgroundColor = 'rgb(240, 240, 240)';
        } else {
            colList.style.backgroundColor = 'transparent';
        }
    });
}

/* FUNCTION TO UPDATE THE OUTLINE IN NOTES WHEN NOTE IS INSIDE A COLUMN*/

function updateNoteOutline() {
    const notes = document.querySelectorAll('.note');
    const todos = document.querySelectorAll('.todo');
    
    notes.forEach(n => {
        if (n.parentElement.classList.contains('colList')) {
            n.style.outline = '0.5px solid rgba(0, 0, 0, 0.14)';
        } else {
            n.style.outline = 'none';
        }
    });

    todos.forEach(todo => {
        if (todo.parentElement.classList.contains('colList')) {
            todo.style.outline = '0.5px solid rgba(0, 0, 0, 0.14)';
        } else {
            todo.style.outline = 'none';
        }
    });
}

function generateID() {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}


/* ________________________END OF FUNCTIONS__________________________ */


/* CREATE NEW NOTE */

colorInput.addEventListener('input',()=>
{
    localStorage.setItem('color',colorInput.value);
    color = localStorage.getItem('color');
});

addNoteBtn.addEventListener('click',()=>
{
    let newNote = document.createElement('div');
    let noteID = generateID();
    newNote.setAttribute('id',noteID);
    newNote.setAttribute('class','note drag');
    newNote.innerHTML = `<textarea rows="10" cols="30" placeholder="Start typing..." class = 'text' id="text"></textarea>
                <div class='resize' id="resize"></div>
                <div class='close'></div>`;

    newNote.style.borderColor = color;
    list.appendChild(newNote);
    addResizeFunction();
});

/* CREATE NEW COLUMN */

addColumnBtn.addEventListener('click',()=>
{
    let newColumn = document.createElement('div');
    let columnID = generateID();
    newColumn.setAttribute('id',columnID);
    newColumn.setAttribute('class','column drag');
    newColumn.innerHTML = `
            <h3 class="coltitle" id="coltitle" contenteditable="true">New Column</h3>
            <div class="colList">
            </div>
            <div class='resize' id="resize"></div>
            <div class='close'></div>`;

    newColumn.style.borderColor = color;
    list.appendChild(newColumn);
    addResizeFunction();
});


/* CREATE NEW TASK */


addTodoBtn.addEventListener('click',()=>
{
    let newTodo = document.createElement('div');
    let todoID = generateID();
    newTodo.setAttribute('id',todoID);
    newTodo.setAttribute('class','todo drag');
    newTodo.innerHTML = `
            <h3 class="todoTitle" id="todoTitle" contenteditable="true">New To-Do List</h3>
            <div class="todoList" id="todoList">
            </div>
            <div class="addTodo" id="addTodo">
                <input type="checkbox" class="toggle" id="toggleDummy">
                <input type="text" placeholder="Add a task..." class="insertTodo" id="insertTodo">
            </div>
            <div class='close'></div>`;

    newTodo.style.borderColor = color;
    list.appendChild(newTodo);
});

/* DELETE NODE */

document.addEventListener('click',(e)=>
{
    if(e.target.classList.contains('close'))
    {
        e.target.parentNode.remove();
    }
    updateColListBackground();
    updateNoteOutline();
})

/* ADD TASK */

document.addEventListener('keypress', (e) => {
    if (e.target && e.target.id === 'insertTodo') {
        if(e.key === 'Enter')
        {
            const td = e.target.closest('.todo');
            const insert = td.querySelector('#insertTodo');
            const insertValue = insert.value.trim();

            if (insertValue) {
                const toDoList = td.querySelector('.todoList');
                const task = document.createElement('div');
                task.setAttribute('id', 'todoNote');
                task.setAttribute('class', 'todoNote drag');
                task.innerHTML = `<input type="checkbox" class="toggle" id="toggleCheck">
                                <span class="todoText" id="todoText" contenteditable="true">${insertValue}</span>
                                <button class="deleteTodoNote" id="deleteTodoNote">X</button>`;
                toDoList.appendChild(task);

                
                insert.value = ''; 
            }
        }
        
    }
});

/* DELETE TASK */

document.addEventListener('click',(e)=>
{
    if(e.target.classList.contains('deleteTodoNote'))
    {
        e.target.parentNode.remove();
    }
})


/* FOCUS */

/* RESIZE FUNCTION */

function addResizeFunction()
{
    /* RESIZE NOTE */

    document.querySelectorAll('.note').forEach(note => {
        const resizeHandle = note.querySelector('#resize');
        let isResizing = false;
    
        // Event listener to start resizing
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.userSelect = 'none'; // Prevent text selection
        });
    
        // Resizing the note div in real-time
        document.addEventListener('mousemove', (e) => {
            if (isResizing) {
                const rect = note.getBoundingClientRect();
                if(!note.parentElement.classList.contains('colList'))
                {
                    note.style.width = `${e.pageX - rect.left}px`;
                }
                note.style.height = `${e.pageY - rect.top}px`;
            }
        });
    
        // Stop resizing
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.userSelect = 'auto'; // Restore text selection
            }
        });
    });

    /* RESIZE COLUMN */

    document.querySelectorAll('.column').forEach(col => {
        const resizeHandle = col.querySelector('#resize');
        let isResizing = false;
    
        // Event listener to start resizing
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.userSelect = 'none'; // Prevent text selection
        });
    
        // Resizing the col div in real-time
        document.addEventListener('mousemove', (e) => {
            if (isResizing) {
                const rect = col.getBoundingClientRect();
                col.style.width = `${e.pageX - rect.left}px`;
            }
        });
    
        // Stop resizing
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.userSelect = 'auto'; // Restore text selection
            }
        });
    });

    
}

/* DRAG */


let cursor = {
    x: null,
    y: null
}

let targetNote = {
    dom: null,
    x:null,
    y:null
}

/* DRAG */
document.addEventListener('mousedown', (e) => {

    
    if (e.target.classList.contains('drag')) {
        dragging = e.target;
        cursor = {
            x: e.clientX,
            y: e.clientY
        }

        const rect = e.target.getBoundingClientRect();
        targetNote = {
            dom: e.target,
            x: rect.left,
            y: rect.top
        }

        
    }

    if (targetNote.dom.classList.contains('column')) return; /* IF COLUMN, CODE BELOW WONT WORK */

    const rect = targetNote.dom.getBoundingClientRect();
        list.appendChild(targetNote.dom);

        // Set the position back to absolute to avoid offset
        targetNote.dom.style.position = 'absolute';
        targetNote.dom.style.left = `${rect.left}px`;
        targetNote.dom.style.top = `${rect.top}px`;

        if (targetNote.dom.classList.contains('todo'))
        {
            targetNote.dom.style.minWidth = '290px';
            targetNote.dom.style.width = '290px';
            targetNote.dom.style.boxShadow = '2px 2px 10px 3px rgba(0, 0, 0, 0.14)';
            return
        }

        targetNote.dom.style.minWidth = '250px';
        targetNote.dom.style.width = '200px';
        targetNote.dom.style.boxShadow = '2px 2px 10px 3px rgba(0, 0, 0, 0.14)';
});

document.addEventListener('mousemove', (e) => {
    if (targetNote.dom == null) return;

    let currentCursor = {
        x: e.clientX,
        y: e.clientY
    }

    let distance = {
        x: currentCursor.x - cursor.x,
        y: currentCursor.y - cursor.y
    }

    targetNote.dom.style.left = (targetNote.x + distance.x) + 'px';
    targetNote.dom.style.top = (targetNote.y + distance.y) + 'px';

    targetNote.dom.style.cursor = 'grab';
});




document.addEventListener('mouseup', (e) => {
    if (targetNote.dom == null) return;
    targetNote.dom.style.cursor = 'auto';

    if (targetNote.dom.classList.contains('column')) targetNote.dom = null; /* TO AVOID INSERTING COLUMNS INTO OTHER COLUMNS */


    const colLists = document.querySelectorAll('.colList');
    let addedToColList = false;

    colLists.forEach(colList => {
        
        const rect = colList.getBoundingClientRect();
        if (
            e.clientX > rect.left &&
            e.clientX < rect.right &&
            e.clientY > rect.top &&
            e.clientY < rect.bottom
        ) {
            colList.appendChild(targetNote.dom);

            // Reset the position and margin of the note
            targetNote.dom.style.position = 'relative';
            targetNote.dom.style.left = '0px';
            targetNote.dom.style.top = '0px';
            targetNote.dom.style.margin = '0';

            // Resize colList according to note size
            targetNote.dom.style.minWidth = '100%';
            targetNote.dom.style.width = '100%';
            targetNote.dom.style.boxShadow = 'none';

            addedToColList = true;
        }
    });

    if (!addedToColList) {
        // Adjust the position of the note relative to the document
        
        const rect = targetNote.dom.getBoundingClientRect();
        list.appendChild(targetNote.dom);
        
        // Set the position back to absolute to avoid offset
        targetNote.dom.style.position = 'absolute';
        targetNote.dom.style.left = `${rect.left}px`;
        targetNote.dom.style.top = `${rect.top}px`;

    if (targetNote.dom.classList.contains('todo'))
    {
            targetNote.dom.style.minWidth = '290px';
            targetNote.dom.style.width = '290px';
            targetNote.dom.style.boxShadow = '2px 2px 10px 3px rgba(0, 0, 0, 0.14)';
            targetNote.dom = null;
    }
     /* IF COLUMN, CODE BELOW WONT WORK */
        targetNote.dom.style.minWidth = '250px';
        targetNote.dom.style.width = '200px';
        targetNote.dom.style.boxShadow = '2px 2px 10px 3px rgba(0, 0, 0, 0.14)';
    }

    targetNote.dom = null;
});