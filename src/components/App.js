import TodoPrivateWrapper from "./Todo/TodoPrivateWrapper";

function App() {
  return (
    <div>
      <div className="row justify-content-center ">
        <div className="col-md-4">
          <TodoPrivateWrapper />
        </div>

      </div>
      <footer>
        <ul>
          <li>Changes will be synced across browser in real-time</li>
          <li>Double click to edit a todo</li>
          <li>When done editing, press Enter to confirm changes</li>
          <li>Click on X to remove todo from the list</li>
        </ul>
        <p><a href="https://github.com/codedog001/todo_graphql_react" target={"_blank"} >View Source</a></p>
      </footer>
    </div>
  );
}

export default App;
