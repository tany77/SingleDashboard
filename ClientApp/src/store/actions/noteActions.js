import api from "../../services/api";

export const ACTION_TYPES = {
    CREATE_START: 'CREATE_START',
    CREATE_FINISH: 'CREATE_FINISH',
    UPDATE_START: 'UPDATE_START',
    UPDATE_FINISH: 'UPDATE_FINISH',
    DELETE_START: 'DELETE_START',
    DELETE_FINISH: 'DELETE_FINISH',
    FETCH_ALL_START: 'FETCH_ALL_START',
    FETCH_ALL_FINISH: 'FETCH_ALL_FINISH'
}

export const fetchAll = (isCurrentUserOnly) => dispatch => {
    api.noteActions().get(isCurrentUserOnly)
        .then((response) => {
            dispatch({
                type: ACTION_TYPES.FETCH_ALL_FINISH,
                payload: response.data
            })
        })
        .catch(err => console.log(err))

    dispatch({
        type: ACTION_TYPES.FETCH_ALL_START,
    })
}

export const create = (data) => dispatch => {
    api.noteActions().create(data)
        .then(res => {
            dispatch({
                type: ACTION_TYPES.CREATE_FINISH,
                payload: res.data
            })
        })
        .catch(err => console.log(err))
    dispatch({
        type: ACTION_TYPES.CREATE_START,
    })
}

export const update = (noteId, data) => dispatch => {
    api.noteActions().update(noteId, data)
        .then(res => {
            dispatch({
                type: ACTION_TYPES.UPDATE_FINISH,
                payload: { noteId, ...data }
            })
        })
        .catch(err => console.log(err))
    dispatch({
        type: ACTION_TYPES.UPDATE_START,
    })
}

export const Delete = (noteId) => dispatch => {
    api.noteActions().delete(noteId)
        .then(res => {
            dispatch({
                type: ACTION_TYPES.DELETE_FINISH,
                payload: noteId
            })
        })
        .catch(err => console.log(err))
    dispatch({
        type: ACTION_TYPES.DELETE_START,
    })
}