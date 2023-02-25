# react-signals

The simplest and easiest-to-use, TypeScript-first, state management solution for React.

## How to use it

react-signals consists of only one single hook with 3 very important parameters.

- **_name_** (required): The identifier of the signal.
- **_defaultValue_** (required): Similar to `useState`, we provide a default value for our signal.
- **_context_** (optional): It can be used to group multiple signals and prevent collision, meaning that signals can have the same name between different contexts. If not provided, it will be set as "default" automatically.

In this example, these two separate components share the same state and synchronize between each other. There's no need for any setup, it just simply works!

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

## Why you should use react-signals

Most of the modern recently launched frontend frameworks are leaning towards the use of some sort of "signal" architecture. We have experienced that the React state management solutions are getting more and more complex in recent years when, in reality, it can be very easy to handle when you decouple the state from the component. There are a few state management solutions out there trying to solve this problem, but most of them require some sort of setup that can sometimes be unnecessary and complex.
<br/><br/>
`React Signals` tackles this problem in a very smart way. It simplifies everything, from the usage to the code itself and although it might not be the last state management solution for React, it certainly can create the basis for future libraries.
