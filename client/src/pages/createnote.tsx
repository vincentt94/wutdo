import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import {
  ADD_NOTE,
  UPLOAD_IMAGE,
  UPDATE_NOTE,
  DELETE_NOTE,
} from "../utils/mutations";
import { GET_NOTE_BY_ID } from "../utils/queries";

export default function CreateNote() {
  const { id: noteId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(noteId);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [addNote] = useMutation(ADD_NOTE);
  const [updateNote] = useMutation(UPDATE_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);

  const { data, loading } = useQuery(GET_NOTE_BY_ID, {
    variables: { id: noteId },
    skip: !isEditMode,
  });

  useEffect(() => {
    if (data?.getNoteById) {
      const { title, note, imageUrls } = data.getNoteById;
      setTitle(title);
      setNote(note);
      setExistingImageUrls(imageUrls || []);
      setImagePreviews(imageUrls || []);
    }
  }, [data]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index: number) => {
    const urlToRemove = imagePreviews[index];

    if (existingImageUrls.includes(urlToRemove)) {
      setExistingImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
    } else {
      const adjustedIndex = index - existingImageUrls.length;
      setNewImages((prev) => prev.filter((_, i) => i !== adjustedIndex));
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    if (noteId && confirm("Are you sure you want to delete this note?")) {
      await deleteNote({ variables: { id: noteId } });
      navigate("/mynotes");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let uploadedImageUrls: string[] = [];

    if (newImages.length > 0) {
      for (const file of newImages) {
        const response = await uploadImage({
          variables: { file },
          context: { headers: { "Apollo-Require-Preflight": "true" } },
        });
        uploadedImageUrls.push(response.data.uploadImage);
      }
    }

    const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls];

    if (isEditMode) {
      await updateNote({
        variables: {
          _id: noteId,
          title,
          note,
          imageUrls: finalImageUrls,
        },
      });
      navigate("/mynotes");
    } else {
      await addNote({
        variables: { title, note, imageUrls: finalImageUrls },
        refetchQueries: ["GetUserNotes"],
      });
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/mynotes");
      }, 2000);
    }

    setTitle("");
    setNote("");
    setNewImages([]);
    setExistingImageUrls([]);
    setImagePreviews([]);
  };

  if (loading) return <p>Loading note...</p>;

  return (
    <div className="create-story-container">
      <div className="create-story-box">
        <h1>{isEditMode ? "Edit Note" : "Create Note"}</h1>
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

          {imagePreviews.length > 0 && (
            <div className="image-preview">
              {imagePreviews.map((url, index) => (
                <div
                  key={index}
                  style={{ position: "relative", marginBottom: "10px" }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    style={{ maxWidth: "100%", borderRadius: "5px" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      marginTop: "5px",
                      background: "#AF7A38",
                      border: "none",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="submit"
            value={isEditMode ? "Save Changes" : "Post Story"}
          />

          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              style={{ marginTop: "10px" }}
            >
              Delete Note
            </button>
          )}
        </form>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{
              padding: "30px 40px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              textAlign: "center",
              zIndex: 1002,
            }}
          >
            <h2 style={{ color: "#AF7A38" }}>Note created successfully!</h2>
          </div>
        </div>
      )}
    </div>
  );
}
