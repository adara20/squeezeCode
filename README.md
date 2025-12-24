# SqueezeCode: Privacy-First Video Compressor

SqueezeCode is a web-based video compressor that runs entirely in your browser. It allows you to efficiently reduce video file sizes for platforms like Discord and email, ensuring your private data never leaves your device. Powered by WebAssembly and FFmpeg.wasm, it offers fast, local, and private video compression.

## Features

*   **Privacy-First:** All video processing happens directly in your browser. Your files are never uploaded to a server.
*   **Target Size Compression:** Precisely compress videos to meet specific file size limits (e.g., 8MB, 25MB) while maintaining optimal quality.
*   **Fast & Efficient:** Leverages WebAssembly (WASM) for near-native performance right in your browser.
*   **User-Friendly:** Simple drag-and-drop interface.

## Technologies Used

*   **Frontend:** React with TypeScript
*   **Build Tool:** Vite
*   **Video Processing:** FFmpeg.wasm (WebAssembly)

## Run Locally

**Prerequisites:** Node.js (which includes npm)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/adara20/squeezeCode.git
    cd squeezeCode
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

## Important Note

Due to the nature of FFmpeg.wasm and browser security policies, the development server requires specific Cross-Origin Isolation headers. These are automatically configured in `vite.config.ts`. If you encounter issues (e.g., compression stuck at 0%), ensure these headers are correctly applied and try clearing your browser's cache.

---