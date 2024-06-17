import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "30rem",
    height: "auto",
    backgroundColor: "#fef9c3",
    borderRadius: "20px",
    overflow: "hidden",
    padding: "20px",
  },
};

Modal.setAppElement("#root");

function InputModal({ isOpen, onRequestClose, onSubmit, note }) {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setTagline(note.tagline);
      setBody(note.description);
      setPinned(note.pinned);
    } else {
      setTitle("");
      setTagline("");
      setBody("");
      setPinned(false);
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, tagline, description: body, pinned });
  };

  return (
    <div className="xs:max-sm:w-[10rem] bg-yellow-100">
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Input Modal"
      >
        <form className="text-xl bg-yellow-100" onSubmit={handleSubmit}>
          <div className="flex flex-col my-4">
            <label>Title:</label>
            <input
              className="p-2 rounded-xl overflow-hidden outline-none"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col my-4">
            <label>Tagline:</label>
            <input
              className="p-2 rounded-xl overflow-hidden outline-none"
              type="text"
              placeholder="Enter tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col my-4">
            <label>Body:</label>
            <textarea
              className="overflow-hidden p-2 rounded-xl outline-none"
              placeholder="Enter body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mx-auto">
            <button
              className="py-3 my-2 font-bold bg-yellow-300 text-white rounded-xl px-2"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default InputModal;
