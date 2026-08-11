import React, { useRef, useState, useEffect } from 'react';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import WhiteboardToolbar from './WhiteboardToolbar';
import toast from 'react-hot-toast';

const WhiteboardCanvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [currentWidth, setCurrentWidth] = useState(2);
  
  const { whiteboardStrokes, addStroke, clearWhiteboard, undoWhiteboard } = useSessionRoomStore();
  const [currentStrokePath, setCurrentStrokePath] = useState([]);

  // Setup Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    // Set canvas dimensions to parent container
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Scale for retina displays
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    context.scale(scale, scale);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    redrawCanvas();
  }, []);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const scale = window.devicePixelRatio || 1;
      
      // Save canvas state before resize (resizing clears it)
      const data = canvas.toDataURL();
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      if (contextRef.current) {
         contextRef.current.scale(scale, scale);
         contextRef.current.lineCap = 'round';
         contextRef.current.lineJoin = 'round';
      }
      
      redrawCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [whiteboardStrokes]);

  // Redraw when strokes change (syncs with store)
  useEffect(() => {
    redrawCanvas();
  }, [whiteboardStrokes]);

  // Ctrl+Z handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undoWhiteboard();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undoWhiteboard]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    // Clear whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background
    ctx.fillStyle = '#111118';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes from store
    whiteboardStrokes.forEach(stroke => {
      if (!stroke.path || stroke.path.length === 0) return;
      
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
      
      // If eraser, we need to draw over with thicker line to "erase" visually against bg
      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = '#111118'; // Background color
        ctx.lineWidth = stroke.width * 2; // Make eraser thicker
      }

      ctx.moveTo(stroke.path[0].x, stroke.path[0].y);
      for (let i = 1; i < stroke.path.length; i++) {
        ctx.lineTo(stroke.path[i].x, stroke.path[i].y);
      }
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over'; // Reset
    });
  };

  // Drawing Handlers
  const startDrawing = (e) => {
    // Basic tools only for mock: Pen and Eraser
    if (currentTool !== 'pen' && currentTool !== 'eraser') {
      toast("Select Pen or Eraser to draw. Other tools are view-only in this demo.");
      return;
    }

    const { offsetX, offsetY } = e.nativeEvent;
    
    // Support touch events
    let clientX = e.nativeEvent.clientX;
    let clientY = e.nativeEvent.clientY;
    
    if (e.nativeEvent.touches) {
      const rect = canvasRef.current.getBoundingClientRect();
      clientX = e.nativeEvent.touches[0].clientX - rect.left;
      clientY = e.nativeEvent.touches[0].clientY - rect.top;
    }

    const startX = offsetX ?? clientX;
    const startY = offsetY ?? clientY;

    if (contextRef.current) {
        contextRef.current.beginPath();
        contextRef.current.moveTo(startX, startY);
    }
    
    setIsDrawing(true);
    setCurrentStrokePath([{ x: startX, y: startY }]);
  };

  const draw = (e) => {
    if (!isDrawing || !contextRef.current) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    let clientX = e.nativeEvent.clientX;
    let clientY = e.nativeEvent.clientY;
    
    if (e.nativeEvent.touches) {
      const rect = canvasRef.current.getBoundingClientRect();
      clientX = e.nativeEvent.touches[0].clientX - rect.left;
      clientY = e.nativeEvent.touches[0].clientY - rect.top;
    }

    const x = offsetX ?? clientX;
    const y = offsetY ?? clientY;

    contextRef.current.strokeStyle = currentTool === 'eraser' ? '#111118' : currentColor;
    contextRef.current.lineWidth = currentTool === 'eraser' ? currentWidth * 2 : currentWidth;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();

    setCurrentStrokePath(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    if (contextRef.current) {
        contextRef.current.closePath();
    }
    setIsDrawing(false);
    
    // Save stroke to store to sync globally
    if (currentStrokePath.length > 0) {
      addStroke({
        tool: currentTool,
        color: currentColor,
        width: currentWidth,
        path: currentStrokePath
      });
    }
    setCurrentStrokePath([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `connect-whiteboard-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Whiteboard saved");
  };

  return (
    <div className="flex flex-col h-full bg-[#111118] overflow-hidden w-full relative">
      <WhiteboardToolbar 
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        currentWidth={currentWidth}
        setCurrentWidth={setCurrentWidth}
        onClear={clearWhiteboard}
        onUndo={undoWhiteboard}
        onDownload={handleDownload}
      />
      
      {/* Collaborative Label overlay */}
      <div className="absolute top-[68px] right-4 bg-[#2a2a3a]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-[#6b6b8a] border border-[#323246] flex items-center space-x-2 pointer-events-none z-10">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span>Collaborative mode</span>
      </div>

      <div 
        ref={containerRef} 
        className="flex-1 w-full bg-[#111118] overflow-hidden touch-none"
        style={{ cursor: currentTool === 'eraser' ? 'cell' : 'crosshair' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};

export default WhiteboardCanvas;
