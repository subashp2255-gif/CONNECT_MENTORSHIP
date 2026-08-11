import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Search, Edit, Phone, Video, MoreVertical,
  Send, Smile, Paperclip, FileText, Download,
  ArrowLeft, MessageSquare, X
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useStore } from '../../store/useStore';

const CONVERSATIONS = [
  {
    id: 'c1',
    user: {
      id: 'u1',
      name: 'Arjun Krishnamurthy',
      avatar: 'https://ui-avatars.com/api/?name=Arjun+K&background=7c3aed&color=fff',
      college: 'IIT Madras',
      company: 'Google',
      role: 'SDE Intern',
      isOnline: true,
    },
    unreadCount: 2,
    lastMessage: 'Sure, I can help you with the DSA prep!',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Hey! I saw your profile on CoNnEcT.', time: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'text' },
      { id: 'm2', senderId: 'me', text: 'Hi Arjun! Yes, I was hoping to get some guidance on DSA.', time: new Date(Date.now() - 1.9 * 60 * 60 * 1000), type: 'text' },
      { id: 'm3', senderId: 'u1', text: 'Of course! What topics are you currently struggling with?', time: new Date(Date.now() - 1.8 * 60 * 60 * 1000), type: 'text' },
      { id: 'm4', senderId: 'me', text: 'Mainly graphs and dynamic programming. I find them really hard.', time: new Date(Date.now() - 1 * 60 * 60 * 1000), type: 'text' },
      { id: 'm5', senderId: 'u1', text: 'Those are the most important topics for FAANG! Let me share a roadmap.', time: new Date(Date.now() - 55 * 60 * 1000), type: 'text' },
      { id: 'm6', senderId: 'u1', text: 'Start with BFS/DFS, then move to shortest path algorithms. For DP start with 1D problems.', time: new Date(Date.now() - 54 * 60 * 1000), type: 'text' },
      { id: 'm7', senderId: 'me', text: 'That makes sense! Should I solve LeetCode problems alongside?', time: new Date(Date.now() - 30 * 60 * 1000), type: 'text' },
      { id: 'm8', senderId: 'u1', text: 'Sure, I can help you with the DSA prep!', time: new Date(Date.now() - 5 * 60 * 1000), type: 'text' },
    ]
  },
  {
    id: 'c2',
    user: {
      id: 'u2',
      name: 'Priya Nair',
      avatar: 'https://ui-avatars.com/api/?name=Priya+N&background=f472b6&color=fff',
      college: 'BITS Pilani',
      company: 'Microsoft',
      role: 'SDE 1',
      isOnline: false,
    },
    unreadCount: 0,
    lastMessage: 'Your resume looks great! Just fix the summary section.',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messages: [
      { id: 'm1', senderId: 'me', text: 'Hi Priya! I booked a resume review session with you.', time: new Date(Date.now() - 5 * 60 * 60 * 1000), type: 'text' },
      { id: 'm2', senderId: 'u2', text: 'Hey! Yes I saw that. Please share your resume here first so I can have a look before our session.', time: new Date(Date.now() - 4.5 * 60 * 60 * 1000), type: 'text' },
      { id: 'm3', senderId: 'me', text: 'Sure! I have attached it below.', time: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'text' },
      { id: 'm4', senderId: 'me', text: 'resume_subash_2024.pdf', time: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'file', fileName: 'resume_subash_2024.pdf', fileSize: '245 KB' },
      { id: 'm5', senderId: 'u2', text: 'Got it! Give me 10 minutes to review this.', time: new Date(Date.now() - 3 * 60 * 60 * 1000), type: 'text' },
      { id: 'm6', senderId: 'u2', text: 'Your resume looks great! Just fix the summary section.', time: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'text' },
    ]
  },
  {
    id: 'c3',
    user: {
      id: 'u3',
      name: 'Karthik Rajan',
      avatar: 'https://ui-avatars.com/api/?name=Karthik+R&background=22d3ee&color=fff',
      college: 'NIT Trichy',
      company: 'Razorpay',
      role: 'Full Stack Dev',
      isOnline: true,
    },
    unreadCount: 5,
    lastMessage: 'Let me know when you are free for the mock interview.',
    lastMessageTime: new Date(Date.now() - 20 * 60 * 1000),
    messages: [
      { id: 'm1', senderId: 'u3', text: 'Hi! I am Karthik, your mentor for the mock interview session.', time: new Date(Date.now() - 3 * 60 * 60 * 1000), type: 'text' },
      { id: 'm2', senderId: 'me', text: 'Hello Karthik! Really excited for this session.', time: new Date(Date.now() - 2.8 * 60 * 60 * 1000), type: 'text' },
      { id: 'm3', senderId: 'u3', text: 'Great! I will be focusing on system design and DSA. Are you comfortable with both?', time: new Date(Date.now() - 2.5 * 60 * 60 * 1000), type: 'text' },
      { id: 'm4', senderId: 'me', text: 'DSA yes, system design I am a bit weak.', time: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'text' },
      { id: 'm5', senderId: 'u3', text: 'No worries! I will go easy on system design and focus more on DSA then.', time: new Date(Date.now() - 1 * 60 * 60 * 1000), type: 'text' },
      { id: 'm6', senderId: 'u3', text: 'Let me know when you are free for the mock interview.', time: new Date(Date.now() - 20 * 60 * 1000), type: 'text' },
    ]
  },
  {
    id: 'c4',
    user: {
      id: 'u4',
      name: 'Ananya Sharma',
      avatar: 'https://ui-avatars.com/api/?name=Ananya+S&background=f59e0b&color=fff',
      college: 'VIT Vellore',
      company: 'Flipkart',
      role: 'ML Engineer',
      isOnline: false,
    },
    unreadCount: 0,
    lastMessage: 'Check out this ML roadmap I made for you.',
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    messages: [
      { id: 'm1', senderId: 'u4', text: 'Hey! I saw you are interested in ML. What is your current level?', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: 'text' },
      { id: 'm2', senderId: 'me', text: 'I know Python and basics of numpy and pandas. Never built an actual ML model.', time: new Date(Date.now() - 1.9 * 24 * 60 * 60 * 1000), type: 'text' },
      { id: 'm3', senderId: 'u4', text: 'Perfect starting point! You should start with scikit-learn.', time: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), type: 'text' },
      { id: 'm4', senderId: 'u4', text: 'Check out this ML roadmap I made for you.', time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), type: 'text' },
    ]
  },
  {
    id: 'c5',
    user: {
      id: 'u5',
      name: 'Vikram Patel',
      avatar: 'https://ui-avatars.com/api/?name=Vikram+P&background=10b981&color=fff',
      college: 'BITS Sathy',
      company: 'CRED',
      role: 'SDE 2',
      isOnline: true,
    },
    unreadCount: 1,
    lastMessage: 'The project architecture looks solid. Ship it!',
    lastMessageTime: new Date(Date.now() - 45 * 60 * 1000),
    messages: [
      { id: 'm1', senderId: 'me', text: 'Hi Vikram! I need help with my final year project architecture.', time: new Date(Date.now() - 3 * 60 * 60 * 1000), type: 'text' },
      { id: 'm2', senderId: 'u5', text: 'Sure! What are you building?', time: new Date(Date.now() - 2.8 * 60 * 60 * 1000), type: 'text' },
      { id: 'm3', senderId: 'me', text: 'A real-time collaboration tool like Figma but for code. Using React and Node.js.', time: new Date(Date.now() - 2.5 * 60 * 60 * 1000), type: 'text' },
      { id: 'm4', senderId: 'u5', text: 'Interesting! You will need WebSockets for real-time sync. Use Socket.io.', time: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'text' },
      { id: 'm5', senderId: 'me', text: 'I already have Socket.io set up. Should I use Redis for pub/sub?', time: new Date(Date.now() - 1 * 60 * 60 * 1000), type: 'text' },
      { id: 'm6', senderId: 'u5', text: 'The project architecture looks solid. Ship it!', time: new Date(Date.now() - 45 * 60 * 1000), type: 'text' },
    ]
  }
];

