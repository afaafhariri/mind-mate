export const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <img src="/meditation-round-svgrepo-com.svg" alt="Mind Mate Logo" className="w-24 h-24 animate-pulse" />
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    )
};