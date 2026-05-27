import "./global.css";
import { ClipboardIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { Circle } from "lucide-react";

export default function App() {
  const inputRef = useRef(null);
  const errorRef = useRef(null);

  const pRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [tasks, setTasks] = useState(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    return todos || [];
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  function handleAdd() {
    let value = inputRef.current.value.trim();

    if(value === ""){
      errorRef.current.classList.remove("show");
      errorRef.current.textContent = "Please type in a task to add!";
      errorRef.current.classList.add("show");

      setTimeout(() => {
        errorRef.current.classList.remove("show");
        errorRef.current.textContent = "";
      }, 4000);
      return;
    }

    setTasks(prevTasks => [...prevTasks, {
      id: Date.now(),
      val:value,
      completed:false
    }]);

    inputRef.current.value = "";
  }

  function completeTask(taskId) {
    setTasks(prevTasks => prevTasks.map((task) => task.id === taskId ? {...task, completed: !task.completed} : task ));
  }

  function deleteTask(taskId) {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
  }

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if(isEditing){
      pRef.current?.focus;
    }
  }, [isEditing])

  function enableEditing(ref){
    setIsEditing(true);
    ref.current.contentEditable = true;
  }

  return (

    <div>

      <div className="error-area" ref={errorRef}>

      </div>

      <div className="container">

      <div className="upper-area">
        <span><ClipboardIcon className="clipboard" /></span>
        <div className="todoly-section">
          <p className="todoly">Todoly V2</p>
          <p className="under-todoly">Stay productive</p>
        </div>
      </div>

      <div className="stats-section">
        <div className="total">
          <span className="total-value">{totalTasks}</span>
          <p className="total-text">Total</p>
        </div>

        <div className="done">
          <span className="done-value">{completedTasks}</span>
          <p className="done-text">Done</p>
        </div>

        <div className="progress">
          <span className="progress-value">{progressPercent}%</span>
          <p className="progress-text">Progress</p>
        </div>
      </div>

      <div className="add-task-section">
        <input type="text" placeholder="Add a new task..." ref={inputRef} />
        <button className="add-btn" onClick={handleAdd}>Add</button>
      </div>

      <div className="task-view-area">
        <ul>
             {tasks.length > 0 ? 
             tasks.map((task) => (
            <li className="task-item" key={task.id}>
              <div className="left-task-section">

                <span onClick={() => completeTask(task.id)}>
                  {task.completed ? (
                    <CheckCircleIcon className="completed-circle-icon" />
                  ) : (
                    <Circle className="circle-icon" />
                  )}
                </span>

                <p className="task-text" 
                style={{ textDecoration: task.completed ? 'line-through' : 'none',
                  padding: isEditing ? "4px" : "none",
                  border:isEditing ? "3px solid var(--border-color)" : "none",
                  outline: "none",
                  borderRadius: isEditing ? "5px" : "none",
                 }}
                onDoubleClick={() => enableEditing(pRef)}
                ref={pRef}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={() => setIsEditing(false)}>
                  {task.val}
                </p>

              </div>

              <span onClick={() => deleteTask(task.id)}>
                <XCircleIcon className="x-circle-icon" />
              </span>

            </li>
          ))
           : 
            <div className="add-task-msg">
              No tasks added, add a task above!
            </div>

          }
          
          

        </ul>

      </div>

    </div>
    </div>
    
  );
}
