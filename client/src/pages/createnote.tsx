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
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [addNote] = useMutation(ADD_NOTE);
  const [updateNote] = useMutation(UPDATE_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setNote(noteToEdit.note);
      setImagePreviews(noteToEdit.imageUrls || []);
      setImages(noteToEdit.imageUrls?.map(() => null) || [null]);
    }
  }, [noteToEdit]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updatedImages = [...images];
    updatedImages[index] = file;

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index] = URL.createObjectURL(file);

    // Add a new empty field only if it's the last one
    if (index === images.length - 1) {
      updatedImages.push(null);
    }

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
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

    const validImages = images.filter((img): img is File => img !== null);
    let uploadedImageUrls: string[] = [];

    if (validImages.length > 0) {
      for (const file of validImages) {
        const response = await uploadImage({
          variables: { file },
          context: { headers: { "Apollo-Require-Preflight": "true" } },
        });
        uploadedImageUrls.push(response.data.uploadImage);
      }
    } else {
      uploadedImageUrls = noteToEdit?.imageUrls || [];
    }

    if (noteToEdit) {
      await updateNote({
        variables: {
          _id: noteToEdit._id,
          title,
          note,
          imageUrls: uploadedImageUrls,
        },
      });
      onFinishEdit?.();
    } else {
      await addNote({
        variables: { title, note, imageUrls: uploadedImageUrls },
      });
    }

    onAddNote();
    setTitle("");
    setNote("");
    setImages([null]);
    setImagePreviews([]);
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

          {images.map((file, index) => (
            <div key={index} className="image-preview" style={{ marginBottom: "10px" }}>
              {imagePreviews[index] && (
                <>
                  <img src={imagePreviews[index]} alt={`Preview ${index}`} style={{ maxWidth: "100%" }} />
                  <button type="button" onClick={() => handleRemoveImage(index)}>
                    Remove
                  </button>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
              />
            </div>
          ))}

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
