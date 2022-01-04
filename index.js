let todoList = [];
let sourceId = null;
let sourceIndex = null;

let newInput = document.getElementById("todo-input");
newInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

let addTodo = () => {
  let newTodo = document.getElementById("todo-input").value;
  todoList.push(new TodoItem(newTodo));
  document.getElementById("todo-input").value = "";
  saveLocalStr(todoList);
  createHtmlList(todoList);
};

let delTodo = (id) => {
  todoList = todoList.filter((todo) => {
    return todo.id !== id ? true : false;
  });
  console.log("Filtered", todoList);
  saveLocalStr(todoList);
  createHtmlList(todoList);
};

let createListItem = (todo) => {
  let item = `<section id="item-${todo.id}" class="todo-item">
    ${createCheckbox(todo)}
    <input type="text" class="todo-field" name="" readonly id="field-${
      todo.id
    }" value="${todo.todoText}">
    ${createModifyButton(todo.id)}
    ${createDelButton(todo.id)}
    ${createDragIcon(todo.id)} 
    <p>${todo.id}</p>
    </section>`;

  return item;
};

let createHtmlList = (list) => {
  let htmlList = document.getElementById("todo-list");
  htmlList.innerHTML = null;

  list.forEach((todo) => {
    listItem = createListItem(todo);
    htmlList.innerHTML += listItem;
  });
};

let dragEndHandle = (e) => {
  /* console.log('Dragendhandle',e.target.id)
 
     e.target.style.opacity = ""
 
     console.log('todo list', todoList, dragId)
 
     if (dragId !== null && dragSourceIndex !==null) {
 
         let todo = undefined
         let index = null
         todoList.forEach((t, i) => {
 
             if (t.id == dragId) {
                 todo = t
                 index = i
             }
 
         })
 
 
         
         let copy = new TodoItem(todo.getText(), todo.done)
 
         console.log('dragend', todo, index, dragId, copy)
         todoList.splice(dragSourceIndex, 1)
         todoList.splice(index, 0, copy)
     }
 
     createHtmlList(todoList)*/
};

let replaceItems = () => {};

let dragStartHandle = (e) => {
  let sid = null;

  let sindex = null;

  todoList.forEach((todo, index) => {
    if (todo.id === parseInt(e.target.id.split("-")[1])) {
      sid = e.target.id.split("-")[1];
      sindex = index;

      console.log("find", sid, sindex);
    }
  });

  sourceId = sid;
  sourceIndex = sindex;

  console.log("dragstart habi", sourceId, sourceIndex);

  e.dataTransfer.setData("text", e.target.id);
  e.dataTransfer.dropEffect = "move";
  //console.log('dragstart', e.target, e.target.id, dragSourceIndex)
  e.target.style.opacity = 0.5;
};

let dragOverHandle = (e) => {
  e.preventDefault();
  e.target.style = " background-color: rgb(247, 219, 185);";
};

let dragEnterHandle = (e) => {
  /*
        if (e.target) {
            e.preventDefault();
            let id = e.target.id.split('-')[1]
            console.log('drag enter', id)
          //  e.target.style = " background-color: rgb(247, 219, 185);"
        }*/
};

let dragLeaveHandle = (e) => {
  e.target.style = "background-color: rgb(250, 245, 239)";
};

let onDropHandle = (e) => {
  console.log("drop", e.target.id);

  e.target.style.opacity = "";

  console.log("todo list", todoList, sourceId);

  if (sourceId !== null && sourceIndex !== null) {
    let todo = undefined;
    let index = null;
    todoList.forEach((t, i) => {
      if (t.id == sourceId) {
        todo = t;
        index = i;
      }
    });

    let copy = new TodoItem(todo.getText(), todo.done);

    //  console.log('dragend', todo, index, dragId, copy)
    todoList.splice(sourceIndex, 1);
    todoList.splice(index, 0, copy);
  }

  createHtmlList(todoList);

  e.preventDefault();
};

