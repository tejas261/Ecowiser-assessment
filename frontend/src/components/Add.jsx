import React, { useEffect, useState } from "react";
import InputModal from "./Modal.jsx";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../firebase.js";
import pin from "../assets/pinned.png";
import bin from "../assets/bin.png";
import add from "../assets/add.png";
import unpin from "../assets/unpinned.png";
import toast from "react-hot-toast";

const firestore = getFirestore(app);

function Add() {
  const [notesData, setNotesData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const notesPerPage = 6;

  const openModal = (note) => {
    setSelectedNote(note);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setModalIsOpen(false);
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    if (selectedNote) {
      const noteRef = doc(firestore, "notes", selectedNote.id);
      try {
        await updateDoc(noteRef, data);
        setNotesData((prevNotes) =>
          prevNotes.map((note) =>
            note.id === selectedNote.id ? { ...note, ...data } : note
          )
        );
        toast.success("Note updated!");
      } catch (error) {
        console.error("Error updating document: ", error);
        toast.error("Error updating note");
      }
    } else {
      try {
        const res = await addDoc(collection(firestore, "notes"), {
          ...data,
          pinned: false,
        });
        setNotesData((prevNotes) => [
          ...prevNotes,
          { id: res.id, ...data, pinned: false },
        ]);
        toast.success("Note added!");
      } catch (error) {
        console.error("Error adding document: ", error);
        toast.error("Error adding note");
      }
    }
    setLoading(false);
    closeModal();
  };

  const handlePinClick = async (note) => {
    const updatedNotes = notesData.map((n) => ({
      ...n,
      pinned: n.id === note.id ? !n.pinned : n.pinned,
    }));

    try {
      const noteRef = doc(firestore, "notes", note.id);
      await updateDoc(noteRef, { pinned: !note.pinned });
      setNotesData(updatedNotes);
    } catch (error) {
      console.error("Error updating pin status: ", error);
    }
  };

  const handleDelete = async (note) => {
    try {
      const noteRef = doc(firestore, "notes", note.id);
      await deleteDoc(noteRef);
      setNotesData((prevNotes) => prevNotes.filter((n) => n.id !== note.id));
      toast.success("Note deleted!");
    } catch (error) {
      console.error("Error deleting the note: ", error);
      toast.error("Error deleting note");
    }
  };

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, "notes"));
        const notes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotesData(notes);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        toast.error("Error fetching notes");
      }
      setLoading(false);
    }

    getData();
  }, []);

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const pinnedNotes = notesData.filter((note) => note.pinned);
  const unpinnedNotes = notesData.filter((note) => !note.pinned);
  const combinedNotes = [...pinnedNotes, ...unpinnedNotes];
  const currentNotes = combinedNotes.slice(indexOfFirstNote, indexOfLastNote);

  const totalPages = Math.ceil(combinedNotes.length / notesPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-3 grid-rows-2 xs:max-lg:grid-cols-2 xs:max-lg:grid-rows-3 xs:max-md:grid-cols-1 xs:max-md:grid-rows-6 xs:max-md:w-[30rem] my-5 xs:max-md:mx-auto xs:max-sm:w-[20rem] xs:max-sm:mx-auto ">
          <SkeletonTheme
            duration={5}
            baseColor="#fef9c3"
            highlightColor="#fde68a"
          >
            <div className="m-20 xs:max-sm:w-[13rem] xs:max-sm:mx-auto rounded-xl w-80 h-auto">
              <Skeleton className="m-1" count={3} />
            </div>
            <div className="m-20 xs:max-sm:w-[13rem] xs:max-sm:mx-auto rounded-xl w-80 h-auto">
              <Skeleton className="m-1" count={3} />
            </div>
            <div className="m-20 xs:max-sm:w-[13rem] xs:max-sm:mx-auto rounded-xl w-80 h-auto">
              <Skeleton className="m-1" count={3} />
            </div>
            <div className="m-20 xs:max-sm:w-[13rem] xs:max-sm:mx-auto rounded-xl w-80 h-auto">
              <Skeleton className="m-1" count={3} />
            </div>
            <div className="m-20 xs:max-sm:w-[13rem] xs:max-sm:mx-auto rounded-xl w-80 h-auto">
              <Skeleton className="m-1" count={3} />
            </div>
            <div className="m-20 xs:max-sm:w-[13rem] xs:max-sm:mx-auto rounded-xl w-80 h-auto">
              <Skeleton className="m-1" count={3} />
            </div>
          </SkeletonTheme>
        </div>
      ) : (
        <>
          <div className="p-5 grid grid-cols-3 grid-rows-2 xs:max-lg:grid-cols-2 xs:max-lg:grid-rows-3 xs:max-md:grid-cols-1 xs:max-md:grid-rows-6 xs:max-md:w-[30rem] my-5 xs:max-md:mx-auto xs:max-sm:w-[20rem] xs:max-sm:mx-auto">
            {currentNotes.map((note) => (
              <div
                key={note.id}
                className="relative bg-yellow-100 p-5 m-5 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-bold mb-2">{note.title}</h2>
                <p className="text-gray-600">{note.tagline}</p>
                <p className="mt-4">{note.description}</p>
                <div className="absolute top-0 right-0 m-3 flex space-x-2">
                  <img
                    src={note.pinned ? pin : unpin}
                    alt="Pin"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => handlePinClick(note)}
                  />
                  <img
                    src={bin}
                    alt="Delete"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => handleDelete(note)}
                  />
                </div>
                <button
                  className="absolute bottom-0 right-0 m-3 text-blue-500"
                  onClick={() => openModal(note)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageClick(number)}
                className={`mx-1 px-3 py-1 rounded ${
                  number === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        className="fixed bottom-10 right-10 bg-yellow-300 text-white rounded-full p-5 shadow-lg hover:bg-yellow-500"
        onClick={() => openModal(null)}
      >
        <img src={add} alt="Add" className="w-8 h-8" />
      </button>

      <InputModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onSubmit={handleFormSubmit}
        note={selectedNote}
      />
    </>
  );
}

export default Add;
