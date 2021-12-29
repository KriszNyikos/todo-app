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

    createHtmlList()
}

function delTodo(index) {
    console.log('Delete todo', index)
    todoList.splice(index, 1)
    createHtmlList()
}


function createHtmlList() {




    let htmlBody = document.getElementById('todo-body')
    htmlBody.innerHTML = null



    let htmlList = document.createElement('div')


    todoList.forEach((todo, index) => {
        let todoHtmlItem = document.createElement('div')
        todoHtmlItem.classList.add('todo-item')
        todoHtmlItem.draggable = true
        todoHtmlItem.addEventListener('dragstart', (e)=>{
            console.log('dragstart', e.target)
            e.target.style.opacity = 0.5
        })

        todoHtmlItem.addEventListener('dragenter', (e)=>{
            console.log('dragenter', e.target, index)
            e.target.style=" background-color: rgb(247, 219, 185);"
            dragIndex = index
        })

        todoHtmlItem.addEventListener('dragend', (e)=>{
            console.log('dragend', dragIndex)
            e.target.style.opacity = ""

            if(dragIndex){
                todoList.splice(dragIndex, 0, todo)
            }

            createHtmlList()
        })

        todoHtmlItem.addEventListener('dragleave', (e)=>{
            dragIndex = null
            e.target.style="background-color: rgb(250, 245, 239)"
            console.log('dragleave', e.target, index, dragIndex)
   
        })

        

        let text = document.createElement('input')
        let deleteButton = createDelButton(index)
        let radioButton = createCheckbox(todo)
        let modifyButton = createModifyButton(text, todo)

        text.classList.add('todo-field')
        text.readOnly = true
        text.style = todo.isDone() ? 'text-decoration: line-through' : ""
        text.value = todo.getText()
        htmlList.appendChild(text)

        todoHtmlItem.appendChild(text)
        todoHtmlItem.appendChild(radioButton)
        todoHtmlItem.appendChild(deleteButton)
        todoHtmlItem.appendChild(modifyButton)


        htmlList.appendChild(todoHtmlItem)
    })



    htmlBody.appendChild(htmlList)



}

function createDelButton(index) {
    let deleteButton = document.createElement('button')
    deleteButton.innerText = 'Delete todo'

    deleteButton.addEventListener('click', () => {
        delTodo(index)
    })

    return deleteButton
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


    return label
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

    return modifButton

}

function createInitialTodos() {
    dummyTodoList = ['Task1', "Task2"]

    dummyTodoList.forEach(t => {
        let todo = new TodoItem(t)
        todoList.push(todo)
    });

    createHtmlList()
}



function sortItems() {
    todoList.sort((a, b) => {
  
        if(a.isDone() === b.isDone())return 0

        if(a.isDone() && !b.isDone()) return 1

        if(!a.isDone() && b.isDone()) return -1

    })


    createHtmlList()
}

class TodoItem {

    todoText = ""
    done = false


    constructor(text) {
        this.todoText = text
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
