


// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import axios from 'axios';
// import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
// import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ');
// }

// export default function Example() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [searchInput, setSearchInput] = useState('');
//   const [results, setResults] = useState([]);
//   const [tracking, setTracking] = useState({});
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [speechSocket, setSpeechSocket] = useState(null);
//   const [llmSocket, setLlmSocket] = useState(null);
//   const [manualInput, setManualInput] = useState('');
//   const messagesEndRef = useRef(null);

//   // Function to append messages to the state
//   const appendMessage = (message, type) => {
//     setMessages((prev) => [...prev, { type, text: message }]);
//   };

//   useEffect(() => {
//     startSpeechWebSocket();
//     startLLMWebSocket();

//     return () => {
//       speechSocket?.close();
//       llmSocket?.close();
//     };
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const startSpeechWebSocket = () => {
//     const socket = new WebSocket('ws://127.0.0.1:8000/ws/recognize');
//     socket.onopen = () => appendMessage('Listening for voice commands...', 'status');
//     socket.onmessage = (event) => handleSpeechMessage(event.data);
//     socket.onclose = () => {
//       console.log('Speech WebSocket disconnected, attempting to reconnect...');
//       setTimeout(startSpeechWebSocket, 1000);
//     };
//     socket.onerror = (error) => console.error('Speech WebSocket error:', error);
//     setSpeechSocket(socket);
//   };

//   const startLLMWebSocket = () => {
//     const socket = new WebSocket('ws://127.0.0.1:8001/ws/llm_response');
//     socket.onopen = () => console.log('LLM WebSocket connected.');
//     socket.onmessage = (event) => handleLLMMessage(event.data);
//     socket.onclose = () => console.log('LLM WebSocket disconnected.');
//     socket.onerror = (error) => console.error('LLM WebSocket error:', error);
//     setLlmSocket(socket);
//   };

//   const handleSpeechMessage = (data) => {
//     console.log("Received message from WebSocket:", data); // Log the incoming message
//     setLoading(true);
  
//     if (data.startsWith("Processing input:")) {
//       appendMessage(data, 'recognized');
//     } else if (data.startsWith("track item")) {
//       // Match "track item" followed by digits and ignore any trailing non-digit characters (like periods)
//       const idMatch = data.match(/track item (\d+)[^\d]*$/);
//       if (idMatch) {
//         const id = parseInt(idMatch[1], 10);  // Parse the ID as an integer
//         console.log("Extracted ID from voice command:", id); // Log the extracted ID
  
//         if (!isNaN(id) && id > 0) {
//           console.log("Attempting to track item with ID:", id); // Log the ID
//           const itemToTrack = results.find(item => item.id === id);  // Ensure item.id matches the extracted ID
//           console.log("Available results:", results); // Log available results to verify the IDs
  
//           if (itemToTrack) {
//             handleTrackItem(itemToTrack);
//           } else {
//             appendMessage("Item not found in results.", 'error');
//           }
//         } else {
//           appendMessage("Invalid item ID for tracking.", 'error');
//         }
//       } else {
//         appendMessage("Failed to parse ID from track item command.", 'error');
//       }
//     } else {
//       const parsedResponse = parseResponse(data);
//       if (parsedResponse?.products) {
//         setResults(parsedResponse.products);
//       }
//       appendMessage(JSON.stringify(parsedResponse, null, 2), 'products_data');
//     }
//   };
  
  
//   const handleLLMMessage = (data) => {
//     setLoading(false);
//     try {
//       const parsedResponse = JSON.parse(data);
//       if (parsedResponse?.products && Array.isArray(parsedResponse.products)) {
//         setResults(parsedResponse.products);
//       } else {
//         setResults([]);
//       }
//       appendMessage(JSON.stringify(parsedResponse, null, 2), 'response_to_send');
//     } catch (error) {
//       console.error("Error parsing WebSocket response:", error);
//       appendMessage("Invalid response format", 'error');
//     }
//   };

//   const handleManualSubmit = (e) => {
//     e.preventDefault();
//     if (manualInput.trim()) {
//       const inputMessage = `You: ${manualInput}`;
//       appendMessage(inputMessage, 'user_input');
//       handleSpeechMessage(manualInput);
//       setManualInput('');
//     }
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jumia/search`, { query: searchInput });
//       setResults(response.data.products);
//     } catch (error) {
//       const message = error.response?.data?.detail || error.message;
//       setError(`Error fetching search results: ${message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTrackItem = async (item) => {
//     console.log("Attempting to track item:", item); // Log the item being tracked
//     setTracking((prev) => ({ ...prev, [item.id]: true }));
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jumia/add_tracked_url`, { url: item.url });
//       alert(`Tracking ${item.name}`); // Provide feedback
//       window.open(`/track/${response.data.id}`, '_blank');
//     } catch (error) {
//       const message = error.response?.data?.detail || error.message;
//       alert(`Failed to track item: ${message}`);
//     } finally {
//       setTracking((prev) => ({ ...prev, [item.id]: false }));
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const parseResponse = (responseData) => {
//     try {
//       return JSON.parse(responseData);
//     } catch {
//       return responseData;
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen flex flex-col p-6 bg-gray-50">
//         <header className="flex justify-between items-center py-4 mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Scraped Data</h1>
//           <form onSubmit={handleSearch} className="flex items-center space-x-2">
//             <input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search..."
//               className="border border-gray-300 rounded-lg px-3 py-2"
//             />
//             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
//           </form>
//         </header>

//         <div className="flex flex-1 space-x-6">
//           <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
//             <h2 className="text-lg font-semibold mb-4">Search Results</h2>
//             {loading && <p>Loading...</p>}
//             <ul className="space-y-4">
//               {results.length ? (
//                 results.map((item) => (
//                   <li key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
//                     <Image src={item.image_url} alt={item.name} width={100} height={100} className="rounded-md" />
//                     <div>
//                       <h3 className="text-xl font-bold">{item.name}</h3>
//                       <p className="text-gray-600">Price: {item.price}</p>
//                       <p className="text-gray-500">Rating: {item.rating}</p>
//                       <p className="text-gray-500">ID: {item.id}</p> {/* Display the ID here */}
//                       <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                         View on Jumia
//                       </a>
//                       <button
//                         onClick={() => handleTrackItem(item)}
//                         disabled={tracking[item.id]}  // Use item.id for tracking state
//                         className={`mt-2 px-4 py-2 bg-green-500 text-white rounded-lg ${tracking[item.id] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
//                       >
//                         {tracking[item.id] ? 'Tracking...' : 'Track Item'}
//                       </button>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <p>No results found.</p>
//               )}
//             </ul>
//           </div>
          
//           <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
//             <h2 className="text-lg font-semibold mb-4">Chat Log</h2>
//             <div className="h-64 overflow-y-auto border p-4 mb-4">
//               {messages.map((msg, index) => (
//                 <p key={index} className={classNames('mb-2', msg.type === 'user_input' ? 'text-blue-600' : 'text-gray-700')}>
//                   {msg.text}
//                 </p>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             <form onSubmit={handleManualSubmit} className="flex space-x-2">
//               <input
//                 type="text"
//                 value={manualInput}
//                 onChange={(e) => setManualInput(e.target.value)}
//                 placeholder="Type command..."
//                 className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
//               />
//               <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Send</button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
// import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ');
// }

// export default function Example() {
//   const router = useRouter(); 
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [searchInput, setSearchInput] = useState('');
//   const [results, setResults] = useState([]);
//   const [tracking, setTracking] = useState({});
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [speechSocket, setSpeechSocket] = useState(null);
//   const [llmSocket, setLlmSocket] = useState(null);
//   const [manualInput, setManualInput] = useState('');
//   const messagesEndRef = useRef(null);

//   // Function to append messages to the state
//   const appendMessage = (message, type) => {
//     setMessages((prev) => [...prev, { type, text: message }]);
//   };

//   useEffect(() => {
//     startSpeechWebSocket();
//     startLLMWebSocket();
    
//     // Load products from sessionStorage on component mount
//     const storedResults = JSON.parse(sessionStorage.getItem('trackedResults'));
//     if (storedResults) {
//       setResults(storedResults);
//     }

//     return () => {
//       speechSocket?.close();
//       llmSocket?.close();
//     };
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const startSpeechWebSocket = () => {
//     const socket = new WebSocket('ws://127.0.0.1:8000/ws/recognize');
//     socket.onopen = () => appendMessage('Listening for voice commands...', 'status');
//     socket.onmessage = (event) => handleSpeechMessage(event.data);
//     socket.onclose = () => {
//       console.log('Speech WebSocket disconnected, attempting to reconnect...');
//       setTimeout(startSpeechWebSocket, 1000);
//     };
//     socket.onerror = (error) => console.error('Speech WebSocket error:', error);
//     setSpeechSocket(socket);
//   };

//   const startLLMWebSocket = () => {
//     const socket = new WebSocket('ws://127.0.0.1:8001/ws/llm_response');
//     socket.onopen = () => console.log('LLM WebSocket connected.');
//     socket.onmessage = (event) => handleLLMMessage(event.data);
//     socket.onclose = () => console.log('LLM WebSocket disconnected.');
//     socket.onerror = (error) => console.error('LLM WebSocket error:', error);
//     setLlmSocket(socket);
//   };

//   const handleSpeechMessage = (data) => {
//     console.log("Received message from WebSocket:", data); // Log the incoming message
//     setLoading(true);
  
//     if (data.startsWith("Processing input:")) {
//         appendMessage(data, 'recognized');
//     } else if (data.startsWith("track item")) {
//         const idMatch = data.match(/track item (\d+)[^\d]*$/);
//         if (idMatch) {
//             const id = parseInt(idMatch[1], 10);  // Parse the ID as an integer
//             console.log("Extracted ID from voice command:", id); // Log the extracted ID
  
//             if (!isNaN(id) && id > 0) {
//                 console.log("Attempting to track item with ID:", id); // Log the ID
                
//                 // Check if the item exists in the results
//                 const itemToTrack = results.find(item => item.id === id) || 
//                                      JSON.parse(sessionStorage.getItem('trackedResults'))?.find(item => item.id === id);
                
//                 console.log("Available results:", results); // Log available results

//                 // Check if the item is found and is not already being tracked
//                 if (itemToTrack) {
//                     if (!tracking[itemToTrack.id]) {
//                         appendMessage(`Tracking ${itemToTrack.name}...`, 'status');
//                         handleTrackItem(itemToTrack); // Only track if it's not already being tracked
//                     } else {
//                         appendMessage(`${itemToTrack.name} is already being tracked.`, 'status');
//                     }
//                 } else {
//                     appendMessage("Item not found in results.", 'error');
//                 }
//             } else {
//                 appendMessage("Invalid item ID for tracking.", 'error');
//             }
//         } else {
//             appendMessage("Failed to parse ID from track item command.", 'error');
//         }
//     } else {
//         const parsedResponse = parseResponse(data);
//         if (parsedResponse?.products) {
//             setResults(parsedResponse.products);
//             sessionStorage.setItem('trackedResults', JSON.stringify(parsedResponse.products));
//         }
//         appendMessage(JSON.stringify(parsedResponse, null, 2), 'products_data');
//     }
// };


  
//   const handleLLMMessage = (data) => {
//     setLoading(false);
//     try {
//       const parsedResponse = JSON.parse(data);
//       if (parsedResponse?.products && Array.isArray(parsedResponse.products)) {
//         setResults(parsedResponse.products);
//         // Store results in sessionStorage
//         sessionStorage.setItem('trackedResults', JSON.stringify(parsedResponse.products));
//       } else {
//         setResults([]);
//       }
//       appendMessage(JSON.stringify(parsedResponse, null, 2), 'response_to_send');
//     } catch (error) {
//       console.error("Error parsing WebSocket response:", error);
//       appendMessage("Invalid response format", 'error');
//     }
//   };

//   const handleManualSubmit = (e) => {
//     e.preventDefault();
//     if (manualInput.trim()) {
//       const inputMessage = `You: ${manualInput}`;
//       appendMessage(inputMessage, 'user_input');
//       handleSpeechMessage(manualInput);
//       setManualInput('');
//     }
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jumia/search`, { query: searchInput });
//       setResults(response.data.products);
//       // Store results in sessionStorage
//       sessionStorage.setItem('trackedResults', JSON.stringify(response.data.products));
//     } catch (error) {
//       const message = error.response?.data?.detail || error.message;
//       setError(`Error fetching search results: ${message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTrackItem = async (item) => {
//         if (tracking[item.id]) {
//             // Already being tracked
//             appendMessage(`Item is already being tracked`, 'status');
//             return;
//         }

//         setTracking(prev => ({ ...prev, [item.id]: true }));

//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jumia/add_tracked_url`, { url: item.url });
//             console.log("Tracking response:", response);

//             // Navigate to the tracked item page
//             router.push(`/track/${response.data.id}`);  // Adjust the URL if needed
//             appendMessage(`Successfully tracking ${item.name}`, 'status');
//         } catch (error) {
//             appendMessage(`Failed to track item: ${error.message}`, 'error');
//         } finally {
//             setTracking(prev => ({ ...prev, [item.id]: false }));
//         }
//     };

  

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const parseResponse = (responseData) => {
//     try {
//       return JSON.parse(responseData);
//     } catch {
//       return responseData;
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen flex flex-col p-6 bg-gray-50">
//         <header className="flex justify-between items-center py-4 mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Scraped Data</h1>
//           <form onSubmit={handleSearch} className="flex items-center space-x-2">
//             <input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search..."
//               className="border border-gray-300 rounded-lg px-3 py-2"
//             />
//             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
//           </form>
//         </header>

//         <div className="flex flex-1 space-x-6">
//           <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
//             <h2 className="text-lg font-semibold mb-4">Search Results</h2>
//             {loading && <p>Loading...</p>}
//             <ul className="space-y-4">
//               {results.length ? (
//                 results.map((item) => (
//                   <li key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
//                     <Image src={item.image_url} alt={item.name} width={100} height={100} className="rounded" />
//                     <div className="flex-1">
//                     <h3 className="font-medium">{item.id}</h3>
//                       <h3 className="font-medium"> {item.name}</h3>
//                       <h3 className="font-medium">Rating: {item.rating}</h3>
//                       <h3 className="font-medium">In stock: {item.in_stock}</h3>
//                       <p>{item.price}</p>
//                       <button
//                         onClick={() => handleTrackItem(item)}
//                         disabled={tracking[item.id]}  // Use item.id for tracking state
//                         className={`mt-2 px-4 py-2 bg-green-500 text-white rounded-lg ${tracking[item.id] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
//                       >
//                         {tracking[item.id] ? 'Tracking...' : 'Track Item'}
//                       </button>

//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <p>No results found</p>
//               )}
//             </ul>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h2 className="text-lg font-semibold mb-4">Chat Messages</h2>
//           <div className="bg-white p-4 rounded-lg shadow-md h-64 overflow-y-auto">
//             {messages.map((msg, index) => (
//               <p key={index} className={classNames(msg.type === 'user_input' ? 'text-blue-600' : 'text-gray-800')}>{msg.text}</p>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>

//         <form onSubmit={handleManualSubmit} className="mt-4 flex space-x-2">
//           <input
//             type="text"
//             value={manualInput}
//             onChange={(e) => setManualInput(e.target.value)}
//             placeholder="Type a message..."
//             className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
//           />
//           <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Send</button>
//         </form>
//       </div>
//     </>
//   );
// }




'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const router = useRouter(); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [tracking, setTracking] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [speechSocket, setSpeechSocket] = useState(null);
  const [llmSocket, setLlmSocket] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const messagesEndRef = useRef(null);

  // Function to append messages to the state
  const appendMessage = (message, type) => {
    setMessages((prev) => [...prev, { type, text: message }]);
  };

  useEffect(() => {
    startSpeechWebSocket();
    startLLMWebSocket();
    
    // Load products from sessionStorage on component mount
    const storedResults = JSON.parse(sessionStorage.getItem('trackedResults'));
    if (storedResults) {
      setResults(storedResults);
    }

    return () => {
      speechSocket?.close();
      llmSocket?.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startSpeechWebSocket = () => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/recognize');
    socket.onopen = () => appendMessage('Listening for voice commands...', 'status');
    socket.onmessage = (event) => handleSpeechMessage(event.data);
    socket.onclose = () => {
      console.log('Speech WebSocket disconnected, attempting to reconnect...');
      setTimeout(startSpeechWebSocket, 1000);
    };
    socket.onerror = (error) => console.error('Speech WebSocket error:', error);
    setSpeechSocket(socket);
  };

  const startLLMWebSocket = () => {
    const socket = new WebSocket('ws://127.0.0.1:8001/ws/llm_response');
    socket.onopen = () => console.log('LLM WebSocket connected.');
    socket.onmessage = (event) => handleLLMMessage(event.data);
    socket.onclose = () => console.log('LLM WebSocket disconnected.');
    socket.onerror = (error) => console.error('LLM WebSocket error:', error);
    setLlmSocket(socket);
  };

  const handleSpeechMessage = (data) => {
    console.log("Received message from WebSocket:", data); // Log the incoming message
    setLoading(true);
  
    if (data.startsWith("Processing input:")) {
        appendMessage(data, 'recognized');
    } else if (data.startsWith("track item")) {
        const idMatch = data.match(/track item (\d+)[^\d]*$/);
        if (idMatch) {
            const id = parseInt(idMatch[1], 10);  // Parse the ID as an integer
            console.log("Extracted ID from voice command:", id); // Log the extracted ID
  
            if (!isNaN(id) && id > 0) {
                console.log("Attempting to track item with ID:", id); // Log the ID
                
                // Check if the item exists in the results
                const itemToTrack = results.find(item => item.id === id) || 
                                     JSON.parse(sessionStorage.getItem('trackedResults'))?.find(item => item.id === id);
                
                console.log("Available results:", results); // Log available results

                // Check if the item is found and is not already being tracked
                if (itemToTrack) {
                    if (!tracking[itemToTrack.id]) {
                        appendMessage(`Tracking ${itemToTrack.name}...`, 'status');
                        handleTrackItem(itemToTrack); // Only track if it's not already being tracked
                    } else {
                        appendMessage(`${itemToTrack.name} is already being tracked.`, 'status');
                    }
                } else {
                    appendMessage("Item not found in results.", 'error');
                }
            } else {
                appendMessage("Invalid item ID for tracking.", 'error');
            }
        } else {
            appendMessage("Failed to parse ID from track item command.", 'error');
        }
    } else {
        const parsedResponse = parseResponse(data);
        if (parsedResponse?.products) {
            setResults(parsedResponse.products);
            sessionStorage.setItem('trackedResults', JSON.stringify(parsedResponse.products));
        }
        appendMessage(JSON.stringify(parsedResponse, null, 2), 'products_data');
    }
};


  
  const handleLLMMessage = (data) => {
    setLoading(false);
    try {
      const parsedResponse = JSON.parse(data);
      if (parsedResponse?.products && Array.isArray(parsedResponse.products)) {
        setResults(parsedResponse.products);
        // Store results in sessionStorage
        sessionStorage.setItem('trackedResults', JSON.stringify(parsedResponse.products));
      } else {
        setResults([]);
      }
      appendMessage(JSON.stringify(parsedResponse, null, 2), 'response_to_send');
    } catch (error) {
      console.error("Error parsing WebSocket response:", error);
      appendMessage("Invalid response format", 'error');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      const inputMessage = `You: ${manualInput}`;
      appendMessage(inputMessage, 'user_input');
      handleSpeechMessage(manualInput);
      setManualInput('');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jumia/search`, { query: searchInput });
      setResults(response.data.products);
      // Store results in sessionStorage
      sessionStorage.setItem('trackedResults', JSON.stringify(response.data.products));
    } catch (error) {
      const message = error.response?.data?.detail || error.message;
      setError(`Error fetching search results: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackItem = async (item) => {
        if (tracking[item.id]) {
            // Already being tracked
            appendMessage(`Item is already being tracked`, 'status');
            return;
        }

        setTracking(prev => ({ ...prev, [item.id]: true }));

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jumia/add_tracked_url`, { url: item.url });
            console.log("Tracking response:", response);

            // Navigate to the tracked item page
            router.push(`/track/${response.data.id}`);  // Adjust the URL if needed
            appendMessage(`Successfully tracking ${item.name}`, 'status');
        } catch (error) {
            appendMessage(`Failed to track item: ${error.message}`, 'error');
        } finally {
            setTracking(prev => ({ ...prev, [item.id]: false }));
        }
    };

  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const parseResponse = (responseData) => {
    try {
      return JSON.parse(responseData);
    } catch {
      return responseData;
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col p-6 bg-gray-50">
        {/* Header */}
        <header className="flex justify-between items-center py-4 mb-6 w-full">
          <h1 className="text-2xl font-bold text-gray-800">Scraped Data</h1>
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search..."
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
          </form>
        </header>

        {/* Content */}
        <div className="flex w-full space-x-6">
          {/* Left Side: Search Results */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>
            {loading && <p>Loading...</p>}
            <ul className="space-y-4">
              {results.length ? (
                results.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Image src={item.image_url} alt={item.name} width={100} height={100} className="rounded" />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.id}</h3>
                      <h3 className="font-medium">{item.name}</h3>
                      <h3 className="font-medium">Rating: {item.rating}</h3>
                      <h3 className="font-medium">{item.in_stock}</h3>
                      <p>{item.price}</p>
                      <button
                        onClick={() => handleTrackItem(item)}
                        disabled={tracking[item.id]}
                        className={`mt-2 px-4 py-2 bg-green-500 text-white rounded-lg ${tracking[item.id] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                      >
                        {tracking[item.id] ? 'Tracking...' : 'Track Item'}
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No results found</p>
              )}
            </ul>
          </div>

          {/* Right Side: Chat Messages */}
          <div className="w-1/3 flex flex-col space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md flex-1 h-64 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Chat Messages</h2>
              {messages.map((msg, index) => (
                <p key={index} className={classNames(msg.type === 'user_input' ? 'text-blue-600' : 'text-gray-800')}>{msg.text}</p>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}