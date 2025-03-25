import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_NOTE, UPLOAD_IMAGE, UPDATE_NOTE, DELETE_NOTE } from "../utils/mutations";

interface Note {
  _id: string;
  title: string;
  note: string;
  imageUrls?: string[];
}

interface CreateNoteProps {
  onAddNote: () => void;
  noteToEdit?: Note;
  onFinishEdit?: () => void;
}

export default function CreateNote({ onAddNote, noteToEdit, onFinishEdit }: CreateNoteProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [addNote] = useMutation(ADD_NOTE);
  const [updateNote] = useMutation(UPDATE_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);

  // Pre-fill form if editing
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setNote(noteToEdit.note);
      setExistingImages(noteToEdit.imageUrls || []);
    }
  }, [noteToEdit]);

  // Handle file input
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
  };

  // Remove a newly added image
  const handleRemoveNewImage = (index: number) => {
    const updatedImages = [...newImages];
    const updatedPreviews = [...newImagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setNewImages(updatedImages);
    setNewImagePreviews(updatedPreviews);
  };

  // Remove an existing image from noteToEdit
  const handleRemoveExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
  };

  // Delete note
  const handleDelete = async () => {
    if (noteToEdit && confirm("Are you sure you want to delete this note?")) {
      await deleteNote({ variables: { id: noteToEdit._id } });
      onAddNote();
      onFinishEdit?.();
    }
  };

  // Submit (Create or Update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let uploadedUrls: string[] = [];

    for (const file of newImages) {
      const { data } = await uploadImage({
        variables: { file },
        context: { headers: { "Apollo-Require-Preflight": "true" } },
      });
      uploadedUrls.push(data.uploadImage);
    }

    const finalImageUrls = [...existingImages, ...uploadedUrls];

    if (noteToEdit) {
      await updateNote({
        variables: {
          _id: noteToEdit._id,
          title,
          note,
          imageUrls: finalImageUrls,
        },
      });
      onFinishEdit?.();
    } else {
      await addNote({
        variables: {
          title,
          note,
          imageUrls: finalImageUrls,
        },
      });
    }

    onAddNote();
    setTitle("");
    setNote("");
    setNewImages([]);
    setNewImagePreviews([]);
    setExistingImages([]);
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

          <label>Choose picture(s) to upload:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple
          />

          {/* Existing Images (in edit mode) */}
          {existingImages.length > 0 && (
            <div className="image-preview">
              <h4>Current Images:</h4>
              {existingImages.map((url, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img src={url} alt={`Existing ${index}`} style={{ maxWidth: "100%" }} />
                  <button type="button" onClick={() => handleRemoveExistingImage(url)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Images */}
          {newImagePreviews.length > 0 && (
            <div className="image-preview">
              <h4>New Uploads:</h4>
              {newImagePreviews.map((url, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img src={url} alt={`Preview ${index}`} style={{ maxWidth: "100%" }} />
                  <button type="button" onClick={() => handleRemoveNewImage(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <input type="submit" value={noteToEdit ? "Save Changes" : "Post Story"} />

          {noteToEdit && (
            <>
              <button type="button" onClick={handleDelete} style={{ marginTop: "10px" }}>
                Delete Note
              </button>
              <button
                type="button"
                onClick={onFinishEdit}
                style={{ marginTop: "10px", marginLeft: "10px" }}
              >
                Cancel
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
