export function baseReducer({ state, action, contextName }) {

  if (!Object.hasOwn(state, action.name)) {
    throw Error(`${action.name} is not a valid property for ${contextName}`);
  }

  let newState = { ...state };
  
  switch(action.type) {
    
    case 'set':
      newState[action.name] = action.value;
      break;

    // ?? ARE CLEAR AND UPDATE NEEDED ??/  
    // case 'clear':
    //   newState[action.name] = null;
    //   break;
  
    // case 'update':
    //   newState[action.name] = action.value(newState[action.name]);
    //   break;

  }

  return newState;

}