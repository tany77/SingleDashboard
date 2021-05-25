import { ACTION_TYPES } from "../actions/noteActions";

const initialState = {
    list: [],
    isLoading: false
}

export const note = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL_START:
            return {
                ...state,
                isLoading: true,
            }

        case ACTION_TYPES.CREATE_START:
            return {
                ...state,
                isLoading: true,
            }

        case ACTION_TYPES.UPDATE_START:
            return {
                ...state,
                isLoading: true,
            }

        case ACTION_TYPES.DELETE_START:
            return {
                ...state,
                isLoading: true,
            }

        case ACTION_TYPES.FETCH_ALL_FINISH:
            return {
                ...state,
                list: [...action.payload],
                isLoading: false,
            }

        case ACTION_TYPES.CREATE_FINISH:
            return {
                ...state,
                list: [...state.list, action.payload],
                isLoading: false
            }

        case ACTION_TYPES.UPDATE_FINISH:
            return {
                ...state,
                list: state.list.map(x => x.noteId === action.payload.noteId ? action.payload : x),
                isLoading: false
            }

        case ACTION_TYPES.DELETE_FINISH:
            return {
                ...state,
                list: state.list.filter(x => x.noteId !== action.payload),
                isLoading: false
            }

        default:
            return { ...state }
    }
}