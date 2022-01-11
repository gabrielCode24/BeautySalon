export function getProcedimientos(_list){
    return function(dispatch){
        dispatch({
            type: 'GET_PROCEDIMIENTOS',
            payload: {
                list: _list
            }
        })
    }
}