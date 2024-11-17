// import { useState, useEffect } from 'react'
// import {
//   FaceFrownIcon,
//   FaceSmileIcon,
//   FireIcon,
//   HandThumbUpIcon,
//   HeartIcon,
// } from '@heroicons/react/20/solid'
// import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

// const moods = [
//   { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
//   { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
//   { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
//   { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
//   { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
//   { name: 'I feel nothing', value: null, icon: null, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
// ]

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

// export default function ChatBot() {
//   const [selected, setSelected] = useState(moods[5])
//   const [comment, setComment] = useState('')
//   const [generatedText, setGeneratedText] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const filename = sessionStorage.getItem('filename') || 'default.txt'; // Get the filename from sessionStorage
//     console.log('Filename:', filename);
//     setLoading(true) // Set loading to true while waiting for the response
//     setGeneratedText('') // Clear previous response

//     // Prepare the data to be sent
//     const data = {
//       query_text: comment,
//       file_name: filename
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/query_db`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       })

//       const result = await response.json()
//       if (response.ok) {
//         setGeneratedText(result.response) // Update with the response
//       } else {
//         setGeneratedText('Error: ' + result.detail) // Handle errors from the server
//       }
//     } catch (error) {
//       setGeneratedText('Error: ' + error.message) // Handle any network errors
//     } finally {
//       setLoading(false) // Set loading to false after the request is complete
//     }

//     setComment('') // Clear the input field
//   }

//   return (
//     <div className="flex flex-col space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
//       <form onSubmit={handleSubmit} className="relative">
//         <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
//           <label htmlFor="comment" className="sr-only">Ask AI for any sentiment</label>
//           <textarea
//             id="comment"
//             name="comment"
//             rows={3}
//             placeholder="Ask Anything about the product ..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//           />
//         </div>

//         <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
//           <div className="flex items-center space-x-5">
//             <div className="flex items-center">
//               <Listbox value={selected} onChange={setSelected}>
//                 <Label className="sr-only">Your mood</Label>
//                 <div className="relative">
//                   <ListboxButton className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
//                     <span className="flex items-center justify-center">
//                       {selected.value === null ? (
//                         <span>
//                           <FaceSmileIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
//                           <span className="sr-only">Add your mood</span>
//                         </span>
//                       ) : (
//                         <span>
//                           <span className={classNames(selected.bgColor, 'flex h-8 w-8 items-center justify-center rounded-full')}>
//                             {selected.icon ? (
//                               <selected.icon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-white" />
//                             ) : (
//                               <span aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
//                             )}
//                           </span>
//                           <span className="sr-only">{selected.name}</span>
//                         </span>
//                       )}
//                     </span>
//                   </ListboxButton>

//                   <ListboxOptions
//                     transition
//                     className="absolute z-10 -ml-6 mt-1 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none"
//                   >
//                     {moods.map((mood) => (
//                       <ListboxOption
//                         key={mood.value}
//                         value={mood}
//                         className="relative cursor-default select-none bg-white px-3 py-2 data-[focus]:bg-gray-100"
//                       >
//                         <div className="flex items-center">
//                           <div className={classNames(mood.bgColor, 'flex h-8 w-8 items-center justify-center rounded-full')}>
//                             {mood.icon ? (
//                               <mood.icon aria-hidden="true" className={classNames(mood.iconColor, 'h-5 w-5 flex-shrink-0')} />
//                             ) : null}
//                           </div>
//                           <span className="ml-3 block truncate font-medium">{mood.name}</span>
//                         </div>
//                       </ListboxOption>
//                     ))}
//                   </ListboxOptions>
//                 </div>
//               </Listbox>
//             </div>
//           </div>
//           <div className="flex-shrink-0">
//             <button
//               type="submit"
//               className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               Ask AI
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Display Generated Text */}
//       <div className="bg-white p-4 rounded-lg shadow-md mt-4">
//         <h2 className="text-lg font-semibold text-gray-800">Product Response:</h2>
//         {loading ? (
//             <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center mb-4">
//             <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
//               <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
//             </svg>
//             Thinking...
//           </button>        ) : (
//           <p className="mt-2 text-gray-600">{generatedText || 'Your response will appear here...'}</p>
//         )}
//       </div>
//     </div>
//   )
// }


// import { useState, useEffect, useRef } from 'react';

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ');
// }

// export default function ChatBot() {
//   const [comment, setComment] = useState('');
//   const [generatedText, setGeneratedText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [speechSocket, setSpeechSocket] = useState(null);
//   const messagesEndRef = useRef(null);

//   const appendMessage = (message, type) => {
//     console.log(`Appending message: ${message} of type: ${type}`); // Debug
//     setMessages((prev) => [...prev, { type, text: message }]);
//   };

//   useEffect(() => {
//     startSpeechWebSocket();

//     return () => {
//       if (speechSocket) {
//         speechSocket.close();  // Proper cleanup when the component is unmounted
//       }
//     };
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const startSpeechWebSocket = () => {
//     const socket = new WebSocket('ws://127.0.0.1:8000/ws/recognize');
//     socket.onopen = () => {
//       console.log("Speech WebSocket connected."); // Debug
//       appendMessage('Listening for voice commands...', 'status');
//     };

//     socket.onmessage = (event) => {
//       handleSpeechMessage(event.data);
//     };

//     socket.onclose = () => {
//       console.log("Speech WebSocket disconnected. Reconnecting..."); // Debug
//       setTimeout(startSpeechWebSocket, 1000);  // Reconnect after disconnection
//     };

//     socket.onerror = (error) => console.error('Speech WebSocket error:', error);
//     setSpeechSocket(socket);
//   };

//   const handleSpeechMessage = (data) => {
//     console.log("Received message from WebSocket:", data); // Debug
//     setLoading(true);

//     if (data.toLowerCase() === 'hello') {
//       appendMessage("Trigger word detected. Listening for question...", 'status');
//     } else {
//       setComment(data);
//       handleSubmit(data);
//     }
//   };

//   const handleSubmit = async (voiceText) => {
//     setLoading(true);
//     setGeneratedText('');
//     const filename = sessionStorage.getItem('filename') || 'default.txt';

//     const data = {
//       query_text: voiceText || comment,
//       file_name: filename,
//     };

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/query_db`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       setGeneratedText(response.ok ? result.response : 'Error: ' + result.detail);
//       appendMessage(result.response, 'ai_response');
//     } catch (error) {
//       appendMessage('Error: ' + error.message, 'error');
//     } finally {
//       setLoading(false);
//       setComment('');
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="flex flex-col space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
//       <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
//         <textarea
//           id="comment"
//           name="comment"
//           rows={3}
//           placeholder="Ask anything about the product ..."
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//         />
//         <button type="submit" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
//           Ask AI
//         </button>
//       </form>