setDragNDropEvents = () => {
  let listItems = document.querySelectorAll(".todo-item");
  let dragItems = document.querySelectorAll(".drag-item");

  listItems.forEach((item) => {
    dragNDropEvents.forEach((event) => {
      item.addEventListener(event.type, event.method);
    });
  });

  dragItems.forEach((item) => {
    dragNDropEvents.forEach((event) => {
      item.addEventListener(event.type, event.method);
    });
  });
};

let dragNDropEvents = [
  { type: "dragend", method: (e) => dragEndHandle(e) },
  { type: "dragstart", method: (e) => dragStartHandle(e) },
  { type: "dragover", method: (e) => dragOverHandle(e) },
  { type: "dragenter", method: (e) => dragEnterHandle(e) },
  { type: "drop", method: (e) => onDropHandle(e) },
];

let barDragStartHandle = (e) => {
  alert("dragstart");
};

let barMouseDownHandle = (id) => {
  let todoItem = document.getElementById(`item-${id}`);
  console.log("Keydown", todoItem);
  todoItem.style = "background-color: red";
  // todoItem.draggable = true
};

let createDragIcon = (id) => {
  let item = ` <i id="drag-${id}" class="fa fa-bars drag-cursor todo-item-element"></i>`;

  return item;
};

function createDelButton(id) {
  let item = `<i class="fa fa-trash todo-item-element" onclick="delTodo(${id})"></i>`;
  return item;
}

function createCheckbox(todo) {
  console.log("Create checkbox", todo.id, todo.done);

  let item = `
    <input class="todo-item-element" ${
      todo.done ? "checked" : undefined
    } type="checkbox" name="checkBox" id="check-${
    todo.id
  }" onchange="checkBoxChangeHandle(${todo.id})">`;

  return item;
}

checkBoxChangeHandle = (id) => {
  todoList = todoList.map((todo) => {
    if (todo.id === id) {
      todo.toogleFinished();
    }

    return todo;
  });

  saveLocalStr(todoList);

  createHtmlList(todoList);
};

createModifyButton = (id) => {
  let item = `<i class="fa fa-pencil" draggable="false" onclick="modifyButtonHandler(${id})"></i>`;

  return item;
};

modifyButtonHandler = (id) => {
  let input = document.getElementById(`field-${id}`);
  input.style = "background-color: red";
  input.readOnly = false;
  let todo = todoList.find((todo) => {
    return todo.id === id ? true : false;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      todo.changeText(input.value);
      input.readOnly = true;
      input.style = "";
      createHtmlList(todoList);
    }
  });
};

let createInitialTodos = () => {
  dummyTodoList = ["Task1", "Task2"];

  if (getLocalStr()) {
    JSON.parse(getLocalStr()).forEach((t) => {
      let todo = new TodoItem(t.text, t.isDone, t.id);
      todoList.push(todo);
    });
  } else {
    dummyTodoList.forEach((t) => {
      let todo = new TodoItem(t);
      todoList.push(todo);
    });
  }

  createHtmlList(todoList);
};

let sortItems = () => {
  todoList.sort((a, b) => {
    if (a.done === b.done) return 0;

    if (a.done && !b.done) return 1;

    if (!a.done && b.done) return -1;
  });

  createHtmlList(todoList);
};

let saveLocalStr = (list) => {
  let store = [];
  list.forEach((todo) => {
    store.push({ text: todo.getText(), isDone: todo.done, id: todo.id });
  });

  localStorage.setItem("todos", JSON.stringify(store));
};

let getLocalStr = () => {
  return localStorage.getItem("todos")
    ? localStorage.getItem("todos")
    : undefined;
};

class TodoItem {
  id = null;
  todoText = "";
  done = false;
  draggable = false;

  constructor(text, done, id) {
    this.todoText = text;
    this.done = done || false;
    this.id = id || Math.round(Math.random() * 1000);
  }

  getText() {
    return this.todoText;
  }

  toogleFinished() {
    this.done = !this.done;
  }

  changeText(newText) {
    this.todoText = newText;
  }
}
