import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import * as actions from '../../store/actions/noteActions';

const ModalPopup = ({ note, show, onHide }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setName(note.name);
        setDescription(note.description)
        setIsEdit(note.noteId > 0)
    }, [note])

    const handleSubmit = e => {
        e.preventDefault();
        const values = {
            name: name,
            description: description,
            created: note.noteId !== 0 ? note.created : new Date(),
            noteId: note.noteId,
            userName: note.userName
        };

        if (note.noteId === 0) {
            actions.create(values)(dispatch);
        } else {
            actions.update(values.noteId, values)(dispatch);
        }

        onHide();
    }

    return (
        <Modal show={show} onHide={onHide} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEdit && 'Edit note'}
                    {!isEdit && 'Create new note'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <form className="form" onSubmit={handleSubmit} autoComplete="off" id="note_form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Input name..."
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                rows="5"
                                type="text"
                                className="form-control"
                                id="description"
                                placeholder="Input description..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                        </div>
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary px-4" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary px-4" type="submit" form="note_form">
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default ModalPopup;