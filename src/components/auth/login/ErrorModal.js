const ErrorModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
                <h2 className="text-red-600 text-lg font-semibold">Error</h2>
                <p className="mt-2">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
