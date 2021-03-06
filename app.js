let allTasks = [];
let countTasks = 0;
let removeTaskBtn = null;
const createTaskBtn = document.querySelector("#createTask");
const createTaskText = document.querySelector("#newTask");
const listTasks = document.querySelector("ul");
const removeBtn = '<button type="submit" class="remove">Apagar</button>';

function insertDay() {
  const day = new Date();
  const dayOptions = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  let dayString = day.toLocaleDateString("pt-br", dayOptions);
  dayString = dayString.replace(
    dayString.charAt(0),
    dayString.charAt(0).toUpperCase()
  );
  const dayOutput = document.querySelector(".date");
  dayOutput.insertAdjacentText("afterbegin", dayString);
}
insertDay();
loadStorage();

// Listen Btn addTask
createTaskBtn.addEventListener("click", addTask);

// Listen input key Enter
createTaskText.addEventListener("keydown", (e) =>
  e.keyCode === 13 ? addTask(e) : null
);

// Listen task click
function listenLi(item) {
  item.addEventListener("click", (e) => {
    item.classList.toggle("done");

    // get localStorage
    allTasks = JSON.parse(localStorage.getItem("allTasks"));

    // find item clicked
    const index = allTasks.findIndex(
      (task) => task.taskText === e.target.innerText
    );

    // change in localStorage
    const taskClick = allTasks[Number(index)];
    taskClick.taskDone
      ? (taskClick.taskDone = false)
      : (taskClick.taskDone = true);
    allTasks.push(taskClick);
    allTasks.splice(index, 1);
    localStorage.setItem("allTasks", JSON.stringify(allTasks));

    const liClicked = e.target.parentElement;
    const ulChanged = liClicked.parentElement;
    ulChanged.removeChild(liClicked);
    if (e.target.classList.contains("done")) {
      ulChanged.insertAdjacentElement("beforeend", liClicked);
    } else {
      ulChanged.insertAdjacentElement("afterbegin", liClicked);
    }
  });
}

// Listen remove Btn
function listenRemoveBtn(btns) {
  if (btns === null) {
    removeTaskBtn = document.querySelectorAll(".remove");
  }

  removeTaskBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log(e.target);
    });
  });
}

// creat <li>
function insertLi(task) {
  const newLi = document.createElement("li");
  newLi.classList.add("task");

  const newText = document.createElement("p");
  newText.insertAdjacentText("afterbegin", `${task.taskText}`);

  if (task.taskDone === true) {
    newText.classList.add("done");
  }

  newLi.insertAdjacentElement("afterbegin", newText);
  newLi.insertAdjacentHTML("beforeend", removeBtn);

  listenLi(newText);
  return newLi;
}

// creat task
function addTask(e) {
  if (createTaskText.value !== "") {
    // insert task in localStorage
    allTasks.push({
      taskText: createTaskText.value,
      taskDone: false,
    });
    localStorage.setItem("allTasks", JSON.stringify(allTasks));

    setTimeout(() => {
      listTasks.insertAdjacentElement(
        "afterbegin",
        insertLi({
          taskText: createTaskText.value,
          taskDone: false,
        })
      );

      listenRemoveBtn(removeTaskBtn);
      // clean input
      createTaskText.value = "";
    }, 1000);
  }
}

// get localStorage onload
function loadStorage() {
  // search data in localStorage
  allTasks = JSON.parse(localStorage.getItem("allTasks"));

  //   // check if data is null
  if (allTasks !== null) {
    allTasks.map((item) => {
      if (item.taskText) {
        item.taskDone
          ? listTasks.insertAdjacentElement("beforeend", insertLi(item))
          : listTasks.insertAdjacentElement("afterbegin", insertLi(item));
      } else {
        allTasks.shift();
      }
    });

    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    listenRemoveBtn(removeTaskBtn);
  } else {
    allTasks = [{}];
  }
}
