import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMic, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { Player } from '@lottiefiles/react-lottie-player';
import axiosInstance from '../../services/api/axiosConfig';
import { useAuth } from '../../hooks/useAuth';
import ChatBotAvatar from './ChatBotAvatar';
import './ChatBot.css';

// Import chatbot animation
import chatbotAnimation from './animations/chatbot-animation.json';

const ChatBot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceCapabilities, setVoiceCapabilities] = useState({
    hasSpeechRecognition: false,
    hasSpeechSynthesis: false,
    isMobile: false
  });
  const [showVoiceHint, setShowVoiceHint] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  // Initialize session ID on component mount
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    }
  }, [sessionId]);
  
  // Initialize speech synthesis and load voices
  useEffect(() => {
    // Load voices when the component mounts
    const loadVoices = () => {
      // Get the list of voices
      speechSynthesisRef.current.getVoices();
    };
    
    // Chrome and some browsers need to wait for the voiceschanged event
    if (speechSynthesisRef.current) {
      loadVoices();
      speechSynthesisRef.current.onvoiceschanged = loadVoices;
    }
    
    // Detect device capabilities for voice features
    const detectVoiceCapabilities = () => {
      // Check if device has microphone and speech synthesis support
      const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const hasSpeechSynthesis = 'speechSynthesis' in window;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Mobile devices with speech capabilities might prefer voice mode by default
      if (isMobile && hasSpeechRecognition && hasSpeechSynthesis) {
        console.log('Mobile device with voice capabilities detected');
        // Show a hint to the user after a short delay
        setTimeout(() => {
          setShowVoiceHint(true);
          // Auto-hide the hint after 8 seconds
          setTimeout(() => {
            setShowVoiceHint(false);
          }, 8000);
        }, 2000);
      }
      
      // Store detection results for later use
      setVoiceCapabilities({
        hasSpeechRecognition,
        hasSpeechSynthesis,
        isMobile
      });
    };
    
    detectVoiceCapabilities();
    
    // Cleanup function
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel(); // Cancel any ongoing speech when unmounting
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // Add welcome message if no messages
      if (messages.length === 0) {
        setMessages([
          {
            id: 'welcome',
            text: `Hello${user ? ` ${user.name}` : ''}! How can I assist you with your luxury shopping experience today?`,
            isUser: false,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    }
  }, [isOpen, user, messages.length]);
  
  // Voice recognition setup
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        console.log('Voice recognized:', transcript);
        
        // Short delay to allow state update before submitting
        setTimeout(() => {
          // Create a synthetic form submission event
          const syntheticEvent = { preventDefault: () => {} };
          handleSubmit(syntheticEvent, true);
        }, 500);
      };
      
      recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };
      
      recognition.start();
    } else {
      console.error('Speech recognition not supported in this browser');
      alert('Speech recognition is not supported in your browser. Please try using Chrome or Edge.');
    }
  };

  // Function to speak text using the Web Speech API
  const speakText = (text) => {
    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set properties
    utterance.rate = 1.0; // Normal speaking rate
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Get available voices and select a good one if available
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || // Prefer female voices
      voice.name.includes('Google') || // Or Google voices
      voice.name.includes('Microsoft') // Or Microsoft voices
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log('Speech started');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      console.log('Speech ended');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsSpeaking(false);
    };
    
    // Speak the text
    speechSynthesisRef.current.speak(utterance);
  };
  
  // Toggle voice mode
  const toggleVoiceMode = () => {
    setVoiceEnabled(!voiceEnabled);
    
    // Announce the change
    if (!voiceEnabled) {
      // Voice mode is being turned on
      setTimeout(() => {
        speakText('Voice mode is now enabled. I will read my responses aloud.');
      }, 100);
    } else {
      // Just cancel any ongoing speech when turning off
      speechSynthesisRef.current.cancel();
    }
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Cancel any ongoing speech when closing the chat
    if (isOpen && isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e, isVoiceInput = false) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const response = await axiosInstance.post('/ai/chat', {
        message: inputValue,
        chatHistory: messages.slice(-6), // Send last 6 messages for context
        userId: user?.id,
        userRole: user?.role || 'guest',
        sessionId: sessionId, // Include session ID for tracking conversations
        isVoiceInput: isVoiceInput // Flag if this was a voice input
      });
      
      // Update session ID if provided in response
      if (response.data.data.sessionId) {
        setSessionId(response.data.data.sessionId);
      }
      
      const botMessage = {
        id: `bot-${Date.now()}`,
        text: response.data.data.message,
        isUser: false,
        timestamp: new Date().toISOString(),
        additionalData: response.data.data.additionalData
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // If voice is enabled or this was a voice input, speak the response
      if (voiceEnabled || isVoiceInput) {
        speakText(response.data.data.message);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: 'I apologize, but I\'m having trouble connecting to my knowledge base right now. Please try again in a moment.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = async (messageId, isPositive) => {
    if (feedbackGiven[messageId]) return;
    
    setFeedbackGiven(prev => ({
      ...prev,
      [messageId]: isPositive ? 'positive' : 'negative'
    }));
    
    // Find the message and its corresponding user message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex > 0) {
      const botMessage = messages[messageIndex];
      const userMessage = messages[messageIndex - 1];
      
      // Log feedback for training
      try {
        await axiosInstance.post('/ai/log', {
          userId: user?.id,
          message: userMessage.text,
          response: botMessage.text,
          feedback: isPositive ? 'positive' : 'negative'
        });
      } catch (error) {
        console.error('Error logging feedback:', error);
      }
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="chat-toggle-btn"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <FiX className="chat-icon" />
        ) : (
          <div className="chat-icon-container">
            <FiMessageSquare className="chat-icon" />
            <span className="chat-badge">AI</span>
          </div>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-container"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="chat-header">
              <div className="chat-title">
                <div className="avatar-container">
                  <ChatBotAvatar isSpeaking={isSpeaking} size={40} />
                </div>
                <h3>Luxury Shopping Assistant</h3>
              </div>
              <div className="chat-controls">
                <button
                  className={`voice-toggle-btn ${voiceEnabled ? 'active' : ''}` }
                  onClick={toggleVoiceMode}
                  aria-label={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
                  title={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
                >
                  {voiceEnabled ? <FiMic /> : <FiMic style={{ opacity: 0.5 }} />}
                </button>
                <button
                  className="close-btn"
                  onClick={toggleChat}
                  aria-label="Close chat"
                >
                  <FiX />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {/* Voice hint tooltip */}
              {showVoiceHint && (
                <div className="voice-hint">
                  <div className="voice-hint-content">
                    <FiMic className="voice-hint-icon" />
                    <p>Try using voice commands! Tap the microphone icon to speak to me.</p>
                    <button 
                      className="voice-hint-close"
                      onClick={() => setShowVoiceHint(false)}
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.isUser ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                    
                    {/* Display additional data if available */}
                    {!message.isUser && message.additionalData && (
                      <div className="additional-data">
                        {message.additionalData.products && message.additionalData.products.length > 0 && (
                          <div className="product-suggestions">
                            <h4>Product Suggestions:</h4>
                            <div className="product-cards">
                              {message.additionalData.products.slice(0, 3).map((product) => (
                                <a 
                                  key={product._id} 
                                  href={`/product/${product.slug || product._id}`}
                                  className="product-card"
                                >
                                  <img 
                                    src={product.images && product.images[0] ? product.images[0].url : '/assets/images/product-placeholder.jpg'} 
                                    alt={product.name} 
                                  />
                                  <div className="product-info">
                                    <h5>{product.name}</h5>
                                    <p className="product-price">${product.price.toFixed(2)}</p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Feedback buttons for bot messages */}
                  {!message.isUser && !message.isError && (
                    <div className="message-feedback">
                      <button 
                        className={`feedback-btn ${feedbackGiven[message.id] === 'positive' ? 'active' : ''}`}
                        onClick={() => handleFeedback(message.id, true)}
                        aria-label="Thumbs up"
                        disabled={!!feedbackGiven[message.id]}
                      >
                        <FiThumbsUp />
                      </button>
                      <button 
                        className={`feedback-btn ${feedbackGiven[message.id] === 'negative' ? 'active' : ''}`}
                        onClick={() => handleFeedback(message.id, false)}
                        aria-label="Thumbs down"
                        disabled={!!feedbackGiven[message.id]}
                      >
                        <FiThumbsDown />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div 
                  className="typing-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </motion.div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your message..."
                ref={inputRef}
              />
              <button 
                type="button" 
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                disabled={isListening}
                aria-label="Voice input"
              >
                <FiMic />
                {isListening && <span className="pulse-animation"></span>}
              </button>
              <button 
                type="submit" 
                className="send-btn"
                disabled={!inputValue.trim()}
                aria-label="Send message"
              >
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
