import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';

export function configureStore(initialState) {
  const store = createStore(
    reducers,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  
  return store;
}