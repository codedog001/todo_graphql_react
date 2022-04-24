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
        <p>Double click to edit a todo <br /> When done editing, press Enter to confirm changes <br /> Click on X to remove todo from the list </p>
        <p><a href="https://github.com/codedog001/todo_graphql_react" target={"_blank"} >View Source</a></p>
      </footer>
    </div>
  );
}

export default App;
