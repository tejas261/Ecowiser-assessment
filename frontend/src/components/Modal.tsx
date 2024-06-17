import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { getFirestore, collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { app } from "../firebase.js";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";

const firestore = getFirestore(app);

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
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setTagline(note.tagline);
      setBody(note.description);
    } else {
      setTitle("");
      setTagline("");
      setBody("");
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, tagline, description: body });
    onRequestClose();
  };

  async function sendData(data) {
    try {
      if (note) {
        // Update existing note
        setLoading(true)
        const noteRef = doc(firestore, "notes", note.id);
        await updateDoc(noteRef, data);
        console.log("Note updated:", note.id);
        toast.success("Note edit successful!!")
        setLoading(false)
      } else {
        // Add new note
        setLoading(true)
        const res = await addDoc(collection(firestore, "notes"), data);
        console.log("New note added:", res.id);
        toast.success("Note added!!")
        setLoading(false)
      }
    } catch (error) {
      setLoading(true)
      console.error("Error adding/updating document: ", error);
      toast.error("Error!!")
      setLoading(false)
    }
  }

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
          />
        </div>
        <div className="flex flex-col my-4">
          <label>Body:</label>
          <textarea
            className=" overflow-hidden p-2 rounded-xl outline-none"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>
        <div className="mx-auto">
          <button
            onClick={() => sendData({ title, tagline, description: body })}
            className="py-3 my-2 font-bold bg-yellow-300 text-white rounded-xl px-2"
            type="submit"
          >
            Submit
          </button>
        </div>
        <div>
          {loading && <HashLoader color="#d2d736" />}
        </div>
      </form>
    </Modal>
    </div>
  );
}

export default InputModal;
