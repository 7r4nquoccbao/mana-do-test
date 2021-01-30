import {Todo, TodoStatus} from '../models/todo';
import {
  AppActions,
  CREATE_TODO,
  DELETE_ALL_TODOS,
  DELETE_TODO,
  TOGGLE_ALL_TODOS,
  UPDATE_TODO_STATUS,
  MODIFY_TODO
} from './actions';

export interface AppState {
  todos: Array<Todo>
}

const getState = () => {
  const lStore = JSON.parse(localStorage.getItem('todos') || '[]');
  return lStore;
}

export const initialState: AppState = {
  todos: getState()
}

function reducer(state: AppState, action: AppActions): AppState {
  switch (action.type) {
    case CREATE_TODO:
      localStorage.setItem('todos', JSON.stringify([...state.todos, action.payload]));
      return {...state, todos: [...state.todos, action.payload]};

    case UPDATE_TODO_STATUS:
      const targetIndex = state.todos.findIndex((todo) => {
        return todo.id === action.payload.todoId
      })

      state.todos[targetIndex] = {...state.todos[targetIndex], status: action.payload.checked ? TodoStatus.COMPLETED : TodoStatus.ACTIVE}

      localStorage.setItem('todos', JSON.stringify([...state.todos]));

      return {
        ...state,
        todos: state.todos
      }

    case TOGGLE_ALL_TODOS:

      const status = action.payload ? TodoStatus.COMPLETED : TodoStatus.ACTIVE;
      
      const toggleTodos = state.todos.map((todo) => {
        return {...todo, status: status}
      })

      localStorage.setItem('todos', JSON.stringify(toggleTodos));

      return {
        ...state,
        todos: [...toggleTodos]
      }

    case DELETE_TODO:
      const newTodos = state.todos.filter((todo) => {
        return todo.id !== action.payload
      });
      localStorage.setItem('todos', JSON.stringify(newTodos));

      return {...state, todos: [...newTodos]};

    case DELETE_ALL_TODOS:
      localStorage.setItem('todos', '[]');
      return {
        ...state,
        todos: []
      }

    case MODIFY_TODO:
      const {id, content} = action.payload;

      const indexTarget = state.todos.findIndex(todo => {
        return todo.id === id;
      })

      const todoModified : Todo = {
        id: id,
        content: content,
        created_date: new Date().toISOString(),
        user_id: state.todos[indexTarget].user_id || "",
        status: state.todos[indexTarget].status
      }

      state.todos[indexTarget] = todoModified;

      localStorage.setItem('todos', JSON.stringify([...state.todos]));

      return {
        ...state,
        todos: state.todos
      }

    default:
      return state;
  }
}

export default reducer;