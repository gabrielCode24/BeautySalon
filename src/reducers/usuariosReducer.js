export default function reducer(state = { list: undefined }, action){
	switch(action.type){
		case 'GET_USUARIOS':
		
		state = {
		   ...state.usuarios, list: action.payload.list
		}
		break;
		
		default:
		return state;
	}

	return state
}