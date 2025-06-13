import React, { createContext, useContext, useState } from 'react';
import './MessageModal.css';

const MessageContext = createContext();
export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null); // { type, text }

  const showMessage = (type, text) => {
    setMessage({ type, text });
  };

  const hideMessage = () => {
    if (message?.type !== 'loading') {
      setMessage(null);
    }
  };

  return (
    <MessageContext.Provider value={{ message, showMessage, hideMessage }}>
      {children}
      {message && (
        <div className={`message-overlay`} onClick={message.type !== 'loading' ? hideMessage : null}>
            <div className="message-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={hideMessage}>&times;</button>
            {message.text}
            {message.type === 'loading' && <span className="spinner" />}
            </div>
        </div>
)}

    </MessageContext.Provider>
  );
};
