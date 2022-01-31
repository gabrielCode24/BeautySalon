export function getCitaData(_list){
    return function(dispatch){
        dispatch({
            type: 'GET_CITA',
            payload: {
                list: _list
            }
        })
    }
}