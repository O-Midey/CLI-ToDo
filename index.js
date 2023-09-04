const readline = require("readline");
const fs = require("fs");
const util = require("util");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Load tasks from the JSON file
let tasks = [];
try {
  const tasksJSON = fs.readFileSync("./tasks.json");
  tasks = JSON.parse(tasksJSON);
} catch (error) {
  console.error("Error loading tasks from tasks.json:", error);
}

const saveTasksToJSON = () => {
  fs.writeFile("./tasks.json", JSON.stringify(tasks, null, 2), (error) => {
    if (error) {
      console.error("Error saving tasks to tasks.json:", error);
    }
  });
};

const addTask = (taskDescription) => {
  const newTask = { task: taskDescription, completed: false };
  tasks.push(newTask);
  saveTasksToJSON();
  util.log("Task added successfully");
  setTimeout(promptUser, 1000);
};

const viewTasks = () => {
  if (tasks.length < 1) {
    util.log("You have no tasks at the moment");
  } else {
    const allTasks = tasks.map(
      (task, index) =>
        `${index + 1} ${task.task} ${
          task.completed ? "(Task completed)" : "(Task not completed)"
        }`
    );
    util.log(`You have the following tasks: \n\n${allTasks.join("\n")}`);
  }
};

const markAsCompleted = (index) => {
  if (tasks[index].completed) {
    console.log("Task is already marked as completed");
  } else if (index >= tasks.length || index < 0) {
    console.log("Invalid index passed");
  } else {
    tasks[index].completed = true;
    saveTasksToJSON();
    console.log(`Task ${index + 1} marked as completed.`);
  }
};

const updateTask = () => {
  viewTasks();
  rl.question(
    `Here's a list of tasks, enter the number of the task you want to mark as completed: \n`,
    (userInput) => {
      const index = parseInt(userInput) - 1;
      markAsCompleted(index);
      setTimeout(promptUser, 1000);
    }
  );
};

const promptUser = () => {
  rl.question(
    `What will you like to do? \n\n To add a new task, reply "add" \n To view tasks, reply "view" \n To update tasks, reply "update" \n To exit command, reply "exit" \n`,
    (command) => {
      command = command.trim().toLowerCase();
      command === "add"
        ? rl.question("Enter Task: ", (task) => addTask(task))
        : command === "view"
        ? viewTasks()
        : command === "update"
        ? updateTask()
        : command === "exit"
        ? rl.close()
        : console.log(
            "Invalid command. Please enter 'add', 'view', 'update', or 'exit'."
          );
    }
  );
};

promptUser();
