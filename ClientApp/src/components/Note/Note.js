import React from 'react';
import './Note.css';
import { useDispatch } from 'react-redux';
import * as actions from '../../store/actions/noteActions';
import * as moment from 'moment'

const Note = ({ note, onEdit, isCurrentUserAdmin, isMyOnly }) => {
    var dispatch = useDispatch();

    const onDelete = id => {
        if (window.confirm('Are you sure to delete this record?'))
            actions.Delete(id, () => alert("Deleted successfully", { appearance: 'info' }))(dispatch)
    }

    return (
        <tr>
            <td>{note.noteId}</td>
            <td>{note.name}</td>
            <td>{note.description}</td>
            <td>
                {moment(note.created).format('DD-MM-YYYY')}
            </td>
            {(isCurrentUserAdmin && !isMyOnly) && <td>{note.userName}</td>}
            <td>
                <button
                    type="button"
                    className="btn btn-edit"
                    onClick={() => onEdit(note.noteId)}
                >
                    <img src='./icons/pen-solid.svg' alt="icon" height="16" /> </button>
                <button
                    type="button"
                    className="btn btn-delete"
                    onClick={() => onDelete(note.noteId)}
                ><img src='./icons/trash-alt-regular.svg' alt="icon" height="16" /></button>
            </td>
        </tr>
    )
}
export default Note;