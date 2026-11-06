// @codetype medium | Reducer that manages a todo list state
export function todoReducer(state, action) {
  switch (action.type) {
    case 'added':
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'toggled':
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      );
    case 'deleted':
      return state.filter((todo) => todo.id !== action.id);
    case 'cleared':
      return state.filter((todo) => !todo.done);
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
