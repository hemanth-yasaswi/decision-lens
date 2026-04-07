import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { chat as chatApi, uploadDocument, getDocuments } from "../services/api";
import { 
  Send, 
  Bot, 
  User, 
  Paperclip,
  MoreVertical,
  Brain,
  Download,
  Trash2,
  Plus,
  Clock,
  Clipboard,
  Check,
  Info,
  List,
  FileText,
  Link as LinkIcon,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  File as FileIcon,
  Upload as UploadIcon
} from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain"
];

export function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null); // null, 'all', or chatId
  const [isExporting, setIsExporting] = useState(false);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortControllers = useRef(new Map());

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("decisionlens_chat_history");
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem("decisionlens_chat_history", JSON.stringify(chatHistory));
    window.dispatchEvent(new CustomEvent("chat_history_updated"));
  }, [chatHistory]);

  // Listen for external requests
  useEffect(() => {
    const handleNewChatReq = () => handleNewChat(true);
    const handleLoadChatReq = (e) => loadChat(e.detail);

    window.addEventListener("new_chat_requested", handleNewChatReq);
    window.addEventListener("load_chat_requested", handleLoadChatReq);

    return () => {
      window.removeEventListener("new_chat_requested", handleNewChatReq);
      window.removeEventListener("load_chat_requested", handleLoadChatReq);
    };
  }, [messages]); // messages dependency to ensure handleNewChat has latest state if needed

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      if (isNearBottom) {
        scrollRef.current.scrollTop = scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Polling for file status
  useEffect(() => {
    const processingFiles = pendingFiles.filter(f => f.status === "processing");
    if (processingFiles.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const response = await getDocuments();
        const backendDocs = response.data;

        setPendingFiles(prev => prev.map(file => {
          if (file.status !== "processing") return file;
          
          const backendDoc = backendDocs.find(d => d.id === file.docId);
          if (backendDoc) {
            if (backendDoc.status === "ready") {
              return { ...file, status: "ready" };
            } else if (backendDoc.status === "error") {
              return { ...file, status: "failed", error: "Processing failed on server" };
            }
            // still processing — keep current status
          }
          return file;
        }));
      } catch (error) {
        console.error("Polling failed", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pendingFiles]);

  const handleFileUpload = async (files) => {
    const newFiles = Array.from(files).map(file => {
      // Validation
      let error = null;
      if (file.size > MAX_FILE_SIZE) error = "Exceeds 50MB";
      if (!ALLOWED_TYPES.includes(file.type)) error = "Unsupported format";

      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        status: error ? "failed" : "uploading",
        progress: 0,
        error,
        docId: null
      };
    });

    setPendingFiles(prev => [...prev, ...newFiles]);

    // Start uploads for valid files
    newFiles.forEach(async (fileObj) => {
      if (fileObj.error) return;

      const controller = new AbortController();
      abortControllers.current.set(fileObj.id, controller);

      try {
        const response = await uploadDocument(fileObj.file);
        setPendingFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: "processing", docId: response.data.id } : f
        ));
      } catch (error) {
        if (error.name === "AbortError") return;
        setPendingFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: "failed", error: "Upload failed" } : f
        ));
      } finally {
        abortControllers.current.delete(fileObj.id);
      }
    });
  };

  const removeFile = (id) => {
    const controller = abortControllers.current.get(id);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(id);
    }
    setPendingFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSend = async () => {
    if (!input.trim() && pendingFiles.length === 0) return;

    const processingCount = pendingFiles.filter(f => f.status === "processing" || f.status === "uploading").length;
    const readyDocIdsRaw = pendingFiles.filter(f => f.status === "ready").map(f => f.docId);
    const readyDocIds = readyDocIdsRaw.length > 0 ? readyDocIdsRaw : null;

    const userMessage = { 
      id: Date.now(), 
      role: "user", 
      content: input,
      files: [...pendingFiles],
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // We clear pending files from the composer after sending, but they stay in the "session context"
    // In a real app, we might want to keep them visible somewhere else.
    // For this UI, sending "binds" them to the chat history.
    
    setIsTyping(true);
    try {
      const response = await chatApi(input, readyDocIds);
      const aiData = response.data;
      
      const aiMessage = {
        id: Date.now() + 1,
        role: "ai",
        content: aiData.summary,
        data: aiData,
        timestamp: new Date(),
        warning: processingCount > 0 ? "Some files were still processing and might not have been fully analyzed." : null
      };
      
      const updatedMessages = [...messages, userMessage, aiMessage];
      setMessages(updatedMessages);
      saveToHistory(updatedMessages, [...pendingFiles]);
    } catch (error) {
      console.error("Chat failed", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "ai",
        content: "I encountered an error. Please ensure your documents are processed.",
        isError: true,
        timestamp: new Date()
      };
      const updatedMessages = [...messages, userMessage, errorMessage];
      setMessages(updatedMessages);
      saveToHistory(updatedMessages, [...pendingFiles]);
    } finally {
      setIsTyping(false);
    }
  };

  const saveToHistory = (msgs, files) => {
    const chatId = currentChatId || Date.now().toString();
    if (!currentChatId) setCurrentChatId(chatId);

    const title = msgs.find(m => m.role === "user")?.content.substring(0, 40) || "New Analysis";
    
    setChatHistory(prev => {
      const existingIndex = prev.findIndex(c => c.id === chatId);
      const chatData = {
        id: chatId,
        title,
        messages: msgs,
        files: files.filter(f => f.status === "ready"),
        timestamp: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        const newHistory = [...prev];
        newHistory[existingIndex] = chatData;
        return newHistory;
      }
      return [chatData, ...prev];
    });
  };

  const loadChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
    setPendingFiles(chat.files || []);
    setIsHistoryOpen(false);
  };

  const deleteChat = (id) => {
    if (id === "all") {
      setChatHistory([]);
      if (currentChatId) handleNewChat(true);
    } else {
      setChatHistory(prev => prev.filter(c => c.id !== id));
      if (currentChatId === id) handleNewChat(true);
    }
    setShowDeleteModal(null);
  };

  const handleNewChat = (force = false) => {
    if (force || messages.length === 0 || window.confirm("Start a new chat? This will clear current context.")) {
      setMessages([]);
      setPendingFiles([]);
      setInput("");
      setCurrentChatId(null);
      abortControllers.current.forEach(c => c.abort());
      abortControllers.current.clear();
    }
  };

  const clearCurrentChat = () => {
    setMessages([]);
    setPendingFiles([]);
    setInput("");
    abortControllers.current.forEach(c => c.abort());
    abortControllers.current.clear();
    setShowClearModal(false);
    
    // Update history if it exists
    if (currentChatId) {
      setChatHistory(prev => prev.map(c => 
        c.id === currentChatId ? { ...c, messages: [], files: [] } : c
      ));
    }
  };

  const exportToPDF = async () => {
    if (messages.length === 0) {
      alert("Cannot export an empty chat.");
      return;
    }

    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = 20;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204);
      doc.text("DecisionLens Analysis Report", margin, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPos);
      yPos += 15;

      // Attached Documents
      const activeFiles = pendingFiles.filter(f => f.status === "ready");
      if (activeFiles.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Context Documents:", margin, yPos);
        yPos += 7;
        doc.setFontSize(10);
        activeFiles.forEach(f => {
          doc.text(`• ${f.name}`, margin + 5, yPos);
          yPos += 5;
        });
        yPos += 10;
      }

      // Messages
      messages.forEach((msg, index) => {
        // Check for page break
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        const role = msg.role === "user" ? "USER" : "AI";
        doc.setFontSize(11);
        doc.setTextColor(msg.role === "user" ? 0 : 50, 50, 150);
        doc.setFont("helvetica", "bold");
        doc.text(`${role}:`, margin, yPos);
        yPos += 6;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(0);
        
        let content = msg.content;
        if (msg.role === "ai" && msg.data) {
          content = `SUMMARY:\n${msg.data.summary}\n\nKEY POINTS:\n${msg.data.key_points?.join("\n• ") || "N/A"}\n\nEXPLANATION:\n${msg.data.explanation}`;
        }

        const lines = doc.splitTextToSize(content, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += (lines.length * 5) + 10;
      });

      const dateStr = new Date().toISOString().split('T')[0];
      doc.save(`DecisionLens_Chat_${dateStr}.pdf`);
    } catch (error) {
      console.error("PDF Export failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const readyFilesCount = pendingFiles.filter(f => f.status === "ready").length;

  return (
    <div 
      className="h-[calc(100vh-120px)] flex flex-col relative"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#E6EEFF]/50 backdrop-blur-sm border-4 border-dashed border-primary rounded-3xl flex flex-col items-center justify-center pointer-events-none"
          >
            <UploadIcon size={64} className="text-primary mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-primary">Drop files to analyze</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#1E293B]">DecisionLens Workspace</h1>
            <div className="flex items-center gap-3">
              {readyFilesCount > 0 && (
                <p className="text-[10px] text-primary font-bold flex items-center gap-1">
                  <FileIcon size={10} />
                  {readyFilesCount} Documents Active
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="p-2 rounded-xl bg-[#F0F5FF] border border-[#D6E4FF] text-[#475569] hover:bg-[#D6E4FF] hover:text-primary transition-all shadow-sm"
            title="Chat History"
          >
            <Clock size={20} />
          </button>
          <button
            onClick={exportToPDF}
            disabled={isExporting || messages.length === 0}
            className="p-2 rounded-xl bg-[#F0F5FF] border border-[#D6E4FF] text-[#475569] hover:bg-[#D6E4FF] hover:text-primary transition-all shadow-sm disabled:opacity-50"
            title="Export to PDF"
          >
            {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
          </button>
          <button
            onClick={() => setShowClearModal(true)}
            className="p-2 rounded-xl bg-[#F0F5FF] border border-[#D6E4FF] text-[#475569] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={() => handleNewChat()}
            className="px-4 py-2 rounded-full bg-primary text-white font-semibold text-sm flex items-center gap-2 hover:bg-primary-hover transition-all shadow-md"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* History Sidebar */}
        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full bg-[#E0EAFF] rounded-3xl border border-[#D6E4FF] overflow-hidden flex flex-col shadow-xl"
            >
              <div className="p-4 border-b border-[#D6E4FF] flex items-center justify-between">
                <h3 className="font-bold text-[#1E293B] flex items-center gap-2">
                  <Clock size={16} /> History
                </h3>
                <button 
                  onClick={() => setShowDeleteModal('all')}
                  className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-wider"
                >
                  Clear All
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {chatHistory.length === 0 ? (
                  <div className="py-10 text-center text-text-muted text-xs">No history yet</div>
                ) : (
                  chatHistory.map((chat) => (
                    <div 
                      key={chat.id}
                      className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                        currentChatId === chat.id 
                          ? "bg-[#D6E4FF] text-primary shadow-sm" 
                          : "hover:bg-[#D6E4FF]/50 text-[#475569]"
                      }`}
                      onClick={() => loadChat(chat)}
                    >
                      <p className="text-sm font-bold truncate pr-6">{chat.title}</p>
                      <p className="text-[10px] opacity-50 mt-1">
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteModal(chat.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="flex-1 flex flex-col p-0 overflow-hidden border-none bg-transparent shadow-none">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
        >
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="w-16 h-16 bg-[#D6E4FF] rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Bot size={32} />
                </div>
                <h2 className="text-3xl font-bold text-[#1E293B] mb-4">How can I help you today?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                  {[
                    "Summarize my recent uploads",
                    "Analyze risk factors in the project",
                    "Compare these two documents",
                    "Extract key dates and milestones"
                  ].map((suggestion, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(suggestion)}
                      className="p-4 rounded-2xl border border-[#D6E4FF] text-left text-sm text-[#475569] hover:bg-[#D6E4FF] hover:text-primary hover:border-primary/30 transition-all bg-[#F0F5FF]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="max-w-4xl mx-auto w-full space-y-8">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot size={18} />
                      </div>
                    )}
                    <div className={`max-w-[85%] space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "ai" 
                          ? "bg-[#F0F5FF] border border-[#D6E4FF] text-[#1E293B] shadow-sm" 
                          : "bg-primary text-white shadow-md"
                      }`}>
                        {msg.role === "ai" && msg.data ? (
                          <div className="space-y-4 text-left">
                            <div className="flex items-start gap-2">
                              <Info size={16} className="mt-1 text-primary flex-shrink-0" />
                              <div>
                                <p className="font-bold text-[10px] uppercase tracking-wider mb-1 text-text-muted opacity-70">Summary</p>
                                <p>{msg.data.summary}</p>
                              </div>
                            </div>
                            {msg.data.key_points && (
                              <div className="flex items-start gap-2">
                                <List size={16} className="mt-1 text-primary flex-shrink-0" />
                                <div>
                                  <p className="font-bold text-[10px] uppercase tracking-wider mb-1 text-text-muted opacity-70">Key Points</p>
                                  <ul className="list-disc list-inside space-y-1">
                                    {msg.data.key_points.map((p, i) => <li key={i}>{p}</li>)}
                                  </ul>
                                </div>
                              </div>
                            )}
                            <div className="flex items-start gap-2">
                              <FileText size={16} className="mt-1 text-primary flex-shrink-0" />
                              <div>
                                <p className="font-bold text-[10px] uppercase tracking-wider mb-1 text-text-muted opacity-70">Explanation</p>
                                <p className="whitespace-pre-wrap">{msg.data.explanation}</p>
                              </div>
                            </div>

                            {msg.data.sources && msg.data.sources.length > 0 && (
                              <div className="pt-3 border-t border-[#D6E4FF]">
                                <p className="font-bold text-[10px] uppercase tracking-wider mb-2 text-[#64748B] opacity-50 flex items-center gap-1">
                                  <LinkIcon size={10} /> Sources
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {msg.data.sources.map((source, i) => (
                                    <div key={i} className="px-2 py-1 rounded bg-[#D6E4FF]/50 text-[10px] font-semibold text-primary border border-primary/10">
                                      {source.filename}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-left">{msg.content}</p>
                        )}
                        {msg.warning && (
                          <p className="mt-3 text-[10px] text-amber-600 flex items-center gap-1 font-medium">
                            <AlertCircle size={10} /> {msg.warning}
                          </p>
                        )}
                      </div>
                      {msg.files && msg.files.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-end">
                          {msg.files.map(f => (
                            <div key={f.id} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#E6EEFF]/50 border border-primary/10 text-[10px] text-primary font-medium">
                              <FileIcon size={10} /> {f.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-[#E6EEFF] text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10">
                        <User size={18} />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot size={18} />
                    </div>
                    <div className="bg-[#F0F5FF] p-4 rounded-2xl flex gap-1 shadow-sm border border-[#D6E4FF]">
                      <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Composer Area */}
        <div className="max-w-4xl mx-auto w-full p-4">
          <div className="bg-[#F0F5FF] rounded-3xl border border-[#D6E4FF] shadow-xl overflow-hidden transition-all focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/30">
            {/* File Preview Shelf */}
            <AnimatePresence>
              {pendingFiles.length > 0 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pt-4 flex flex-wrap gap-3 border-b border-[#D6E4FF] pb-3"
                >
                  {pendingFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="group relative flex items-center gap-3 p-2 pr-8 rounded-xl bg-[#D6E4FF]/50 border border-primary/10 min-w-[140px]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F0F5FF] flex items-center justify-center text-primary shadow-sm">
                        {file.status === "uploading" ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : file.status === "processing" ? (
                          <div className="relative">
                            <Loader2 size={16} className="animate-spin" />
                            <Brain size={8} className="absolute inset-0 m-auto" />
                          </div>
                        ) : file.status === "ready" ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <AlertCircle size={16} className="text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-[#1E293B] truncate">{file.name}</p>
                        <p className={`text-[8px] uppercase tracking-wider font-bold ${
                          file.status === "ready" ? "text-emerald-500" : 
                          file.status === "failed" ? "text-red-500" : "text-text-muted"
                        }`}>
                          {file.status}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFile(file.id)}
                        className="absolute top-1 right-1 p-1 rounded-full hover:bg-red-50 text-text-muted hover:text-red-500 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex items-end p-2">
              <input 
                type="file" 
                multiple 
                accept=".pdf,.txt"
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-text-muted hover:text-primary transition-all"
              >
                <Paperclip size={22} />
              </button>
              <textarea
                rows={1}
                placeholder={pendingFiles.length > 0 ? "Ask about these documents..." : "Upload documents or ask a question..."}
                className="flex-1 max-h-48 py-3 px-4 bg-transparent border-none focus:ring-0 text-sm text-[#1E293B] placeholder-[#64748B] resize-none outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                style={{ height: "auto" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() && pendingFiles.length === 0}
                className="p-3 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-50 disabled:grayscale shadow-md"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center mt-2 text-text-muted">
            DecisionLens can make mistakes. Verify important information.
          </p>
        </div>
      </Card>
    </div>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {showClearModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E293B]/20 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#F0F5FF] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#D6E4FF]"
            >
              <h3 className="text-xl font-bold text-[#1E293B] mb-2">Clear current chat?</h3>
              <p className="text-[#475569] text-sm mb-6">This will remove all messages and files from the current session. This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowClearModal(false)}>Cancel</Button>
                <Button variant="danger" className="flex-1" onClick={clearCurrentChat}>Clear</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/20 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#F0F5FF] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#D6E4FF]"
            >
              <h3 className="text-xl font-bold text-[#1E293B] mb-2">
                {showDeleteModal === 'all' ? "Delete all history?" : "Delete this chat?"}
              </h3>
              <p className="text-[#475569] text-sm mb-6">
                Are you sure you want to delete {showDeleteModal === 'all' ? "all your chat history" : "this conversation"}? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(null)}>Cancel</Button>
                <Button variant="danger" className="flex-1" onClick={() => deleteChat(showDeleteModal)}>Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
