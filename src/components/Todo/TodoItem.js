import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { GET_TODOS } from './TodoPrivateList';


const TodoItem = ({ index, todo }) => {
  const removeTodo = e => {
    e.preventDefault();
    e.stopPropagation();
    removeTodoMutation({
      variables: { id: todo.id },
      optimisticResponse: true,
      update: (cache) => {
        const existingTodos = cache.readQuery({ query: GET_TODOS });
        const newTodos = existingTodos.todos.filter(t => (t.id !== todo.id));
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: newTodos }
        });
      }
    });
  };

  const REMOVE_TODO = gql`
    mutation removeTodo ($id: uuid!) {
      delete_todos(where: {id: {_eq: $id}}) {
        affected_rows
      }
    }
  `;

  const UPDATE_TODO_TITLE = gql`
      mutation updateTodo ($id: uuid!, $todo: String!) {
      update_todos(where: {id: {_eq: $id}}, _set:{title: $todo}) {
        affected_rows
        returning {
          title
        }
      }
    }
  `

  const [removeTodoMutation] = useMutation(REMOVE_TODO);
  const [update_todo] = useMutation(UPDATE_TODO_TITLE);


  const TOGGLE_TODO = gql`
    mutation toggleTodo ($id: uuid!, $isCompleted: Boolean!) {
      update_todos(where: {id: {_eq: $id}}, _set: {is_completed: $isCompleted}) {
        affected_rows
      }
    }
  `;

  const [toggleTodoMutation] = useMutation(TOGGLE_TODO);

  const toggleTodo = () => {
    toggleTodoMutation({
      variables: { id: todo.id, isCompleted: !todo.is_completed },
      optimisticResponse: true,
      update: (cache) => {
        const existingTodos = cache.readQuery({ query: GET_TODOS });
        const newTodos = existingTodos.todos.map(t => {
          if (t.id === todo.id) {
            return { ...t, is_completed: !t.is_completed };
          } else {
            return t;
          }
        });
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: newTodos }
        });
      }
    });
  };

  const keyInputHandler = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      if (todoTitle.trim().length > 0) update_todo({ variables: { id: todo.id, todo: todoTitle } }).then(() => showDiv());
      else {
        showDiv();
        removeTodo(e);
      }
    }
    else if (e.key == "Escape") {
      showDiv();
    }
  }

  const [showInput, setShowInput] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');

  function showDiv() {
    setShowInput(false);
  }

  function showInputField() {
    setTodoTitle(todo.title);
    setShowInput(true);
  }


  return (
    <div key={index} onDoubleClick={(e) => {
      e.preventDefault();
      if (!todo.is_completed) showInputField();
      else alert("Completed todo can't be edited")
    }}>
      {
        showInput
          ?
          <input id="listInput" value={todoTitle} onBlur={() => showDiv()} onChange={(e) => setTodoTitle(e.target.value)} onKeyDown={(e) => keyInputHandler(e)} />
          :
          <li>
            <div className="view">
              <div className="round">
                <input
                  checked={todo.is_completed}
                  type="checkbox"
                  id={todo.id}
                  onChange={toggleTodo}
                />
                <label htmlFor={todo.id} />
              </div>
            </div>

            <div className={"labelContent" + (todo.is_completed ? " completed" : "")}>
              <div >{todo.title}</div>
            </div>

            <button className="closeBtn" id={`${todo.id}close`} onClick={removeTodo}>
              x
            </button>
          </li>
      }
    </div>
  );
};

export default TodoItem;
