const addButton = document.querySelector("#add-button");
const deleteButton = document.querySelector("#delete-button");
const list = document.querySelector("#list");
const newInput = document.querySelector("input");

let todos = [];

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((data) => {
      todos = data;
      renderTodos();
      console.log(todos);
    });
}

function renderTodos() {
  list.textContent = "";
  todos.forEach((todo) => {
    const newLi = document.createElement("li");
    const text = document.createTextNode(todo.description);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    newLi.appendChild(checkbox);

    newLi.setAttribute("data-id", todo.id);
    newLi.appendChild(text);
    list.appendChild(newLi);
  });
}

function addTodo() {
  if (newInput.value.length > 0) {
    const newTodo = {
      description: newInput.value,
      done: false,
    };
    newInput.value = "";

    fetch("http://localhost:4730/todos", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((newData) => {
        todos.push(newData);
        renderTodos();
      });
  }
}

function updateTodosfromApi(e) {
  const id = e.target.parentElement.getAttribute("data-id");
  const updateTodo = {
    description: e.target.nextSibling.textContent,
    done: e.target.checked,
  };
  fetch("http://localhost:4730/todos/" + id, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(updateTodo),
  })
    .then((response) => response.json())
    .then((updatedData) => {
      console.log("Data saved");
      loadTodos();
    });
}

function deleteTodos() {
  todos.forEach((todo) => {
    if (todo.done) {
      fetch("http://localhost:4730/todos/" + todo.id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          loadTodos();
        });
    }
  });
}

addButton.addEventListener("click", addTodo);
list.addEventListener("change", updateTodosfromApi);
deleteButton.addEventListener("click", deleteTodos);

loadTodos();