//       <div className="bg-white p-4 rounded-lg shadow-md mt-4">
//         <h2 className="text-lg font-semibold text-gray-800">Product Response:</h2>
//         {loading ? (
//           <p className="text-blue-700">Thinking...</p>
//         ) : (
//           <p className="mt-2 text-gray-600">{generatedText || 'Your response will appear here...'}</p>
//         )}
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md mt-4">
//         <h2 className="text-lg font-semibold text-gray-800">Chat Messages:</h2>
//         <div className="overflow-y-auto h-48">
//           {messages.map((msg, index) => (
//             <p key={index} className={classNames(msg.type === 'user_input' ? 'text-blue-600' : 'text-gray-800')}>{msg.text}</p>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react'
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
} from '@heroicons/react/20/solid'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

const moods = [
  { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-red-500', bgColor: 'bg-red-100' },
  { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-pink-500', bgColor: 'bg-pink-100' },
  { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-green-500', bgColor: 'bg-green-100' },
  { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-blue-500', bgColor: 'bg-blue-100' },
  { name: 'I feel nothing', value: null, icon: null, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ChatBot() {
  const [selected, setSelected] = useState(moods[5])
  const [comment, setComment] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const filename = sessionStorage.getItem('filename') || 'default.txt'
    console.log('Filename:', filename)
    setLoading(true)
    setGeneratedText('')

    const data = {
      query_text: comment,
      file_name: filename,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/query_db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      if (response.ok) {
        setGeneratedText(result.response)
      } else {
        setGeneratedText('Error: ' + result.detail)
      }
    } catch (error) {
      setGeneratedText('Error: ' + error.message)
    } finally {
      setLoading(false)
    }

    setComment('')
  }

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      {/* Response Area */}
      <div className="flex-grow p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-700">Product Response:</h2>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-sm text-gray-800">
          {loading ? (
            <p className="text-gray-500">Thinking...</p>
          ) : (
            <p>{generatedText || 'Your response will appear here...'}</p>
          )}
        </div>
      </div>

      {/* Ask Question Area */}
      <div className="sticky bottom-0 p-4 bg-gray-50 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Listbox value={selected} onChange={setSelected}>
              <div className="relative">
                <ListboxButton className="flex items-center space-x-2 bg-gray-200 px-3 py-2 rounded-lg">
                  <span className="text-gray-700">{selected.name || 'Select Mood'}</span>
                </ListboxButton>
                <ListboxOptions className="absolute mt-1 w-48 rounded-lg bg-white shadow-lg text-gray-800">
                  {moods.map((mood) => (
                    <ListboxOption
                      key={mood.value}
                      value={mood}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2 ${active ? 'bg-gray-100' : ''}`
                      }
                    >
                      <div className="flex items-center">
                        <div className={classNames(mood.bgColor, 'flex h-6 w-6 items-center justify-center rounded-full')}>
                          {mood.icon && <mood.icon aria-hidden="true" className={classNames(mood.iconColor, 'h-5 w-5')} />}
                        </div>
                        <span className="ml-3 block truncate">{mood.name}</span>
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>

            <div className="flex-grow">
              <label htmlFor="comment" className="sr-only">Ask AI for any sentiment</label>
              <textarea
                id="comment"
                name="comment"
                rows={2}
                placeholder="Ask anything about the product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 outline-none resize-none p-2 rounded-lg shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-indigo-500 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-400"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                <span>Ask AI</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


// what is the general sentiment
//what is the product features
//are there any issues with the product based on customer comments