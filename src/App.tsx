import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { MemeEditor } from "./Editor";

function App() {
  const [uploaded, setUploaded] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <header className="p-6 flex items-center justify-between glass-panel rounded-b-3xl mx-4 mt-4 z-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🎭</span>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Comrade Meme Maker
          </h1>
        </div>
        <div className="flex gap-4">
          <a
            href="https://github.com/Toyin5/comrade"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-5xl z-0">
          {uploaded ? (
            <MemeEditor
              imageUrl={uploaded}
              onBack={() => setUploaded(null)}
            />
          ) : (
            <ImageUploader onUpload={setUploaded} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
