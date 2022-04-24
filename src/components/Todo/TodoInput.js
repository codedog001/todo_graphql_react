import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { GET_TODOS } from './TodoPrivateList';



const ADD_TODO = gql`
  mutation ($todo: String!) {
    insert_todos(objects: {title: $todo}) {
      affected_rows
      returning {
        id
        title
        created_at
        is_completed
      }
    }
  }
 `;

const TodoInput = () => {
  const [todoInput, setTodoInput] = useState('');

  const updateCache = (cache, { data }) => {
    // Fetch the todos from the cache
    const existingTodos = cache.readQuery({
      query: GET_TODOS
    });
    // Add the new todo to the cache
    const newTodo = data.insert_todos.returning[0];
    cache.writeQuery({
      query: GET_TODOS,
      data: { todos: [...existingTodos.todos, newTodo] }
    });
  };

  const [addTodo] = useMutation(ADD_TODO, { update: updateCache });



  return (
    <form
      className="formInput"
      onSubmit={e => {
        e.preventDefault();
        addTodo({ variables: { todo: todoInput } });
        setTodoInput('');
      }}
    >
      <input
        className="input"
        placeholder="What needs to be done?"
        value={todoInput}
        onChange={e => (setTodoInput(e.target.value))}
      />
      <i onClick={() => { }} className="inputMarker fa fa-angle-right" />
    </form>
  );
};

export default TodoInput;