const EMOJIS = ['😊','😂','🔥','👍','❤️','🎉','😎','🤔','💡','✅','🚀','💪','🙏','😅','👏','💻','📚','⭐','🎯','💬','😍','🤝','✨','🏆','📝','🎓','💼','🌟','😄','👋'];

export default function MentorshipChat() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  
  const messagesContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [activeConversation?.messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
      if (emojiRef.current && !emojiRef.current.contains(event.target)) setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let typingTimer;
    if (activeConversation && activeConversation.id === 'c1') {
      typingTimer = setTimeout(() => {
        setShowTyping(true);
      }, 2000);
    } else {
      setShowTyping(false);
    }
    return () => clearTimeout(typingTimer);
  }, [activeConversation]);

  const handleSelectConversation = (conv) => {
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
    setActiveConversation({ ...conv, unreadCount: 0 });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0 && activeConversation) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const sizeStr = sizeMB < 1 ? Math.round(file.size / 1024) + ' KB' : sizeMB + ' MB';
      
      const newMessage = {
        id: 'm' + Date.now(),
        senderId: 'me',
        text: file.name,
        time: new Date(),
        type: 'file',
        fileName: file.name,
        fileSize: sizeStr
      };

      appendMessage(newMessage, file.name);
      e.target.value = null; // reset
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;
    
    const textMsg = messageInput.trim();
    const newMessage = {
      id: 'm' + Date.now(),
      senderId: 'me',
      text: textMsg,
      time: new Date(),
      type: 'text'
    };
    
    appendMessage(newMessage, textMsg);
    setMessageInput('');
    setShowTyping(false); // remove fake typing if active
    
    // Auto reply simulation
    setTimeout(() => {
      const replies = [
        'That makes sense!',
        'Got it, thanks for sharing!',
        'Sure, let me think about that.',
        'Great point! I will keep that in mind.',
        'Sounds good! Let me know if you need anything else.',
        'Absolutely! Happy to help.',
        'Interesting approach. Let me check and get back to you.'
      ];
      
      const autoReply = {
        id: 'm' + (Date.now() + 1),
        senderId: activeConversation.user.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date(),
        type: 'text'
      };
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation.id) {
          return { ...conv, messages: [...conv.messages, autoReply], lastMessage: autoReply.text, lastMessageTime: new Date() };
        }
        return conv;
      }));
      
      setActiveConversation(prev => {
        if (!prev) return prev;
        return { ...prev, messages: [...prev.messages, autoReply] };
      });
    }, 1500);
  };

  const appendMessage = (newMessage, lastMsgText) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversation.id) {
        return { ...conv, messages: [...conv.messages, newMessage], lastMessage: lastMsgText, lastMessageTime: new Date(), unreadCount: 0 };
      }
      return conv;
    }));
    setActiveConversation(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
  };

  const filteredConversations = conversations.filter(c => 
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.lastMessageTime - a.lastMessageTime);

  const getMessageDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMM dd, yyyy");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      
      {/* LEFT PANEL */}
      <div className={cn(
        "w-full md:w-[320px] md:min-w-[320px] bg-panel border-r border-border flex flex-col transition-all",
        activeConversation ? "hidden md:flex" : "flex"
      )}>
        {/* Header & Search */}
        <div className="p-4 border-b border-border sticky top-0 bg-panel z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">Messages</h2>
            <button className="text-text-muted hover:text-white p-2 rounded-lg hover:bg-surface transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder-text-dim"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filteredConversations.length > 0 ? filteredConversations.map(conv => {
            const isActive = activeConversation?.id === conv.id;
            return (
              <div 
                key={conv.id} 
                onClick={() => handleSelectConversation(conv)}
                className={cn(
                  "cursor-pointer px-4 py-3 rounded-xl mb-1 flex items-center gap-3 transition-all",
                  isActive ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-surface/50 border-l-2 border-transparent"
                )}
              >
                <div className="relative shrink-0">
                  <img src={conv.user.avatar} alt={conv.user.name} className="w-12 h-12 rounded-full object-cover border border-border" />
                  <div className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-panel", conv.user.isOnline ? "bg-green-500" : "bg-gray-500")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-white truncate pr-2">{conv.user.name}</h4>
                    <span className="text-xs text-text-dim shrink-0 whitespace-nowrap">
                      {isToday(conv.lastMessageTime) 
                        ? formatDistanceToNow(conv.lastMessageTime, { addSuffix: true })
                        : format(conv.lastMessageTime, "MMM dd")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={cn("text-xs truncate flex-1 pr-2", conv.unreadCount > 0 ? "text-white font-medium" : "text-text-muted")}>
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-mono font-bold px-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <p className="text-center text-text-dim text-sm mt-10">No conversations found.</p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={cn(
        "flex-1 bg-background flex-col w-full h-full",
        activeConversation ? "flex" : "hidden md:flex"
      )}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-panel border-b border-border px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setActiveConversation(null)} className="md:hidden p-2 -ml-2 text-text-muted hover:text-white rounded-xl hover:bg-surface">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative shrink-0">
                  <img src={activeConversation.user.avatar} alt={activeConversation.user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className={cn("absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-panel", activeConversation.user.isOnline ? "bg-green-500" : "bg-gray-500")} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm md:text-base">{activeConversation.user.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs", activeConversation.user.isOnline ? "text-green-400" : "text-text-dim")}>
                      {activeConversation.user.isOnline ? "● Online" : "Last seen recently"}
                    </span>
                    <span className="hidden sm:inline-block bg-surface border border-border rounded-full px-2 py-0.5 text-[10px] text-text-dim">
                      {activeConversation.user.college}
                    </span>
                    <span className="hidden sm:inline-block bg-surface border border-border rounded-full px-2 py-0.5 text-[10px] text-text-dim">
                      {activeConversation.user.company}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-3">
                <button onClick={() => toast("Voice call coming soon!", { icon: '📞', style: { background: '#16161e', color: '#fff' } })} className="p-2 text-text-muted hover:text-white rounded-xl hover:bg-surface transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button onClick={() => toast("Video call coming soon!", { icon: '🎥', style: { background: '#16161e', color: '#fff' } })} className="p-2 text-text-muted hover:text-white rounded-xl hover:bg-surface transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 text-text-muted hover:text-white rounded-xl hover:bg-surface transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-full mt-2 bg-panel border border-border rounded-xl shadow-2xl z-50 py-1 min-w-[160px]"
                      >
                        <div onClick={() => { navigate(`/mentors/${activeConversation.user.id}`); setShowDropdown(false); }} className="px-4 py-2.5 text-sm text-gray-300 hover:bg-surface cursor-pointer focus:outline-none">View Profile</div>
                        <div onClick={() => { navigate(`/mentors/${activeConversation.user.id}`); setShowDropdown(false); }} className="px-4 py-2.5 text-sm text-gray-300 hover:bg-surface cursor-pointer focus:outline-none">Book a Session</div>
                        <div onClick={() => { 
                          if(window.confirm('Clear all messages?')) {
                            setConversations(prev => prev.map(c => c.id === activeConversation.id ? {...c, messages: []} : c));
                            setActiveConversation(prev => ({...prev, messages: []}));
                          }
                          setShowDropdown(false);
                         }} className="px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 cursor-pointer focus:outline-none border-t border-border mt-1">Clear Chat</div>
                        <div onClick={() => { toast.success("User blocked", {style: { background: '#16161e', color: '#fff', border: '1px solid #2a2a3a' }}); setShowDropdown(false); }} className="px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 cursor-pointer focus:outline-none">Block User</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-background custom-scrollbar">
              <div className="space-y-4">
                {activeConversation.messages.map((msg, index, arr) => {
                  const isSentByMe = msg.senderId === 'me';
                  const showAvatar = !isSentByMe && (index === 0 || arr[index - 1].senderId === 'me');
                  const prevMsg = arr[index - 1];
                  const showDate = !prevMsg || getMessageDateLabel(msg.time) !== getMessageDateLabel(prevMsg.time);

                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                      {showDate && (
                        <div className="flex items-center gap-3 my-6">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-xs text-text-dim font-mono px-2 uppercase tracking-wider">{getMessageDateLabel(msg.time)}</span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}

                      <div className={cn("flex", isSentByMe ? "justify-end" : "justify-start gap-2")}>
                        {!isSentByMe && (
                          <div className="w-7 shrink-0">
                            {showAvatar && <img src={activeConversation.user.avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />}
                          </div>
                        )}
                        
                        <div className={cn("flex flex-col", isSentByMe ? "items-end" : "items-start", "max-w-[85%] md:max-w-[70%]")}>
                          
                          {msg.type === 'text' ? (
                            <div className={cn(
                              "px-4 py-2.5 text-sm shadow-sm break-words",
                              isSentByMe 
                                ? "bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl rounded-br-sm shadow-primary/20" 
                                : "bg-panel border border-border text-white rounded-2xl rounded-bl-sm"
                            )}>
                              {msg.text}
                            </div>
                          ) : (
                            <div className="bg-panel border border-border rounded-xl p-3 flex items-center gap-4 shadow-sm w-full min-w-[200px]">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                {msg.fileName.endsWith('.pdf') ? <FileText className="w-5 h-5 text-primary" /> : <Paperclip className="w-5 h-5 text-primary" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{msg.fileName}</p>
                                <p className="text-xs text-text-dim">{msg.fileSize}</p>
                              </div>
                              <button onClick={() => toast(`Downloading ${msg.fileName}...`, { icon: '⬇️', style: { background: '#16161e', color: '#fff', fontSize: '14px' } })} className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-white transition-colors shrink-0">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-1 mt-1 px-1">
                            <span className="text-[10px] text-text-dim">{format(new Date(msg.time), "hh:mm a")}</span>
                            {isSentByMe && <span className="text-[10px] text-text-dim">✓✓</span>}
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Fake Typing Indicator */}
                {showTyping && (
                  <div className="flex justify-start gap-2">
                    <div className="w-7 shrink-0">
                      <img src={activeConversation.user.avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                    </div>
                    <div className="bg-panel border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-text-dim" />
                      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-1.5 h-1.5 rounded-full bg-text-dim" />
                      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full bg-text-dim" />
                    </div>
                  </div>
                )}
                
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-panel border-t border-border px-4 py-4 sticky bottom-0 z-20">
              <div className="flex items-end gap-2 md:gap-3 max-w-4xl mx-auto relative">
                
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-text-muted hover:text-white bg-surface hover:bg-surface/80 rounded-2xl transition-colors shrink-0 mb-[2px]">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="relative shrink-0 mb-[2px]" ref={emojiRef}>
                  <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-3 text-text-muted hover:text-white bg-surface hover:bg-surface/80 rounded-2xl transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full mb-3 left-0 z-50 bg-panel border border-border rounded-2xl p-3 shadow-2xl origin-bottom-left"
                      >
                        <div className="grid grid-cols-6 gap-1 w-[260px]">
                          {EMOJIS.map(emoji => (
                            <button 
                              key={emoji} type="button"
                              onClick={() => { setMessageInput(prev => prev + emoji); setShowEmojiPicker(false); textareaRef.current?.focus(); }}
                              className="text-xl hover:bg-surface rounded-lg p-1.5 transition-colors focus:outline-none"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                        textareaRef.current.style.height = 'auto';
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-white resize-none custom-scrollbar focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder-text-dim min-h-[44px] max-h-[120px]"
                  />
                </div>

                <button 
                  type="button" 
                  onClick={() => { sendMessage(); textareaRef.current.style.height = 'auto'; }}
                  disabled={!messageInput.trim()}
                  className={cn(
                    "w-11 h-11 md:w-12 md:h-12 bg-gradient-brand rounded-2xl flex items-center justify-center shrink-0 mb-[2px] transition-all flex-shrink-0 active:scale-95 text-white",
                    !messageInput.trim() ? "opacity-50 cursor-not-allowed" : "shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                  )}
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 h-full">
            <div className="w-24 h-24 rounded-full bg-panel border border-border flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-text-dim opacity-50" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Select a conversation</h2>
            <p className="text-sm text-text-dim max-w-sm">
              Choose from your conversations on the left to start chatting, ask questions, or schedule sessions.
            </p>
          </div>
        )}
      </div>
      
    </motion.div>
  );
}
