export default function reducer(state = { list: undefined }, action){
	switch(action.type){
		case 'GET_PROCEDIMIENTO':
		
		state = {
		   ...state.procedimiento, list: action.payload.list
		}
		break;
		
		default:
		return state;
	}

	return state
}