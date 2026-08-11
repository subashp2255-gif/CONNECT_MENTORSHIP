import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import { Play, Copy, RefreshCw, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from '../ui/Select';

const STARTER_TEMPLATES = {
  javascript: 'console.log("Hello from CoNnEcT!");',
  python: 'print("Hello from CoNnEcT!")',
  html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>CoNnEcT</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
  css: 'body {\n  background-color: #0a0a0f;\n  color: white;\n}',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from CoNnEcT!");\n  }\n}',
  cpp: '#include <iostream>\n\nint main() {\n  std::cout << "Hello from CoNnEcT!" << std::endl;\n  return 0;\n}'
};

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' }
];

const LiveCodeEditor = () => {
  const { code, language, codeOutput, setCode, setLanguage, setCodeOutput } = useSessionRoomStore();
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  // Initialize code if empty
  React.useEffect(() => {
    if (!code) {
      setCode(STARTER_TEMPLATES[language] || '');
    }
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(STARTER_TEMPLATES[newLang] || '');
    setCodeOutput('');
  };

  const handleRun = () => {
    setIsRunning(true);
    setCodeOutput('');
    
    if (language !== 'javascript') {
      setTimeout(() => {
        setCodeOutput(`[Mock Output]\nExecution simulated for ${language}.\nTo run real ${language} code, a backend compilation service is required.\nHello from CoNnEcT!`);
        setIsRunning(false);
      }, 1000);
      return;
    }

    // Run Javascript via eval
    setTimeout(() => {
      let outputLogs = [];
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;

      console.log = (...args) => {
        outputLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      };
      console.error = (...args) => {
        outputLogs.push('ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      };

      try {
        // eslint-disable-next-line no-eval
        const result = eval(code);
        if (result !== undefined) {
          outputLogs.push(`< ${String(result)}`);
        }
      } catch (err) {
        outputLogs.push(`Execution Error: ${err.toString()}`);
      }

      console.log = originalConsoleLog;
      console.error = originalConsoleError;

      setCodeOutput(outputLogs.length ? outputLogs.join('\n') : 'Execution complete. No output.');
      setIsRunning(false);
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleReset = () => {
    setCode(STARTER_TEMPLATES[language] || '');
    setCodeOutput('');
    toast.success("Editor reset to starter template");
  };

  return (
    <div className="flex flex-col h-full bg-[#111118] overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-3 bg-[#16161e] border-b border-[#2a2a3a] shrink-0">
        
        <div className="flex items-center space-x-3">
          <Select
            size="sm"
            className="w-36"
            options={LANGUAGES.map(lang => ({ value: lang.id, label: lang.label }))}
            value={language}
            onChange={handleLanguageChange}
          />
          
          <div className="flex items-center px-3 py-1 bg-[#2a2a3a]/50 rounded text-[10px] text-[#6b6b8a] uppercase font-bold tracking-widest border border-white/5">
            <div className="flex -space-x-1 mr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-[#16161e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500 border border-[#16161e]"></div>
            </div>
            Both editing
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 text-[#6b6b8a] hover:text-white hover:bg-[#2a2a3a] rounded-lg transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={handleReset}
            className="p-1.5 text-[#6b6b8a] hover:text-white hover:bg-[#2a2a3a] rounded-lg transition-colors"
            title="Reset to template"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center px-3 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            Run
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative border-b border-[#2a2a3a]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            // Mock cursor colors for collaboration:
            // Since this is Monaco, we can't easily add real-time collaborative cursors without yjs,
            // but we config standard monaco to look nice
          }}
          loading={
            <div className="flex items-center justify-center h-full text-[#6b6b8a]">
              Loading editor...
            </div>
          }
        />
        {/* Mock collaborator cursor overlay */}
        <div className="absolute top-8 left-16 pointer-events-none z-10 flex flex-col items-start animate-pulse">
            <div className="w-[2px] h-4 bg-pink-500"></div>
            <div className="px-1.5 py-0.5 rounded-r rounded-bl bg-pink-500 text-[9px] text-white font-bold tracking-widest leading-none">
              Mentee
            </div>
        </div>
      </div>

      {/* Output Console */}
      <div className="h-48 bg-[#0a0a0f] flex flex-col shrink-0">
        <div className="flex items-center px-4 py-2 bg-[#16161e] border-b border-[#2a2a3a]">
          <Terminal className="w-4 h-4 text-[#6b6b8a] mr-2" />
          <span className="text-xs font-mono text-[#6b6b8a] uppercase tracking-wider">Output</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-sm whitespace-pre-wrap">
          {codeOutput ? (
            <span className={codeOutput.includes('Error') ? 'text-red-400' : 'text-green-400'}>
              {codeOutput}
            </span>
          ) : (
            <span className="text-[#6b6b8a] italic">Click 'Run' to see output here...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveCodeEditor;
