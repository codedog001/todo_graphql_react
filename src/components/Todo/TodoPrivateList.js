import React, { useState, Fragment } from "react";
import loadingImg from "./loading.svg";
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";

import { gql, useSubscription, useMutation } from "@apollo/client";




const GET_TODOS = gql`
subscription {
  todos(order_by: { created_at: desc })  {
    is_completed
    id
    created_at
    title
  }
}
`;

const CLEAR_COMPLETED = gql`
    mutation clearCompleted {
      delete_todos(where: {is_completed: {_eq: true}}) {
        affected_rows
      }
    }
  `;

const TodoPrivateList = props => {
  const [state, setState] = useState({
    filter: "all",
    clearInProgress: false,
  });

  const filterResults = filter => {
    setState({
      ...state,
      filter: filter
    });
  };
  const [clearCompletedTodos] = useMutation(CLEAR_COMPLETED);

  const clearCompleted = () => {
    clearCompletedTodos({
      optimisticResponse: true,
      update: (cache, { data }) => {
        const existingTodos = cache.readQuery({ query: GET_TODOS });
        const newTodos = existingTodos.todos.filter(todo => (!todo.is_completed));
        cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } });
      }
    });
  };

  const { todos } = props;
  let filteredTodos = todos;
  let activeTodosCount = 0;

  todos.forEach((todo) => {
    if (todo.is_completed !== true) activeTodosCount += 1;
  })

  if (state.filter === "active") {
    filteredTodos = todos.filter(todo => todo.is_completed !== true);
  } else if (state.filter === "completed") {
    filteredTodos = todos.filter(todo => todo.is_completed === true);
  }

  const todoList = [];
  filteredTodos.forEach((todo, index) => {
    todoList.push(<TodoItem key={index} index={index} todo={todo} />);
  });

  return (
    <Fragment>
      <div className="todoListWrapper">
        <ul>{todoList}</ul>
      </div>

      <TodoFilters

        todos={filteredTodos}
        activeTodosCount={activeTodosCount}
        currentFilter={state.filter}
        filterResultsFn={filterResults}
        clearCompletedFn={clearCompleted}
        clearInProgress={state.clearInProgress}
      />
    </Fragment>
  );
};


const TodoPrivateListQuery = () => {

  const style = {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    height: "32vh",
    width: "32vw",
    top: 10,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white"
  };

  const { loading, error, data } = useSubscription(GET_TODOS);
  console.log(error);
  if (loading) {
    return <img style={style} src={loadingImg} />;
  }
  if (error) {
    return <div className="infoImg">Some Error Occured</div>;
  }
  return <TodoPrivateList todos={data.todos} />;
};

export default TodoPrivateListQuery;
export { GET_TODOS };
