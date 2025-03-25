

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({
    message,
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    return (
        <div
            className="modal-overlay"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1001,
            }}
        >
            <div
                className="modal-content"
                style={{
                    backgroundColor: "rgba(253, 248, 244, 0.92)",
                    padding: "30px 25px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    textAlign: "center",
                    maxWidth: "360px",
                    width: "90%",
                }}
            >
                <p
                    style={{
                        marginBottom: "24px",
                        fontSize: "18px",
                        fontWeight: 500,
                        fontFamily: "'Segoe UI', 'Open Sans', sans-serif",
                        color: "#3d2e1e",
                    }}
                >
                    {message}
                </p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "12px",
                    }}
                >
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#AF7A38",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: "15px",
                            fontFamily: "'Segoe UI', 'Open Sans', sans-serif",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#d1cfc9",
                            color: "#3d2e1e",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: "15px",
                            fontFamily: "'Segoe UI', 'Open Sans', sans-serif",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
