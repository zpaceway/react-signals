# react-signals

The simplest and easiest-to-use, TypeScript-first, state management solution for React.

## How to use it

react-signals consists of only one single hook called `useSignal` with 3 very important parameters.

- **name** (required): The identifier of the signal (If you use the helper function `createSignal` to generate the signal object, there's no need to set the name).
- **initialValue** (required): Similar to `useState`, we provide an initial value for our signal.
- **context** (optional): It can be used to group multiple signals and prevent collision, meaning that signals can have the same name between different contexts. If not provided or if the signal object is generated using the createSignal helper function, it will be set as "default" automatically.

You can also pass extra options to the `useSignal` hook, the options available are:

- **subscribe** (optional): It is set to `true` by default, if set to `false`, the component where the signal is mounted will not receive updates from the signal on changes automatically (but other places where you are using your signal without setting subscribe as `false` will). Very useful when you want to control your state more granularly and improve performance.

The return type of the `useSignal` hook is an object with the following elements:

- **state**: The state of the signal.
- **setState**: Sets the state of the current signal.
- **reset**: Sets the state to the initial default value provided to the signal.
- **detectChanges**: Forces change detection on the current signal. Useful when subscribe is set to false and you want to control manually change detection.

In this example, these separate individual components are listening to the same signal. There's no need for any extra setup, it just simply works!

You can also try out live a more advanced example by clicking [here.](https://codesandbox.io/p/sandbox/laughing-shape-xp5q5w?selection=%5B%7B%22endColumn%22%3A1%2C%22endLineNumber%22%3A2%2C%22startColumn%22%3A1%2C%22startLineNumber%22%3A2%7D%5D&file=%2Fsrc%2FApp.tsx)

```
import { useSignal, createSignal } from "@zpaceway/react-signals";

/**
  The value of counterSignal would be something similar to:

  {
    name: "2e825f67-878e-445b-bff6-429196cb2d1d",
    context: "default",
    initialValue: 0,
  }

 */
export const counterSignal = createSignal({
  initialValue: 0,
});

const Counter1 = () => {
  const { state: count, setState: setCount } = useSignal(counterSignal);

  return (
    <div style={{ margin: "20px 0" }}>
      <div>{count}</div>
      <div>
        <button onClick={() => setCount(count + 1)}>+</button>
        <button onClick={() => setCount(count - 1)}>-</button>
      </div>
    </div>
  );
};

const Counter2 = () => {
  const { state: count, setState: setCount } = useSignal(counterSignal);

  return (
    <div style={{ margin: "20px 0" }}>
      <div>{count}</div>
      <div>
        <button onClick={() => setCount(count + 1)}>+</button>
        <button onClick={() => setCount(count - 1)}>-</button>
      </div>
    </div>
  );
};

const Counter3 = () => {
  const { state: count, detectChanges: detectCounterChanges } = useSignal(
    counterSignal,
    { subscribe: false }
  );

  return (
    <div style={{ margin: "20px 0" }}>
      <div>{count}</div>
      <div>
        <button onClick={detectCounterChanges}>Detect counter changes</button>
      </div>
    </div>
  );
};

const ResetCounter = () => {
  const { reset: resetCounters } = useSignal(counterSignal, {
    subscribe: false,
  });

  return (
    <div style={{ margin: "20px 0" }}>
      <button onClick={resetCounters}>reset counters</button>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Counter1 />
      <Counter2 />
      <Counter3 />
      <ResetCounter />
    </div>
  );
};

export default App;
```

## Why you should use react-signals

Most of the modern recently launched frontend frameworks are leaning towards the use of some sort of "signal" architecture. We have experienced that the React state management solutions are getting more and more complex in recent years when, in reality, it can be very easy to handle when you decouple the state from the component. There are a few state management solutions out there trying to solve this problem, but most of them require some sort of setup that can sometimes be unnecessary and complex.
<br/><br/>
`React Signals` tackles this problem in a very smart way. It simplifies everything, from the usage to the code itself and although it might not be the last state management solution for React, it certainly can create the basis for future libraries.
