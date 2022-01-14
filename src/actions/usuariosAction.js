export function getUsuarios(_list){
    return function(dispatch){
        dispatch({
            type: 'GET_USUARIOS',
            payload: {
                list: _list
            }
        })
    }
}