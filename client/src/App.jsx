import { useState, useRef, useEffect } from 'react';
import UploadBox from './components/UploadBox';
import ResultCard from './components/ResultCard';

const BASE_URL = 'https://invoice-extractor-1lg8.onrender.com';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasProcessed, setHasProcessed] = useState(false);

  const resultRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResults(null);
    setError('');
    setHasProcessed(false);
  };

  const handleProcess = async () => {
    if (!file || hasProcessed) return;

    setLoading(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append("extract", file);

    try {
      const res = await fetch(`${BASE_URL}/api/extract`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process invoice.');
      }

      setResults(data);
      setHasProcessed(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (results && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Invoice AI Extractor</h1>
      
      <UploadBox onFileSelect={handleFileSelect} />
      
      {file && (
        <button
          onClick={handleProcess}
          className={`mt-4 px-4 py-2 rounded text-white ${loading || hasProcessed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading || hasProcessed}
        >
          {loading ? 'Processing...' : hasProcessed ? 'Processed' : 'Process Invoice'}
        </button>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
      
      {results && (
        <div ref={resultRef}>
          <ResultCard results={results} />
        </div>
      )}
    </main>
  );
}

export default App;
