# react-signals

The most simple and easy to use state management system for react

## How to use it

react-signals is very simple to use, it consists of only one single hook with 3 very important parameters.

- **_name_** (required): The identifier of the signal.
- **_defaultValue_** (required): Similar to useState, we provide a default value to our signal.
- **_context_** (optional): It can be used to group multiple signals and prevent collision meaning that signals can have the same name between different contexts. If not provided, it will be set as "default" automatically.

In this example, these two separate components share the same state and syncronize between each other. There's no need of any set up, it just simply works!

```
import { useSignal } from "@zpaceway/react-signals";

const Counter1 = () => {
  const [getCount, setCount] = useSignal({
    name: "counter",
    defaultValue: 0,
    context: "default",
  });

  return (
    <div>
      <div>{getCount()}</div>
      <div>
        <button onClick={() => setCount(getCount() + 1)}>+</button>
        <button onClick={() => setCount(getCount() - 1)}>-</button>
      </div>
    </div>
  );
};

const Counter2 = () => {
  const [getCount, setCount] = useSignal({
    name: "counter",
    defaultValue: 0,
    context: "default",
  });

  return (
    <div>
      <div>{getCount()}</div>
      <div>
        <button onClick={() => setCount(getCount() + 1)}>+</button>
        <button onClick={() => setCount(getCount() - 1)}>-</button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Counter1 />
      <Counter2 />
    </div>
  );
};

export default App;

```
