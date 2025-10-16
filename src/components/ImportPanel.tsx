import { Upload, FileText } from 'lucide-react';
import { useState } from 'react';
import { Student } from '../types';
import { parseCSV } from '../utils/csvParser';

interface ImportPanelProps {
  onImport: (students: Student[]) => void;
}

export function ImportPanel({ onImport }: ImportPanelProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const students = parseCSV(text);
        onImport(students);
      } catch (error) {
        alert('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <Upload size={20} />
        Import CSV
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">
          Drag and drop your CSV file here, or click to browse
        </p>
        <label className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium cursor-pointer transition-colors">
          Choose File
          <input
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium mb-2">CSV Format:</p>
        <code className="block bg-white p-2 rounded text-xs">
          grade,gender,first,last,email
          <br />
          9,f,Jane,Doe,jane@example.com
          <br />
          10,m,John,Smith,john@example.com
        </code>
        <p className="mt-2">
          Export from Google Sheets: File → Download → CSV
        </p>
      </div>
    </div>
  );
}
