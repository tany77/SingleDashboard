import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions/noteActions';
import authService from '../api-authorization/AuthorizeService';
import Note from '../Note/Note';
import './NoteList.css';
import { Button } from 'react-bootstrap';
import ModalPopup from '../ModalPopup/ModalPopup';

const NoteList = () => {
    let notes = useSelector(state => state.note.list);
    let isLoading = useSelector(state => state.note.isLoading);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMyOnly, setIsMyOnly] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    let dispatch = useDispatch();

    const emptyNote = {
        noteId: 0,
        name: '',
        description: ''
    };
    const [selectedNote, setSelectedNote] = useState({ ...emptyNote });

    useEffect(() => {
        async function getUser() {
            let user = await authService.getUser();
            setIsAdmin(user?.role === "Admin");
        };
        getUser();
    }, [])

    useEffect(() => {
        actions.fetchAll(isMyOnly)(dispatch);

    }, [isMyOnly])

    const editNote = (noteId) => {
        let item = notes.find(x => x.noteId === noteId);
        setSelectedNote(item);
        setModalShow(true);
    }

    const addNote = () => {
        setSelectedNote({ ...emptyNote });
        setModalShow(true)
    }

    const handlerMyOnly = () => {
        setIsMyOnly(!isMyOnly);
    }

    return (
        <div>
            <ModalPopup
                show={modalShow}
                onHide={() => setModalShow(false)}
                note={selectedNote}
            />
            <div className="row">
                <div className="col-lg-12">
                    {isLoading && <p>Loading ....</p>}
                    {!isLoading &&
                        <>
                            <div className="header-block">
                                <div className="form-group form-check">
                                    {isAdmin &&
                                        <>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="checkForm"
                                                onChange={handlerMyOnly}
                                                defaultChecked={isMyOnly}
                                            />
                                            <label className="form-check-label" htmlFor="checkForm">Only my notes</label>
                                        </>
                                    }
                                </div>
                                <Button
                                    variant="success btn-add px-4"
                                    onClick={addNote}>
                                    Add note
                                </Button>
                            </div>
                            <table className="table table-striped table-hover table-notes">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        {(isAdmin && !isMyOnly) && <th>User</th>}
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notes &&
                                        notes.map((note, index) => {
                                            return (
                                                <Note
                                                    note={note}
                                                    key={index}
                                                    onEdit={editNote}
                                                    isCurrentUserAdmin={isAdmin}
                                                    isMyOnly={isMyOnly}
                                                />)
                                        })
                                    }
                                    {(notes?.length === 0 || !notes) && <tr><td colSpan="6">No records</td></tr>}
                                </tbody>
                            </table>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
export default NoteList;
