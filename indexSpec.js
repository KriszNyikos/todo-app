window.localStorage.clear();

describe("Testing the TodoTitem Object", () => {
  it("Should be created it", () => {
    let item = new TodoItem("");

    expect(item instanceof TodoItem).toBe(true);
  });

  it("Should set initial parameters", () => {
    let item = new TodoItem("Test Text", false, createUniqId(todoList));

    expect(item.todoText).toBe("Test Text");
    expect(item.done).toBe(false);
    expect(typeof item.id).toBe("number");
  });

  it("Should set fixed parameters", () => {
    let item = new TodoItem("Test Text", true, 342);

    expect(item.todoText).toBe("Test Text");
    expect(item.done).toBe(true);
    expect(item.id).toBe(342);
  });

  it("Should return the todoText", () => {
    let item = new TodoItem("Test Text", true, 342);

    expect(item.getText()).toBe("Test Text");
  });

  it("Should change the todoText", () => {
    let item = new TodoItem("Test Text", true, 342);

    item.changeText("Other text");
    expect(item.getText()).toBe("Other text");
  });

  it("Should toogle finished state", () => {
    let item = new TodoItem("Test Text", true, 342);

    item.toogleFinished();
    expect(item.done).toBe(false);

    item.toogleFinished();
    expect(item.done).toBe(true);
  });
});

describe("Testing the HTML elements", () => {
  it("Should be a main box", () => {
    let box = document.getElementsByClassName("main-box")[0];
    expect(box.constructor.name).toBe("HTMLDivElement");
  });

  it("Should be an input field", () => {
    let input = document.getElementById("input-field");
    expect(input.constructor.name).toBe("HTMLDivElement");
  });

  it('Should be a "todo-body"', () => {
    let tbody = document.getElementById("todo-body");
    expect(tbody.constructor.name).toBe("HTMLDivElement");
  });

  it("Should be a todo-list", () => {
    let list = document.getElementById("todo-list");
    expect(list.constructor.name).toBe("HTMLDivElement");
  });

  it("Should be todo fields (sections)", () => {
    let todoList = document.getElementsByClassName("todo-item");

    expect(todoList.constructor.name).toBe("HTMLCollection");
    expect(todoList.length).toBe(2);
  });

  it("Should show the input field", () => {
    let mainInput = document.getElementById("todo-input");
    mainInput.value = "New Text";

    expect(mainInput.value).toBe("New Text");
  });

  it("Should add a new todo HTML element  ", () => {
    document.getElementById("todo-input").value = "New Text";
    addTodo();

    let todoList = document.getElementsByClassName("todo-item");

    expect(todoList.constructor.name).toBe("HTMLCollection");
    expect(todoList.length).toBe(3);
  });

  it("Should delete a todo HTML element  ", () => {
    let lastTodo = todoList[todoList.length - 1];
    let delButton = document.querySelector(
      `#item-${lastTodo.id} .todo-field .del-button`
    );
    delButton.click();
    let todoHtmlList = document.getElementsByClassName("todo-item");
    expect(todoList.length).toBe(2);
    expect(todoHtmlList.length).toBe(2);
  });
});

