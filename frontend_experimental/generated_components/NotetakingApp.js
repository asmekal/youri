import React, { useState, useEffect } from 'react';

const NotetakingApp = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState(() => {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (note.trim() !== '') {
      setNotes([...notes, note]);
      setNote('');
    }
  };

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((note, i) => i !== index));
  };

  return (
    <div className="card">
      <h2>Note-taking App with Local Storage</h2>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note..."
      />
      <button onClick={handleAddNote}>Save Note</button>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>
            {note}
            <button onClick={() => handleDeleteNote(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotetakingApp;