import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_NOTE, UPLOAD_IMAGE, UPDATE_NOTE, DELETE_NOTE } from "../utils/mutations";

interface Note {
  _id: string;
  title: string;
  note: string;
  imageUrl?: string;
}

interface CreateNoteProps {
  onAddNote: () => void;
  noteToEdit?: Note;
  onFinishEdit?: () => void;
}

export default function CreateNote({ onAddNote, noteToEdit, onFinishEdit }: CreateNoteProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState<File | undefined | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [addNote] = useMutation(ADD_NOTE);
  const [updateNote] = useMutation(UPDATE_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setNote(noteToEdit.note);
      setImagePreview(noteToEdit.imageUrl || null);
    }
  }, [noteToEdit]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleDelete = async () => {
    if (noteToEdit && confirm("Are you sure you want to delete this note?")) {
      await deleteNote({ variables: { id: noteToEdit._id } });
      onAddNote();
      onFinishEdit?.();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let imageUrl = imagePreview || "";

    // Upload image if changed
    if (image) {
      const response = await uploadImage({
        variables: { file: image },
        context: { headers: { "Apollo-Require-Preflight": "true" } },
      });
      imageUrl = response.data.uploadImage;
    }

    if (noteToEdit) {
      await updateNote({
        variables: {
          _id: noteToEdit._id,
          title,
          note,
          imageUrl,
        },
      });
      onFinishEdit?.();
    } else {
      await addNote({
        variables: { title, note, imageUrl },
      });
    }

    onAddNote();
    setTitle("");
    setNote("");
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="create-story-container">
      <div className="create-story-box">
        <h1>{noteToEdit ? "Edit Note" : "Create Note"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Topic Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write Your Notes Here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />

          <label>Choose a picture to upload:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple={false}
          />

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button type="button" onClick={handleRemoveImage}>Remove Image</button>
            </div>
          )}

          <input type="submit" value={noteToEdit ? "Save Changes" : "Post Story"} />

          {noteToEdit && (
            <>
              <button type="button" onClick={handleDelete} style={{ marginTop: "10px" }}>
                Delete Note
              </button>
              <button type="button" onClick={onFinishEdit} style={{ marginTop: "10px", marginLeft: "10px" }}>
                Cancel
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
