import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const NotePage = ({ match, history }) => {
  let [note, setNote] = useState(null);
  const textareaElement = useRef(null);
  let noteId = match.params.id;
  let getNote = async () => {
    if (noteId !== "new") {
      let response = await fetch(`/api/notes/${noteId}`);
      let data = await response.json();
      setNote(data);
    }
  };
  useEffect(() => {
    getNote();
    if (textareaElement.current) {
      textareaElement.current.focus();
    }
  }, [noteId]);

  let updateNote = async () => {
    await fetch(`/api/notes/${noteId}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(note),
    });
  };
  let createNote = async () => {
    await fetch(`/api/notes/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(note),
    });
  };
  let deleteNote = async () => {
    await fetch(`/api/notes/${noteId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ note }),
    });
    history.push("/");
  };
  let handleSubmit = () => {
    if (noteId !== "new" && !note.body) {
      deleteNote();
    } else if (noteId === "new" && note.body) {
      createNote();
    } else {
      updateNote();
    }
    history.push("/");
  };

  return (
    <div className="note">
      <div className="note-header">
        <h3>
          <Link to="/">
            <ArrowLeft onClick={handleSubmit} />
          </Link>
        </h3>
        {noteId !== "new" ? (
          <button onClick={deleteNote}>Delete</button>
        ) : (
          <button onClick={handleSubmit}>Done</button>
        )}
      </div>
      <textarea
        ref={textareaElement}
        onChange={(e) => {
          setNote({ ...note, body: e.target.value });
        }}
        value={note?.body}
      ></textarea>
    </div>
  );
};

export default NotePage;
