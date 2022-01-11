export function getProcedimiento(_list){
    return function(dispatch){
        dispatch({
            type: 'GET_PROCEDIMIENTO',
            payload: {
                list: _list
            }
        })
    }
}