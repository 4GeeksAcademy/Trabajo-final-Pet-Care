export const initialStore = () => {
  return {
    message: null,
    signupMessage: null,  //  lugar para guardar el mensaje de registro
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'set_signup_message':   // case para actualizar signupMessage
      return {
        ...store,
        signupMessage: action.payload
      };

    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        )
      };

    case 'reset_store':
      return initialStore();

    default:
      throw Error('Unknown action.');
  }
}
