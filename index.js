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
  let item = `<section id="item-${todo.id}" draggable="true" class="todo-item">

    ${createCheckbox(todo)}

    <div class="todo-field">
    <input type="text" class="todo-item-field" name="" readonly id="field-${
        todo.id
      }" value="${todo.todoText}">
      ${createModifyButton(todo.id)}
      ${createDelButton(todo.id)}
    </div>

    ${createDragIcon(todo.id)} 
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

  setDragNDropEvents()
};

let dragEndHandle = (e) => {
    console.log('drag end', e.target.id)

  if (e.target) {
    let item = document.getElementById(`item-${e.target.id.split("-")[1]}`);
    item.classList.remove("dragged-item");
  }
};

let dragStartHandle = (e) => {

  let sid = null
  let sindex = null;

  todoList.forEach((todo, index) => {
    if (todo.id === parseInt(e.target.id.split("-")[1])) {
      sid = e.target.id.split("-")[1];
      sindex = index;
    }
  });

  e.target.classList.add("dragged-item");
  sourceId = sid;
  sourceIndex = sindex;

};

let dragEnterHandle = (e) => {
  console.log("dragenter", e.target.id);

  if (e.target) {
    let item = document.getElementById(`item-${e.target.id.split("-")[1]}`);
    console.log("drag enter", e.target.id, `item-${e.target.id.split("-")[1]}`);
    item.classList.add("drag-hovered");
    e.preventDefault();
  }
  
};

let dragLeaveHandle = (e) => {
  console.log("dragleave");
  if (e.target) {
    let item = document.getElementById(`item-${e.target.id.split("-")[1]}`);
    e.preventDefault();
    console.log("drag enter", item);
    item.classList.remove("drag-hovered");
  }

  e.preventDefault();
};

let dragOverHandle = (e)=>{
    if (e.target) {
        let item = document.getElementById(`item-${e.target.id.split("-")[1]}`);
        console.log("drag enter", e.target.id, `item-${e.target.id.split("-")[1]}`);
        item.classList.add("drag-hovered");
        e.preventDefault();
      }
}

let onDropHandle = (e) => {
  console.log("drop", e.target.id, sourceIndex, sourceId);
  e.target.style.opacity = "";

  todoList = replaceTodos(todoList, parseInt(e.target.id.split("-")[1]));

  console.log(" drag drop todo list", todoList);

  createHtmlList(todoList);
  saveLocalStr(todoList);
};

let replaceTodos = (list, targetId) => {
  let dropIndex = list.findIndex((t) => {
    return t.id === targetId;
  });

  let sourceItem = list.find((t) => {
    return t.id === parseInt(sourceId);
  });

  if (dropIndex === 1 && sourceIndex === 0) {
    let dropped = list.splice(dropIndex, 1, sourceItem)[0];
    list[0] = dropped;
  } else {
    if (dropIndex < sourceIndex) {
      list.splice(dropIndex, 0, sourceItem);
      list.splice(sourceIndex + 1, 1);
    } else {
      list.splice(sourceIndex, 1);
      list.splice(dropIndex, 0, sourceItem);
    }
  }

  return list;
};

setDragNDropEvents = () => {
  let listItems = document.querySelectorAll(".todo-item");


  listItems.forEach((item) => {
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
  { type: "dragleave", method: (e) => dragLeaveHandle(e) },
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
  let item = `<i class="fa fa-trash todo-item-element del-button" onclick="delTodo(${id})"></i>`;
  return item;
}

createModifyButton = (id) => {
    let item = `<i class="fa fa-pencil modify-button" onclick="modifyButtonHandler(${id})"></i>`;
  
    return item;
  };

  modifyButtonHandler = (id) => {
    let input = document.getElementById(`field-${id}`);
    input.classList.add('todo-item-active')
    input.readOnly = false;
    let todo = todoList.find((todo) => {
      return todo.id === id ? true : false;
    });
  
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        todo.changeText(input.value);
        input.readOnly = true;
        input.classList.remove('todo-item-active')
        saveLocalStr(todoList)
        createHtmlList(todoList);
      }
    });
  };

createCheckbox = (todo) => {


  let item = `
    <input class="todo-item-element check-box" ${
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

  saveLocalStr(todoList)
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
