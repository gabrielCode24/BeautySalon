export default function reducer(state = { list: undefined }, action){
	switch(action.type){
		case 'GET_PROCEDIMIENTOS':
		
		state = {
		   ...state.procedimientos, list: action.payload.list
		}
		break;
		
		default:
		return state;
	}

	return state
}