describe("Testing the methods: ", () => {
  beforeEach(() => {
    localStorage.clear();
    todoList = [];
    createHtmlList(todoList);
  });

  describe("addTodo()", () => {
    it("Add new todo to the list", () => {
      document.getElementById("todo-input").value = "addTodo test";
      addTodo();
      expect(todoList.length).toBe(1);
      document.getElementById("todo-input").value = "addTodo test 2";
      addTodo(2);
    });

    it("Every todo are unique", () => {
      for (let i = 0; i < 10; i++) {
        document.getElementById("todo-input").value = `addTodo test ${i}`;
        addTodo(todoList);
      }

      let ids = todoList.map((todo) => {
        return todo.id;
      });

      for (let i = 0; i < ids.length; i++) {
        let count = 0;

        for (let j = 0; j < ids.length; j++) {
          if (ids[i] === ids[j]) {
            count += 1;
          }
        }

        console.log(ids[i], ids, count);
        expect(count).toBe(1);
      }
    });
  });

  describe("delTodo()", () => {
    beforeEach(() => {
      todoList = [];

      for (let i = 0; i < 10; i++) {
        document.getElementById("todo-input").value = `addTodo test ${i}`;
        addTodo(todoList);
      }

      createHtmlList(todoList);
    });

    it("delete specific todo item", () => {
      lastID = todoList[todoList.length - 1].id;

      delTodo(lastID);

      console.log(todoList, lastID);

      decreasedIds = todoList.map((todo) => todo.id);

      expect(todoList.length).toBe(9);

      expect(decreasedIds.includes(lastID.id)).toBe(false);
    });
  });

  describe("createInitialTodos()", () => {
    beforeEach(() => {
      todoList = [];
      createHtmlList(todoList);
      localStorage.clear();
    });

    it("Create a test list if localeStorage is not exist", () => {
      createInitialTodos();
      expect(todoList.length).toBe(2);
    });

    it("Create list when localStorage exist", () => {
      let dummyList = [];

      for (let i = 0; i < 10; i++) {
        dummyList.push(new TodoItem(`Todo test text ${i}`));
        saveLocalStr(dummyList);
      }

      createInitialTodos();

      expect(todoList.length).toBe(10);
    });
  });

  describe("createHtmlList()", () => {
    beforeEach(() => {
      todoList = [];
      createHtmlList(todoList);
      localStorage.clear();
    });

    it("create a list", () => {
      for (let i = 0; i < 10; i++) {
        document.getElementById("todo-input").value = `addTodo test ${i}`;
        addTodo(todoList);
      }

      expect(todoList.length).toBe(10);

      expect(
        todoList.every((todo) => {
          return todo instanceof TodoItem;
        })
      ).toBe(true);
    });
  });

  describe("replaceTodos()", () => {
    beforeEach(() => {
      todoList = [];
      createHtmlList(todoList);
      localStorage.clear();

      sourceIndex = null;
      sourceId = null;

      for (let i = 0; i < 10; i++) {
        document.getElementById("todo-input").value = `addTodo test ${i}`;
        addTodo(todoList);
      }
    });

    it("Drag todo from first to second place", () => {
      sourceIndex = 0;
      sourceId = todoList[sourceIndex].id;
      let dropId = todoList[1].id;

      let newList = replaceTodos(todoList, dropId);
      createHtmlList(newList);
      expect(newList[1].id === sourceId).toBe(true);
      expect(newList[0].id === dropId).toBe(true);
    });

    it("Drag todo from first fifth place", () => {
      sourceIndex = 0;
      sourceId = todoList[sourceIndex].id;
      let dropId = todoList[4].id;

      let newList = replaceTodos(todoList, dropId);
      createHtmlList(newList);
      expect(newList[sourceIndex].id === todoList[1].id).toBe(true);
       expect(newList[4].id === todoList[sourceIndex].id).toBe(true)
    });

    it("Drag todo from fifth to first place", () => {
      sourceIndex = 4;
      sourceId = todoList[sourceIndex].id;
      let dropId = todoList[0].id;

      let newList = replaceTodos(todoList, dropId);
      createHtmlList(newList);
       expect(newList[0].id === todoList[sourceIndex].id).toBe(true)
    });

    it("Drag todo from last to fifth place", () => {
      sourceIndex = todoList.length - 1;
      sourceId = todoList[sourceIndex].id;
      let dropId = todoList[4].id;

      let newList = replaceTodos(todoList, dropId);
      createHtmlList(newList);
      expect(newList[sourceIndex].id === todoList[todoList.length - 2].id).toBe(true);
      
    });
  });

  describe('saveLocalStr()', ()=>{

    beforeEach(() => {
      todoList = [];
      createHtmlList(todoList);
      localStorage.clear();

      for (let i = 0; i < 10; i++) {
        document.getElementById("todo-input").value = `addTodo test ${i}`;
        addTodo(todoList);
      }
    });

    it('Save the random generated list to the localStorage',()=>{


      let controlList = []

      todoList.forEach((todo) => {
        controlList.push({ text: todo.getText(), isDone: todo.done, id: todo.id });
      });

      controlList = JSON.stringify(controlList)

      saveLocalStr(todoList)

    expect(controlList === localStorage.getItem('todos')).toBe(true)
    })

  })


  describe('getLocalStr()', ()=>{

    beforeEach(() => {
      todoList = [];
      createHtmlList(todoList);
      localStorage.clear();

      for (let i = 0; i < 10; i++) {
        document.getElementById("todo-input").value = `addTodo test ${i}`;
        addTodo(todoList);
      }

      saveLocalStr(todoList)
    });

    it('Get the random generated list from the localStorage',()=>{


      let controlList = []

      todoList.forEach((todo) => {
        controlList.push({ text: todo.getText(), isDone: todo.done, id: todo.id });
      });

      controlList = JSON.stringify(controlList)

      saveLocalStr(todoList)

    expect(getLocalStr() === controlList).toBe(true)
    })

  })
});
