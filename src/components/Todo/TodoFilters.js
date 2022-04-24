import React from "react";

const TodoFilters = ({
  todos,
  activeTodosCount,
  currentFilter,
  filterResultsFn,
  clearCompletedFn
}) => {
  const filterResultsHandler = filter => {
    return () => {
      filterResultsFn(filter);
    };
  };

  // The clear completed button only when there is atleast 1 completed todo
  const clearCompletedButton = (
    <button onClick={clearCompletedFn} className="clearComp">
      Clear completed
    </button>
  );


  let showClearCompletedButton = false;
  if (todos.length > activeTodosCount) showClearCompletedButton = true;

  return (
    <div className="footerList">
      <span>
        {" "}
        {activeTodosCount}
        {
          activeTodosCount !== 1 ? " items left" : " item left"
        }
      </span>

      <ul>
        <li onClick={filterResultsHandler("all")}>
          <a className={currentFilter === "all" ? "selected" : ""}>All</a>
        </li>

        <li onClick={filterResultsHandler("active")}>
          <a className={currentFilter === "active" ? "selected" : ""}>Active</a>
        </li>

        <li onClick={filterResultsHandler("completed")}>
          <a className={currentFilter === "completed" ? "selected" : ""}>
            Completed
          </a>
        </li>
      </ul>

      {
        showClearCompletedButton
          ?
          clearCompletedButton
          :
          <></>
      }
    </div>
  );
};

export default TodoFilters;
