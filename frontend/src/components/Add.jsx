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
    if (selectedNote) {
      const noteRef = doc(firestore, "notes", selectedNote.id);
      try {
        await updateDoc(noteRef, data);
        setNotesData((prevNotes) =>
          prevNotes.map((note) =>
            note.id === selectedNote.id ? { ...note, ...data } : note
          )
        );
        closeModal();
      } catch (error) {
        console.error("Error updating document: ", error);
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
        closeModal();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
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
    } catch (error) {
      console.error("Error deleting the note: ", error);
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
            <div className="m-20 rounded-xl w-80 h-auto xs:max-sm:w-[13rem] xs:max-sm:mx-auto">
              <Skeleton className="m-1" count={3} />
            </div>
          </SkeletonTheme>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 grid-rows-2 xs:max-lg:grid-cols-2 xs:max-lg:grid-rows-3 xs:max-md:grid-cols-1 xs:max-md:grid-rows-6 xs:max-md:w-[30rem] my-5 xs:max-md:mx-auto xs:max-sm:w-[20rem] xs:max-sm:mx-auto ">
            {currentNotes.length == 0 ? (
              <h1 className="text-center mx-auto absolute left-[45vw] py-10 text-3xl">
                No notes found!!
              </h1>
            ) : (
              currentNotes.map((note) => (
                <div
                  className="group m-20 border-2 rounded-xl w-80 h-auto"
                  key={note.id}
                >
                  <button
                    onClick={() => handleDelete(note)}
                    className="group-hover:block hidden transition ease-in-out duration-150 relative w-10 m-2 left-[90%]"
                  >
                    <img width={15} src={bin} alt="" />
                  </button>
                  <h1 className="text-3xl p-3" onClick={() => openModal(note)}>
                    {note.title}
                  </h1>
                  <h3 className="text-xl px-5">{note.tagline}</h3>
                  <p className="p-4 px-5">{note.description}</p>
                  <button
                    onClick={() => handlePinClick(note)}
                    className={`py-2 px-4 transition ease-in-out duration-150 relative bottom-0 rounded ${
                      note.pinned ? "block" : "hidden"
                    } group-hover:block`}
                  >
                    <img
                      width={15}
                      src={note.pinned ? pin : unpin}
                      alt={note.pinned ? "Unpin" : "Pin"}
                    />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center my-4">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={`px-4 py-2 mx-1 bg-gray-300 rounded ${
                  currentPage === pageNumber ? "bg-yellow-300 text-white" : ""
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="w-20 h-20 bg-yellow-300 fixed left-[90%] bottom-[5%] my-2 rounded-[5rem] justify-center items-center flex xs:max-md:relative md:max-lg:translate-x-[-5rem] xs:max-md:translate-x-[-5rem]">
        <button onClick={() => openModal(null)} className="xs:max-md:w-20">
          <img src={add} className="xs:max-md:ml-6" width={30} alt="Add" />
        </button>
        <InputModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          onSubmit={handleFormSubmit}
          note={selectedNote}
        />
      </div>
    </>
  );
}

export default Add;
