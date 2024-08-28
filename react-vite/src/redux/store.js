import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import { instrumentReducer } from "./instrument";
import { orderReducer } from "./cart";
import { historyReducer } from "./history";
import { favoriteReducer } from "./favorite";
import { newsReducer } from "./news";

const rootReducer = combineReducers({
  session: sessionReducer,
  instruments: instrumentReducer,
  orders: orderReducer,
  histories: historyReducer,
  favorites: favoriteReducer,
  news: newsReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
