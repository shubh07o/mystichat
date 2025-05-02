# MystiChat - Random Chat Application

MystiChat is a real-time web application that allows users to chat anonymously with random strangers. The application features a modern dark theme, real-time messaging, typing indicators, and a clean user interface.

## Features

- Anonymous chat with random strangers
- Real-time messaging using Socket.io
- Modern dark theme UI
- Typing indicators
- Message timestamps
- "New Chat" and "End Chat" functionality
- Connection status indicators
- Message animations

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mystichat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (optional):
```
PORT=3000
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. Open your web browser and navigate to:
```
http://localhost:3000
```

## Usage

1. Click the "New Chat" button to start looking for a random partner
2. Once connected, you can start chatting
3. Use the "End Chat" button to end the current conversation
4. Click "New Chat" again to start a new conversation

## Development

To run the application in development mode with auto-reload:
```bash
npm run dev
```

## Technologies Used

- Node.js
- Express.js
- Socket.io
- HTML5
- CSS3
- JavaScript (ES6+)

## License

MIT License 