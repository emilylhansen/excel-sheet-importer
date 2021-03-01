import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { rootReducer } from "./reducer";
import App from "./App";

const store = createStore(combineReducers({ root: rootReducer }));

const rootElement = document.getElementById("root");

render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
