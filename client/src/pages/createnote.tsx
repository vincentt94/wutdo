import { useState, ChangeEvent, FormEvent } from "react";
import { useMutation } from "@apollo/client";

import { ADD_NOTE, UPLOAD_IMAGE } from "../utils/mutations.js";


interface CreateNoteProps {
    onAddNote: () => void; // No parameters needed, just triggers refetch
}

export default function CreateNote({ onAddNote }: CreateNoteProps) {
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [image, setImage] = useState<File | undefined | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(""); //  Track selected predefined image

    const [uploadImage] = useMutation(UPLOAD_IMAGE);

    const [addNote, { loading, error }] = useMutation(ADD_NOTE, {
        onCompleted: () => {
            onAddNote();
            setTitle("");
            setNote("");
            setImage(null);
            setImagePreview(null);
            setSelectedImage("");
        },
        onError: (err) => {
            console.error("Error adding note:", err);
            alert("Failed to submit note.");
        },
    });

    //stock images in an array
    /* Can update / remove these as no images are added in yet/ might not be needed
    const imageOptions = [
        { label: "City", value: "/assets/cityvibes.webp", },
        { label: "Forest", value: "/assets/forestvibes.avif" },
        { label: "Island", value: "/assets/Islandvibes.webp" },
        { label: "Lake", value: "/assets/lakevibes.jpg" },
        { label: "Mountain", value: "/assets/mountainvibes.jpg" },
        { label: "River", value: "/assets/rivervibes.jpg" },
        { label: "Suburbs", value: "/assets/surburbanvibes.jpg" },
    ]; */
 
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImage(file)
        const urlPreview = file ? URL.createObjectURL(file) : null;
        setImagePreview(urlPreview);
        setSelectedImage(""); //clears selected stock image 

    }

    const handleRemoveImage = () => {
        setImage(null)
        setImagePreview(null)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let imageUrl = "";
        if (image) {
            try {
                console.log(image);
                const response = await uploadImage(
                    { 
                        variables: { file: image }, 
                        context: { headers: { "Apollo-Require-Preflight": "true" } } 
                    },
                );
                imageUrl = response.data.uploadImage;
            } catch (error) {
                console.error("Image upload failed:", error);
                alert("Failed to upload image.");
                return;
            }
        }
        else {
            imageUrl = selectedImage || "";
        }
        // create post and send to database
        addNote({
            variables: {
                title,
                note,
                imageUrl: imageUrl
            },
        });
    }

    return (
        <div className="create-story-container">
            <div className="create-story-box">
                <h1>Create Note</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Topic Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Write Your Notes Here..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            required
                        />
                    </div>
                    {/*Here we can select an image from a list*/}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}>

                        <label>Select an Image:</label>
                        <select value={selectedImage} onChange={(e) => setSelectedImage(e.target.value)}>
                            <option value="">-- Choose an image --</option>
                            {imageOptions.map((image, index) => (
                                <option key={index} value={image.value}>
                                    {image.label}
                                </option>
                            ))}
                        </select>
                        {/*This allows the user to preview the image*/}
                        {selectedImage && <img src={selectedImage} alt="Selected" width="300px" />}

                        {/*Here is where we can allow the user to upload an image of their choice*/}
                        <div>
                            <label>Choose a picture to upload:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                multiple={false}
                            />
                        </div>
                    </div>
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button onClick={handleRemoveImage}>Remove Image</button>
                        </div>
                    )}
                    <input type="submit" value="Post Story" />
                    {loading && <p>Submitting note...</p>}
                    {error && <p>Issue submitting note.</p>}
                </form>
            </div>
        </div>
    );

}