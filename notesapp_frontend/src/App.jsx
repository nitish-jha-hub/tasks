import { useState,useEffect } from 'react';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetch('http://localhost:3011/notes')
      .then(response => response.json())
      .then(data => setNotes(data))
      .catch(error => console.error('Error fetching notes:', error));
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (noteText.trim()) {
      fetch('http://localhost:3011/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: noteText, title: 'Notes' }),
      })
        .then(response => response.json())
        .then(() => {
          setNoteText('');
          fetch('http://localhost:3011/notes')
            .then(response => response.json())
            .then(data => setNotes(data))
            .catch(error => console.error('Error fetching notes:', error));
        })
        .catch(error => console.error('Error adding note:', error));
    }
  };

  const handleDeleteNote = (index) => {
    // console.log('Deleting note:', notes[index]);
    fetch(`http://localhost:3011/notes/${notes[index].NoteID}`, {
      method: 'DELETE',
    })
      .then(() => {
        console.log('Note deleted successfully');
        fetch('http://localhost:3011/notes')
          .then(response => response.json())
          .then(data => setNotes(data))
          .catch(error => console.error('Error fetching notes:', error));
      })
      .catch(error => console.error('Error deleting note:', error));
  };

  console.log(notes);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Take a note..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddNote}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Add Note
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note, index) => (
          <div key={index} className="relative bg-white p-4 rounded shadow">
            <button
              onClick={() => handleDeleteNote(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title='Delete Note'
            >
              &times;
            </button>
            <p>{note.Content }</p>
            <p className="text-gray-500 text-sm">{note.UpdatedAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
