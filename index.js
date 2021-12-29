let todoList = []
let dragIndex = null

let newInput = document.getElementById('todo-input')
newInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addTodo()
    }
})

function addTodo() {
    let newTodo = document.getElementById('todo-input').value
    todoList.push(new TodoItem(newTodo))
    document.getElementById('todo-input').value = ""
    saveLocalStr()
    createHtmlList()
}

function delTodo(index) {
    console.log('Delete todo', index)
    todoList.splice(index, 1)
    saveLocalStr()
    createHtmlList()
}


function createHtmlList() {




    let htmlBody = document.getElementById('todo-body')
    htmlBody.innerHTML = null



    let htmlList = document.createElement('div')


    todoList.forEach((todo, index) => {
        let todoHtmlItem = document.createElement('section')
        todoHtmlItem.classList.add('todo-item')
        todoHtmlItem.draggable = false
        todoHtmlItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', target.id);
            e.dataTransfer.dropEffect = 'move';
            console.log('dragstart', e.target)
            e.target.style.opacity = 0.5
        })

        todoHtmlItem.addEventListener('dragover', (e) => {
            e.preventDefault();
        })

        todoHtmlItem.addEventListener('dragleave', (e) => {
            dragIndex = null
            e.target.style = "background-color: rgb(250, 245, 239)"
            console.log('dragleave', e.target, index, dragIndex)

        })

        todoHtmlItem.addEventListener('dragenter', (e) => {


            if (e.target) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move'
                console.log('dragenter', e.target, index)
                e.target.style = " background-color: rgb(247, 219, 185);"
                dragIndex = index
            }

           
        })

        todoHtmlItem.addEventListener('dragend', (e) => {
            console.log('dragend', dragIndex)
            e.target.style.opacity = ""

            if (dragIndex !== null) {
                let copy = new TodoItem(todo.getText(), todo.isDone())
                todoList.splice(index, 1)
                todoList.splice(dragIndex, 0,  copy)
            }

            createHtmlList()
        })

       



        let text = document.createElement('input')
        let deleteButton = createDelButton(index)
        let radioButton = createCheckbox(todo)
        let modifyButton = createModifyButton(text, todo)
        let bars = createDragIcon(todoHtmlItem)
        text.classList.add('todo-field')
        text.readOnly = true
        text.style = todo.isDone() ? 'text-decoration: line-through; flex-grow: 2' : "flex-grow: 2"
        text.value = todo.getText()
        htmlList.appendChild(text)

        todoHtmlItem.appendChild(text)
        todoHtmlItem.appendChild(radioButton)
        todoHtmlItem.appendChild(deleteButton)
        todoHtmlItem.appendChild(modifyButton)
        todoHtmlItem.appendChild(bars)


        htmlList.appendChild(todoHtmlItem)
    })



    htmlBody.appendChild(htmlList)



}

function createDragIcon(todoItem) {
    let bars = document.createElement('i')
    bars.classList.add('fa')
    bars.classList.add('fa-bars')
    bars.classList.add('drag-cursor')

    bars.addEventListener('dragstart', (e)=>{
        e.stopPropagation()
    })

    bars.addEventListener('keydown', () => {
        todoItem.draggable = true
    })



    return setTodoItemElement(bars)
}

function createDelButton(index) {
    let deleteButton = document.createElement('button')
    deleteButton.innerText = 'Delete todo'

    deleteButton.addEventListener('click', () => {
        delTodo(index)
    })

    return setTodoItemElement(deleteButton)
}

function createCheckbox(todo) {
    let label = document.createElement('label')
    label.innerText = "Done"
    let checkBox = document.createElement('input')
    label.appendChild(checkBox)
    checkBox.setAttribute('type', 'checkbox')
    checkBox.value = 'Done'
    checkBox.checked = todo.isDone()

    checkBox.addEventListener('change', () => {
        todo.toogleFinished()
        createHtmlList()
    })


    return setTodoItemElement(label)
}

function createModifyButton(todoHtmlElement, todo) {

    let modifButton = document.createElement('button')
    modifButton.innerText = 'Modify todo'

    modifButton.addEventListener('click', () => {

        todoHtmlElement.readOnly = false

        todoHtmlElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                alert(todoHtmlElement.value)
                todo.changeText(todoHtmlElement.value)
                createHtmlList()
            }
        })
        console.log('Modify event', todoHtmlElement)
    })

    return setTodoItemElement(modifButton)

}

function createInitialTodos() {
    dummyTodoList = ['Task1', "Task2"]

    if(getLocalStr()){

     JSON.parse(getLocalStr()).forEach(t => {
            let todo = new TodoItem(t.text, t.isDone)
            todoList.push(todo)
        });

    } else {
        dummyTodoList.forEach(t => {
            let todo = new TodoItem(t)
            todoList.push(todo)
        });
    }

    

    createHtmlList()
}



function sortItems() {
    todoList.sort((a, b) => {

        if (a.isDone() === b.isDone()) return 0

        if (a.isDone() && !b.isDone()) return 1

        if (!a.isDone() && b.isDone()) return -1

    })


    createHtmlList()
}

function setTodoItemElement(htmlElement) {
    htmlElement.classList.add('todo-item-element')

    return htmlElement
}

function saveLocalStr(){
    let store = []
    todoList.forEach((todo)=>{
        store.push({text: todo.getText(), isDone: todo.isDone()})
    })

    localStorage.setItem('todos',JSON.stringify(store) )

}

function getLocalStr(){
   return localStorage.getItem('todos') ? localStorage.getItem('todos') : undefined
}

class TodoItem {

    todoText = ""
    done = false


    constructor(text, done) {
        this.todoText = text
        this.done = done || false
    }

    getText() {
        return this.todoText
    }

    isDone() {
        return this.done
    }

    toogleFinished() {
        this.done = !this.done
    }


    changeText(newText) {
        this.todoText = newText
    }

}
