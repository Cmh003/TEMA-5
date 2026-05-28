import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { 
  HiOutlineHeart, HiHeart, HiOutlinePaperAirplane, 
  HiOutlineChatAlt2, HiOutlineX, HiOutlineArrowLeft,
  HiOutlineSparkles, HiOutlineDotsHorizontal, HiOutlineBookmark, 
  HiOutlineRefresh, HiOutlinePhotograph, HiOutlineTrash, HiOutlineFire,
  HiOutlineSearch, HiOutlineUserGroup, HiOutlinePlusCircle,
  HiOutlineUser, HiOutlineUsers, HiBadgeCheck, HiOutlinePencil
} from 'react-icons/hi'; 
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png'; 

const UN_DIA_MS = 86400000;
const SIETE_DIAS_MS = 604800000;

const getTimeAgo = (timestamp: number) => {
  if (!timestamp) return "Hace un momento";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Hace un momento";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
};

export default function ComunidadPage() {
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setTick(tick => tick + 1), 60000); 
    return () => clearInterval(interval);
  }, []);

  const auth = useAuth() || { isAuthenticated: false, logout: () => {}, user: null };
  const { isAuthenticated, logout, user } = auth;
  const userName =
  user?.displayName ||
  user?.email ||
  "Bombero";

const userInitial =
  userName.charAt(0).toUpperCase();

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const graphDataLaura = [
    { day: "L", hours: "3.2h", height: 40 },
    { day: "M", hours: "5.5h", height: 70 },
    { day: "M", hours: "2.1h", height: 30 },
    { day: "J", hours: "7.0h", height: 90 },
    { day: "V", hours: "4.0h", height: 50 },
    { day: "S", hours: "6.2h", height: 80 },
    { day: "D", hours: "1.5h", height: 20 },
  ];

  const defaultPosts = [
    {
      id: 1,
      isStatCard: true, 
      author: "Laura_Bombera",
      avatarText: "L",
      timestamp: Date.now() - (2 * 60 * 60 * 1000), 
      text: "¡Semana de fuego! 🔥 He superado mi récord de horas de estudio concentrado. El Pomodoro de la central no falla. ¡A tope con el bloque de hidráulica!",
      stats: { value: "4h 30m", label: "Focus Hoy" },
      likes: 84,
      likedBy: [], 
      isVerified: true,
      commentsList: [] 
    },
    { 
      id: 2, 
      author: "Carlos_Rescate", 
      username: "carlos_rescate",
      avatarText: "C", 
      text: "Hoy tocó simulacro de excarcelación. Os dejo un recuerdo de la maniobra de extracción rápida. Recordad asegurar siempre la batería antes de meter cizalla. ¡A seguir sumando! 🚒✂️", 
      mediaUrl: "https://estaticos-cdn.prensaiberica.es/clip/7cef8fae-2826-42fd-95e4-548c85f4bdb6_16-9-aspect-ratio_default_0.webp-696x392.jpg",
      mediaType: "image",
      timestamp: Date.now() - (5 * 60 * 60 * 1000), 
      likes: 112,
      likedBy: [], 
      retweets: 5,
      isVerified: true,
      commentsList: [] 
    }
  ];

  const [posts, setPosts] = useState<any[]>(() => {
    const savedPosts = null;
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts);
      if (parsed.length < defaultPosts.length) {
        return defaultPosts;
      }
      return parsed;
    }
    return defaultPosts;
  });

  useEffect(() => {
    localStorage.setItem('yoopo_community_posts', JSON.stringify(posts));
  }, [posts]);
  
  const [nuevoPost, setNuevoPost] = useState("");
  const [postPreview, setPostPreview] = useState<string | null>(null); 
  const [postType, setPostType] = useState<string | null>(null);
  const postFileInputRef = useRef<HTMLInputElement>(null);

  const [activeMenuPost, setActiveMenuPost] = useState<number | null>(null);
  
  const [ignoredPosts, setIgnoredPosts] = useState<number[]>(() => {
    const saved = localStorage.getItem(`yoopo_ignored_posts_${userName}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(`yoopo_ignored_posts_${userName}`, JSON.stringify(ignoredPosts));
  }, [ignoredPosts, userName]);

  const handleEditPost = (post: any) => {
    const newText = window.prompt("Edita tu publicación:", post.text);
    if (newText !== null && newText.trim() !== "") {
      setPosts(posts.map(p => p.id === post.id ? { ...p, text: newText } : p));
    }
    setActiveMenuPost(null);
  };

  const handleDeletePost = (postId: number) => {
    if (window.confirm("¿Seguro que quieres eliminar este post permanentemente?")) {
      setPosts(posts.filter(p => p.id !== postId));
    }
    setActiveMenuPost(null);
  };

  const handleIgnorePost = (postId: number) => {
    setIgnoredPosts([...ignoredPosts, postId]);
    setActiveMenuPost(null);
  };

  const [activeCommentPost, setActiveCommentPost] = useState<any>(null);
  const [nuevoComentarioText, setNuevoComentarioText] = useState("");

  const abrirComentarios = (post: any) => {
    setActiveCommentPost(post);
  };

  const enviarComentario = (e: any) => {
    e.preventDefault();
    if (!nuevoComentarioText.trim() || !activeCommentPost) return;

    const nuevoComentarioObj = {
      id: Date.now(),
      author: userName,
      avatarText: userInitial,
      text: nuevoComentarioText
    };

    setPosts(prev => prev.map(p => {
      if (p.id === activeCommentPost.id) {
        return {
          ...p,
          commentsList: [...(p.commentsList || []), nuevoComentarioObj]
        };
      }
      return p;
    }));

    setActiveCommentPost((prev: any) => ({
      ...prev,
      commentsList: [...(prev.commentsList || []), nuevoComentarioObj]
    }));

    setNuevoComentarioText("");
  };

  const togglePostLike = (postId: number) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const likedByArray = p.likedBy || [];
        const isLikedByMe = likedByArray.includes(userName);
        
        if (isLikedByMe) {
          return { ...p, likes: p.likes - 1, likedBy: likedByArray.filter((u: string) => u !== userName) };
        } else {
          return { ...p, likes: p.likes + 1, likedBy: [...likedByArray, userName] };
        }
      }
      return p;
    }));
  };

  const [misHistorias, setMisHistorias] = useState<any[]>(() => {
    const savedStories = localStorage.getItem('yoopo_community_stories');
    if (savedStories) {
      const parsed = JSON.parse(savedStories);
      return parsed.filter((h: any) => Date.now() - h.timestamp < SIETE_DIAS_MS);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('yoopo_community_stories', JSON.stringify(misHistorias));
  }, [misHistorias]);

  const historiasActivas = misHistorias.filter(h => Date.now() - h.timestamp < UN_DIA_MS);
  const historiasAgrupadas = historiasActivas.reduce((acc: any, curr: any) => {
    if (!acc[curr.name]) acc[curr.name] = [];
    acc[curr.name].push(curr);
    return acc;
  }, {});

  const sortedHistorias = Object.entries(historiasAgrupadas).sort(([nameA], [nameB]) => {
    if (nameA === userName) return -1;
    if (nameB === userName) return 1;
    return 0;
  });

  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<any>(null); 
  const [nuevoMensajeChat, setNuevoMensajeChat] = useState("");
  const [viewingChatStory, setViewingChatStory] = useState<any>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  
  const [chats, setChats] = useState<any[]>(() => {
    const savedChats = localStorage.getItem(`yoopo_chats_${userName}`);
    return savedChats ? JSON.parse(savedChats) : [{ id: 1, user: { name: "Cabo_García", avatar: "C" }, messages: [{ sender: "them", text: "¿Te presentas a la de Madrid?" }] }];
  });

  useEffect(() => {
    localStorage.setItem(`yoopo_chats_${userName}`, JSON.stringify(chats));
  }, [chats, userName]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `yoopo_chats_${userName}`) {
        const newChatsData = JSON.parse(e.newValue || "[]");
        setChats(newChatsData);
        if (!isChatSidebarOpen) setHasUnreadMessages(true);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userName, isChatSidebarOpen]);

  const abrirSidebarChats = () => {
    setIsChatSidebarOpen(true);
    setHasUnreadMessages(false);
  };

  const syncMessageToRecipient = (recipientName: string, fullMsgObj: any) => {
    const recipientKey = `yoopo_chats_${recipientName}`;
    const stored = localStorage.getItem(recipientKey);
    let recipientChats = stored ? JSON.parse(stored) : [];
    
    const senderAvatar = userName.charAt(0).toUpperCase();
    const msgForRecipient = { ...fullMsgObj, sender: 'them' }; 
    
    const chatExists = recipientChats.find((c: any) => c.user.name === userName);
    if (chatExists) {
      recipientChats = recipientChats.map((c: any) => c.user.name === userName ? { ...c, messages: [...c.messages, msgForRecipient] } : c);
    } else {
      recipientChats = [{ id: Date.now(), user: { name: userName, avatar: senderAvatar }, messages: [msgForRecipient] }, ...recipientChats];
    }
    
    localStorage.setItem(recipientKey, JSON.stringify(recipientChats));
  };

  const abrirChatCon = (nombre: string, avatar: string) => {
    abrirSidebarChats();
    const chatExistente = chats.find(c => c.user.name === nombre);
    
    if (chatExistente) {
      setActiveChat(chatExistente);
    } else {
      const nuevoChat = {
        id: Date.now(),
        user: { name: nombre, avatar: avatar },
        messages: [] 
      };
      setChats(prev => [nuevoChat, ...prev]);
      setActiveChat(nuevoChat);
    }
  };

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [storyPreview, setStoryPreview] = useState<string | null>(null);
  const [storyType, setStoryType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeStoryUser, setActiveStoryUser] = useState<string | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [mensajeHistoria, setMensajeHistoria] = useState(""); 
  const [toastMessage, setToastMessage] = useState<string | null>(null); 
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  
  const activeStories = activeStoryUser ? (historiasAgrupadas[activeStoryUser] || []) : [];
  const currentStory = activeStories[currentStoryIndex];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('yoopo_community_users');
    if (!storedUsers) {
      const initialUsers = [
        { id: 1, username: 'Carlos_Rescate', name: 'Carlos Román', isOnline: true, isVerified: true },
        { id: 2, username: 'Laura_Bombera', name: 'Laura Gómez', isOnline: false, isVerified: true },
        { id: 3, username: 'Opositor_Madrid', name: 'Juan Martín', isOnline: true, isVerified: false },
        { id: 4, username: 'Cabo_García', name: 'Antonio García', isOnline: false, isVerified: true },
        { id: 5, username: 'Elena_Forestal', name: 'Elena Torres', isOnline: true, isVerified: true }
      ];
      localStorage.setItem('yoopo_community_users', JSON.stringify(initialUsers));
      setAllUsers(initialUsers);
    } else {
      setAllUsers(JSON.parse(storedUsers));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setSearchResults(allUsers.filter(u => u.username.toLowerCase().includes(query.toLowerCase()) || u.name.toLowerCase().includes(query.toLowerCase())));
    } else {
      setSearchResults([]);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (ignoredPosts.includes(post.id)) return false; 
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (post.author?.toLowerCase().includes(query) || post.username?.toLowerCase().includes(query) || post.text?.toLowerCase().includes(query));
  });

  const handlePostFileSelect = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setPostPreview(URL.createObjectURL(file));
    setPostType(file.type.startsWith('video') ? 'video' : 'image');
    e.target.value = null; 
  };

  const removerAdjuntoPost = () => {
    setPostPreview(null);
    setPostType(null);
  };

  const publicarPost = (e: any) => {
    e.preventDefault();
    if (!nuevoPost.trim() && !postPreview) return; 
    const nuevaPublicacion = { 
      id: Date.now(), 
      isStatCard: false,
      author: userName, 
      username: `@${userName.toLowerCase().replace(/\s/g, '_')}`,
      avatarText: userInitial, 
      text: nuevoPost, 
      mediaUrl: postPreview,
      mediaType: postType,
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      isVerified: false,
      commentsList: []
    };
    setPosts([nuevaPublicacion, ...posts]);
    setNuevoPost("");
    removerAdjuntoPost();
  };

  useEffect(() => {
    const limpiar = () => { 
      const ahora = Date.now(); 
      setMisHistorias(prev => prev.filter(h => ahora - h.timestamp < SIETE_DIAS_MS)); 
    };
    limpiar(); 
    const int = setInterval(limpiar, 60000); 
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    let timer: any;
    if (isViewerOpen && activeStories.length > 0) {
      timer = setTimeout(() => { 
        if (currentStoryIndex < activeStories.length - 1) {
          siguienteHistoriaAutomática();
        } else {
          cerrarVisor();
        }
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [isViewerOpen, currentStoryIndex, activeStories.length]);

  const toggleLikeHistoria = (e: any) => { 
    e.stopPropagation(); 
    setMisHistorias(prev => prev.map(h => {
      if (h.id === currentStory.id) {
        const likedBy = h.likedBy || [];
        const isLikedByMe = likedBy.includes(userName);
        return { ...h, likedBy: isLikedByMe ? likedBy.filter((u: string) => u !== userName) : [...likedBy, userName] };
      }
      return h;
    })); 
  };
  
  const enviarMensajeHistoria = (e: any) => {
    e.preventDefault(); e.stopPropagation(); if (!mensajeHistoria.trim()) return;
    
    const autor = currentStory.name;
    const avatar = currentStory.name.charAt(0).toUpperCase();
    
    const baseMsg = {
      text: mensajeHistoria,
      isStoryReply: true,
      storyUrl: currentStory.mediaUrl,
      storyMediaType: currentStory.mediaType
    };
    
    const myMsg = { ...baseMsg, sender: 'me' };
    
    setChats(prev => {
      const existe = prev.find(c => c.user.name === autor);
      if (existe) {
        return prev.map(c => c.user.name === autor ? { ...c, messages: [...c.messages, myMsg] } : c);
      }
      return [{ id: Date.now(), user: { name: autor, avatar: avatar }, messages: [myMsg] }, ...prev];
    });

    syncMessageToRecipient(autor, baseMsg);
    
    setToastMessage(`Enviado a ${autor}`); 
    setMensajeHistoria(""); 
    setTimeout(() => setToastMessage(null), 3000);
  };

  const enviarMensajeDirecto = (e: any) => {
    e.preventDefault(); if (!nuevoMensajeChat.trim()) return;
    
    const recipientName = activeChat.user.name;
    const myMsg = { sender: 'me', text: nuevoMensajeChat };

    setChats(prev => prev.map(c => {
      if (c.id === activeChat.id) { 
        const act = { ...c, messages: [...c.messages, myMsg] }; 
        setActiveChat(act); 
        return act; 
      }
      return c;
    }));

    syncMessageToRecipient(recipientName, { text: nuevoMensajeChat });
    setNuevoMensajeChat("");
  };

  const handleStoryFileSelect = (e: any) => {
    const file = e.target.files[0]; if (!file) return;
    setStoryPreview(URL.createObjectURL(file)); setStoryType(file.type.startsWith('video') ? 'video' : 'image'); setIsStoryModalOpen(true); e.target.value = null; 
  };
  
  const confirmarPublicacionHistoria = () => { 
  setMisHistorias([...misHistorias, { 
    id: Date.now(),
    timestamp: Date.now(),
    name: user?.displayName || user?.email?.split('@')[0] || "Bombero",
    mediaUrl: storyPreview,
    mediaType: storyType,
    likedBy: [],
    seenBy: [userName] 
  }]); 
    setIsStoryModalOpen(false); setStoryPreview(null); setStoryType(null); 
  };

  const marcarComoVista = (storyId: number) => {
    setMisHistorias(prev => prev.map(h => {
      if (h.id === storyId) {
        const seenBy = h.seenBy || [];
        if (!seenBy.includes(userName)) {
          return { ...h, seenBy: [...seenBy, userName] };
        }
      }
      return h;
    }));
  };

  const abrirHistoriasDeUsuario = (authorName: string) => {
    setActiveStoryUser(authorName);
    setCurrentStoryIndex(0);
    setIsViewerOpen(true);
    const userStories = historiasAgrupadas[authorName] || [];
    if(userStories.length > 0) {
      marcarComoVista(userStories[0].id);
    }
  };

  const cerrarVisor = () => { 
    setIsViewerOpen(false); 
    setMensajeHistoria(""); 
    setActiveStoryUser(null);
  };
  
  const siguienteHistoriaAutomática = () => {
    setCurrentStoryIndex(prev => prev + 1);
    marcarComoVista(activeStories[currentStoryIndex + 1].id);
  };

  const siguienteHistoria = (e: any) => { 
    e.stopPropagation(); 
    if (currentStoryIndex < activeStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1); 
      marcarComoVista(activeStories[currentStoryIndex + 1].id);
    } else {
      cerrarVisor();
    }
  };

  const anteriorHistoria = (e: any) => { 
    e.stopPropagation(); 
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      marcarComoVista(activeStories[currentStoryIndex - 1].id);
    } 
  };

return (
  <div className="flex min-h-screen bg-[#131a2c] text-white font-sans selection:bg-[#E1B143]/20 relative flex flex-col">
      
    <Navbar />

    {activeMenuPost !== null && (
        <div className="fixed inset-0 z-40" onClick={() => setActiveMenuPost(null)}></div>
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#0A0F1C]/20 relative">
        
        <header className="w-full bg-[#1A233A]/90 backdrop-blur-lg border-b border-white/5 sticky top-0 z-10">
          <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 flex justify-between items-center h-20">
            
            <div className="hidden md:flex relative w-full max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 ml-115">
              <div className="w-full relative flex items-center bg-[#131a2c] border border-white/10 rounded-full px-6 py-3 shadow-inner focus-within:border-[#E1B143]/50 transition-colors">
                <HiOutlineSearch className="text-white/40 mr-4 shrink-0" size={22} />
                <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Buscar opositores, posts..." className="bg-transparent border-none outline-none text-base text-white placeholder-white/30 w-full focus:ring-0" />
                {searchQuery && <button onClick={() => {setSearchQuery(''); setSearchResults([]);}} className="text-white/40 hover:text-white ml-2 shrink-0"><HiOutlineX size={20} /></button>}
              </div>
              <AnimatePresence>
                {searchQuery.trim().length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[110%] left-8 right-8 bg-[#1A233A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                    {searchResults.length > 0 ? (
                      <ul className="py-2">
                        {searchResults.map(result => (
                          <li key={result.id} onClick={() => abrirChatCon(result.username, result.username.charAt(0))} className="px-6 py-4 hover:bg-white/5 cursor-pointer flex items-center gap-4 transition-colors border-b border-white/5 last:border-none group">
                            <div className="w-12 h-12 rounded-full bg-[#242f4d] flex items-center justify-center font-bold text-white text-base border border-white/10 group-hover:border-[#E1B143]/50 transition-colors">{result.username.charAt(0)}</div>
                            <div className="flex-1">
                              <div className="text-base font-bold text-white flex items-center gap-2">@{result.username}{result.isVerified && <HiBadgeCheck className="text-emerald-400 w-5 h-5 shrink-0" />}{result.isOnline && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>}</div>
                              <p className="text-sm text-white/40 mt-1">{result.name}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : <div className="p-8 text-center text-white/40 text-base">No se encontraron usuarios con "{searchQuery}"</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-end gap-6 w-1/4">
              <button onClick={abrirSidebarChats} className="relative text-white/40 hover:text-[#E1B143] transition-colors p-2 rounded-full hover:bg-white/5">
                <HiOutlineChatAlt2 className="w-7 h-7" />
                {hasUnreadMessages && <span className="absolute top-1 right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-[#1A233A]"></span>}
              </button>
              
              {isAuthenticated && (
                <div className="flex items-center gap-4 pl-2 border-l border-white/10">
                  <div className="hidden lg:flex flex-col items-end">
                  
                
                  </div>
                  <div onClick={() => navigate('/perfil')} className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] flex items-center justify-center text-[#1A233A] font-black text-base cursor-pointer hover:scale-105 transition-transform shadow-lg">{userInitial}</div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20 pb-16 w-full mx-auto flex flex-col gap-8 max-w-[1600px]">
          
          <section className="bg-[#1A233A] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-lg mt-8 shrink-0">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Stories</h2>
              <span onClick={() => setIsArchiveModalOpen(true)} className="text-base font-semibold text-white/40 hover:text-white cursor-pointer transition-colors">Mis stories</span>
            </div>
            <div className="flex items-center gap-6 overflow-x-auto pb-4 custom-scrollbar">
              <input type="file" accept="image/*,video/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleStoryFileSelect} />
              
              <div onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0 ml-2">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-white/10 group-hover:bg-[#E1B143] transition-colors border border-dashed border-white/20">
                  <div className="w-full h-full bg-[#131a2c] rounded-full flex items-center justify-center text-white/50 group-hover:text-white transition-colors shadow-inner">
                     <HiOutlinePlusCircle className="w-10 h-10" />
                  </div>
                </div>
                <span className="text-xs text-white/60 font-semibold truncate w-20 text-center">Tu Historia</span>
              </div>

              {sortedHistorias.map(([authorName, storiesArray]: any) => {
                const authorInitial = authorName.charAt(0).toUpperCase();
                const isMe = authorName === userName;
                const hasUnseen = storiesArray.some((s: any) => !(s.seenBy || []).includes(userName));
                const ringClass = hasUnseen ? "bg-gradient-to-tr from-[#E1B143] to-amber-600 shadow-xl" : "bg-white/20";
                
                return (
                  <div key={authorName} onClick={() => abrirHistoriasDeUsuario(authorName)} className="flex flex-col items-center gap-3 cursor-pointer flex-shrink-0 group">
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-[4px] group-hover:scale-105 transition-transform ${ringClass}`}>
                      <div className="w-full h-full bg-[#242f4d] rounded-full border-4 border-[#1A233A] flex items-center justify-center font-black text-3xl text-white relative overflow-hidden">
                        {authorInitial} 
                        <div className="absolute -bottom-1 -right-1 bg-[#131a2c] text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/10">{storiesArray.length}</div>
                      </div>
                    </div>
                    <span className="text-xs text-white/60 font-semibold truncate w-20 text-center">{isMe ? "Tú" : authorName}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 pb-20 items-stretch">
            
            <article className="bg-[#1A233A] p-8 rounded-[2rem] border border-white/5 shadow-xl flex flex-col h-full z-10">
              <form onSubmit={publicarPost} className="flex flex-col h-full">
                <div className="flex gap-5 items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] rounded-full flex items-center justify-center font-black text-xl text-[#131a2c] shadow-lg border-2 border-[#131a2c] shrink-0">
                    {userInitial}
                  </div>
                  <div className="flex-1 w-full">
                    <textarea 
                      value={nuevoPost} onChange={(e) => setNuevoPost(e.target.value)} 
                      placeholder="Comparte tu progreso o dudas..." 
                      className="w-full bg-transparent text-white placeholder-white/30 resize-none outline-none text-lg min-h-[100px] pt-3 custom-scrollbar" 
                    />
                    {postPreview && (
                      <div className="relative mt-4 rounded-2xl overflow-hidden bg-black h-40 border border-white/10 w-fit inline-block">
                        <button type="button" onClick={removerAdjuntoPost} className="absolute top-3 right-3 bg-black/60 p-2 rounded-full hover:bg-red-500 transition-colors z-10"><HiOutlineX className="text-white w-5 h-5"/></button>
                        {postType === 'video' ? <video src={postPreview} className="h-full object-contain" /> : <img src={postPreview} className="h-full object-cover" />}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-white/5 mt-auto">
                  <div className="flex gap-3">
                    <input type="file" accept="image/*,video/*" ref={postFileInputRef} className="hidden" onChange={handlePostFileSelect} />
                    <button type="button" onClick={() => postFileInputRef.current.click()} className="text-white/40 hover:text-[#E1B143] hover:bg-white/5 p-3 rounded-full transition-colors">
                      <HiOutlinePhotograph className="w-7 h-7" />
                    </button>
                  </div>
                  <button type="submit" disabled={!nuevoPost.trim() && !postPreview} className="bg-[#E1B143] text-[#131a2c] px-8 py-3 rounded-full font-black text-sm disabled:opacity-30 disabled:grayscale transition-all shadow-lg hover:shadow-[0_0_20px_rgba(225,177,67,0.4)]">
                    Publicar
                  </button>
                </div>
              </form>
            </article>

            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const isLikedByMe = (post.likedBy || []).includes(userName);
                const isMyPost = post.author === userName;

                return (
                  <React.Fragment key={post.id}>
                    {post.isStatCard && (
                      <article className="bg-[#E1B143] text-[#131a2c] p-8 rounded-[2rem] shadow-xl flex flex-col h-full relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#131a2c] text-white rounded-full flex items-center justify-center font-black text-xl">{post.avatarText}</div>
                            <div>
                              <div className="font-extrabold text-base flex items-center gap-1.5">
                                {post.author}
                                {post.isVerified && <HiBadgeCheck className="text-emerald-700 w-5 h-5 shrink-0" />}
                              </div>
                              <span className="text-[11px] font-black opacity-70 uppercase tracking-widest">{getTimeAgo(post.timestamp)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-6">
                            <span className="text-4xl font-black text-right leading-none">
                              {post.stats.value} <br/><span className="text-xs font-black opacity-70 uppercase tracking-widest">{post.stats.label}</span>
                            </span>
                            
                            <div className="relative z-50">
                              <button onClick={() => setActiveMenuPost(activeMenuPost === post.id ? null : post.id)} className="text-[#131a2c]/40 hover:text-[#131a2c] transition-colors p-2">
                                <HiOutlineDotsHorizontal size={24}/>
                              </button>
                              <AnimatePresence>
                                {activeMenuPost === post.id && (
                                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-10 w-48 bg-[#131a2c] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col">
                                    {isMyPost ? (
                                      <>
                                        <button onClick={() => handleEditPost(post)} className="w-full text-left px-5 py-4 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 flex items-center justify-between">
                                          Editar <HiOutlinePencil size={18}/>
                                        </button>
                                        <button onClick={() => handleDeletePost(post.id)} className="w-full text-left px-5 py-4 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors flex items-center justify-between">
                                          Eliminar <HiOutlineTrash size={18}/>
                                        </button>
                                      </>
                                    ) : (
                                      <button onClick={() => handleIgnorePost(post.id)} className="w-full text-left px-5 py-4 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between">
                                        Ignorar post <HiOutlineX size={18}/>
                                      </button>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-bold text-lg mb-6 leading-relaxed pr-8">{post.text}</p>
                        </div>
                        
                        <div className="flex flex-col justify-end mt-4">
                          <div className="flex items-end justify-between gap-4 h-32 border-b border-[#131a2c]/20 pb-2 relative">
                            {graphDataLaura.map((item, i) => (
                              <div key={i} className="w-full relative group/bar" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                                <AnimatePresence>
                                  {hoveredBar === i && (
                                    <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: 0 }} className="absolute left-1/2 -translate-x-1/2 bg-[#131a2c] text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-xl z-20 pointer-events-none">
                                      {item.hours}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                <div className="w-full bg-[#131a2c] rounded-t-sm transition-all duration-500 hover:opacity-60 cursor-pointer" style={{ height: `${item.height * 1.2}px` }} />
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-3 px-1">
                            {graphDataLaura.map((item, i) => <span key={i} className="text-xs font-black opacity-50 w-full text-center">{item.day}</span>)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[#131a2c]/60 pt-5 mt-5 border-t border-[#131a2c]/10">
                          <div className="flex gap-6">
                            <button onClick={() => togglePostLike(post.id)} className={`flex items-center gap-2 text-base hover:text-red-600 transition-colors ${isLikedByMe ? 'text-red-600' : ''}`}>
                              {isLikedByMe ? <HiHeart className="w-6 h-6" /> : <HiOutlineHeart className="w-6 h-6" />} <span className="font-bold">{post.likes}</span>
                            </button>
                            <button onClick={() => abrirComentarios(post)} className="flex items-center gap-2 text-base hover:text-[#131a2c] transition-colors"><HiOutlineChatAlt2 className="w-6 h-6" /> <span className="font-bold">{post.commentsList?.length || 0}</span></button>
                          </div>
                        </div>
                      </article>
                    )}

                    {!post.isStatCard && (
                      <article className="bg-[#1A233A] p-8 rounded-[2rem] border border-white/5 shadow-xl flex flex-col h-full relative">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border border-white/10 shadow-inner ${post.author === userName ? 'bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] text-[#1A233A]' : 'bg-[#242f4d] text-white'}`}>
                              {post.avatarText}
                            </div>
                            <div>
                              <div className="font-bold text-base text-white flex items-center gap-1.5">
                                {post.author}
                                {post.isVerified && <HiBadgeCheck className="text-emerald-400 w-5 h-5 shrink-0" />}
                              </div>
                              <p className="text-xs text-white/40 mt-1 font-medium">{getTimeAgo(post.timestamp)}</p>
                            </div>
                          </div>

                          <div className="relative z-50">
                            <button onClick={() => setActiveMenuPost(activeMenuPost === post.id ? null : post.id)} className="text-white/20 hover:text-white transition-colors p-2">
                              <HiOutlineDotsHorizontal size={24}/>
                            </button>
                            <AnimatePresence>
                              {activeMenuPost === post.id && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-10 w-48 bg-[#131a2c] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col">
                                  {isMyPost ? (
                                    <>
                                      <button onClick={() => handleEditPost(post)} className="w-full text-left px-5 py-4 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 flex items-center justify-between">
                                        Editar <HiOutlinePencil size={18}/>
                                      </button>
                                      <button onClick={() => handleDeletePost(post.id)} className="w-full text-left px-5 py-4 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors flex items-center justify-between">
                                        Eliminar <HiOutlineTrash size={18}/>
                                      </button>
                                    </>
                                  ) : (
                                    <button onClick={() => handleIgnorePost(post.id)} className="w-full text-left px-5 py-4 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between">
                                      Ignorar post <HiOutlineX size={18}/>
                                    </button>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {post.mediaUrl && (
                          <div className="w-full rounded-2xl overflow-hidden bg-black max-h-80 border border-white/5 mb-6 shrink-0 shadow-lg">
                            {post.mediaType === 'video' ? (
                              <video src={post.mediaUrl} className="w-full h-full object-contain max-h-80" controls />
                            ) : (
                              <img src={post.mediaUrl} className="w-full h-[320px] object-cover" alt="Contenido del post" />
                            )}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap font-medium">{post.text}</p>
                        </div>

                        <div className="flex justify-between items-center text-white/40 pt-5 mt-6 border-t border-white/5">
                          <div className="flex gap-6">
                            <button onClick={() => togglePostLike(post.id)} className={`flex items-center gap-2 text-base hover:text-red-500 transition-colors ${isLikedByMe ? 'text-red-500' : ''}`}>
                              {isLikedByMe ? <HiHeart className="w-6 h-6" /> : <HiOutlineHeart className="w-6 h-6" />} <span className="font-bold">{post.likes}</span>
                            </button>
                            <button onClick={() => abrirComentarios(post)} className="flex items-center gap-2 text-base hover:text-cyan-400 transition-colors"><HiOutlineChatAlt2 className="w-6 h-6" /> <span className="font-bold">{post.commentsList?.length || 0}</span></button>
                          </div>
                        </div>
                      </article>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <div className="col-span-1 lg:col-span-2 text-center py-32 text-white/40 font-medium text-lg bg-[#1A233A] rounded-[2rem] border border-white/5 h-full">
                No hay posts para mostrar en este momento.
              </div>
            )}
          </section>
        </main>
      </div>

      <AnimatePresence>
        {activeCommentPost && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl max-h-[85vh] bg-[#1A233A] rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl relative"
            >
              <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-[#1A233A] z-10 shrink-0">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                   Comentarios
                </h2>
                <button onClick={() => setActiveCommentPost(null)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><HiOutlineX size={24}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar flex flex-col gap-8">
                
                <div className="border-b border-white/10 pb-8 mb-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#242f4d] rounded-full flex items-center justify-center font-bold text-white text-lg border border-white/10">{activeCommentPost.avatarText}</div>
                    <div>
                      <div className="font-bold text-base text-white flex items-center gap-1.5">
                        {activeCommentPost.author}
                        {activeCommentPost.isVerified && <HiBadgeCheck className="text-emerald-400 w-5 h-5 shrink-0" />}
                      </div>
                      <p className="text-xs text-white/40 mt-1 font-medium">{getTimeAgo(activeCommentPost.timestamp)}</p>
                    </div>
                  </div>
                  <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap mb-4">{activeCommentPost.text}</p>
                  {activeCommentPost.mediaUrl && (
                    <div className="w-full rounded-2xl overflow-hidden bg-black max-h-80 border border-white/5 shrink-0 shadow-lg">
                      {activeCommentPost.mediaType === 'video' ? (
                        <video src={activeCommentPost.mediaUrl} className="w-full h-full object-contain max-h-80" controls />
                      ) : (
                        <img src={activeCommentPost.mediaUrl} className="w-full h-full object-cover max-h-80" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-6">
                  {activeCommentPost.commentsList && activeCommentPost.commentsList.length > 0 ? (
                    activeCommentPost.commentsList.map((c: any) => (
                      <div key={c.id} className="flex gap-4 text-base">
                        <div className="w-10 h-10 rounded-full bg-[#242f4d] flex items-center justify-center font-bold text-white text-sm shrink-0 border border-white/10">{c.avatarText}</div>
                        <div className="bg-white/5 rounded-2xl rounded-tl-none px-5 py-4 text-white/80 border border-white/5">
                          <span className="font-bold text-[#E1B143] text-sm block mb-1.5 opacity-90">{c.author}</span>
                          <span className="font-medium leading-relaxed">{c.text}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-white/40 text-base py-8 italic font-medium">No hay comentarios aún. ¡Sé el primero!</div>
                  )}
                </div>
              </div>

              <form onSubmit={enviarComentario} className="p-6 md:p-8 border-t border-white/10 bg-[#1A233A] flex gap-4 shrink-0 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] flex items-center justify-center font-black text-xl text-[#131a2c] shrink-0 shadow-lg">{userInitial}</div>
                <input type="text" value={nuevoComentarioText} onChange={(e) => setNuevoComentarioText(e.target.value)} placeholder="Añade un comentario..." className="flex-1 bg-[#131a2c] border border-white/10 rounded-full px-6 py-4 text-base text-white outline-none focus:border-[#E1B143]/50 placeholder-white/30 shadow-inner" />
                <button type="submit" disabled={!nuevoComentarioText.trim()} className="p-4 bg-[#E1B143] text-[#1A233A] rounded-full disabled:opacity-30 disabled:grayscale transition-all shadow-[0_5px_15px_rgba(225,177,67,0.3)] hover:scale-105 active:scale-95"><HiOutlinePaperAirplane className="w-6 h-6 rotate-45" /></button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsChatSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 bottom-0 right-0 w-full md:w-[450px] bg-[#1A233A] shadow-2xl z-[120] flex flex-col border-l border-white/5">
              {!activeChat ? (
                <>
                  <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#131a2c]/50">
                    <h2 className="text-2xl font-extrabold text-white">Mensajes</h2>
                    <button onClick={() => setIsChatSidebarOpen(false)} className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"><HiOutlineX className="w-7 h-7" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 ? <div className="p-10 text-center text-white/40 text-base font-medium">No tienes mensajes aún.</div> : chats.map(chat => (
                        <div key={chat.id} onClick={() => setActiveChat(chat)} className="p-5 md:p-6 border-b border-white/5 flex items-center gap-4 md:gap-5 hover:bg-white/5 cursor-pointer transition-colors">
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 border border-white/10 shadow-sm">{chat.user.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate text-base mb-1">{chat.user.name}</h4>
                            <p className="text-white/50 text-sm truncate font-medium">
                              {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Inicia la conversación..."}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="p-5 md:p-6 border-b border-white/5 flex items-center gap-4 bg-[#131a2c]/50">
                    <button onClick={() => setActiveChat(null)} className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"><HiOutlineArrowLeft className="w-6 h-6" /></button>
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 border border-white/10 shadow-sm">{activeChat.user.avatar}</div>
                    <h2 className="font-bold text-lg text-white">{activeChat.user.name}</h2>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 md:p-6 flex flex-col gap-5 custom-scrollbar">
                    {activeChat.messages.map((msg: any, i: number) => (
                      <div key={i} className={`max-w-[85%] flex flex-col gap-2 p-4 rounded-2xl text-base leading-relaxed shadow-sm ${msg.sender === 'me' ? 'bg-[#E1B143] text-[#131a2c] self-end rounded-br-sm font-medium' : 'bg-[#242f4d] text-white self-start rounded-bl-sm border border-white/5'}`}>
                        
                        {msg.isStoryReply && (
                          <div 
                            onClick={() => setViewingChatStory({ url: msg.storyUrl, type: msg.storyMediaType })}
                            className={`flex items-center gap-4 p-3 rounded-xl mb-2 cursor-pointer transition-colors ${msg.sender === 'me' ? 'bg-[#131a2c]/20 hover:bg-[#131a2c]/30' : 'bg-white/5 hover:bg-white/10'}`}
                          >
                            <div className="w-12 h-16 bg-black rounded-lg overflow-hidden shrink-0 shadow-inner">
                              {msg.storyMediaType === 'video' ? <video src={msg.storyUrl} className="w-full h-full object-cover" /> : <img src={msg.storyUrl} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 mb-1">
                                {msg.sender === 'me' ? 'Respondiste a su historia' : 'Respondió a tu historia'}
                              </span>
                              <span className="text-sm font-bold flex items-center gap-1.5">
                                <HiOutlinePhotograph size={18} /> Ver Story
                              </span>
                            </div>
                          </div>
                        )}

                        <span>{msg.text}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={enviarMensajeDirecto} className="p-5 md:p-6 border-t border-white/5 bg-[#1A233A] flex gap-4 shrink-0">
                    <input type="text" value={nuevoMensajeChat} onChange={(e) => setNuevoMensajeChat(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 bg-[#131a2c] border border-white/10 rounded-full px-6 py-4 text-base text-white outline-none focus:border-[#E1B143]/50 transition-colors shadow-inner" />
                    <button type="submit" disabled={!nuevoMensajeChat.trim()} className="p-4 bg-[#E1B143] text-[#1A233A] rounded-full disabled:opacity-30 disabled:grayscale transition-all shadow-[0_5px_15px_rgba(225,177,67,0.3)] hover:scale-105 active:scale-95"><HiOutlinePaperAirplane className="w-6 h-6 rotate-45" /></button>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingChatStory && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-sm flex justify-center items-center p-6"
          >
            <button onClick={() => setViewingChatStory(null)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><HiOutlineX size={32}/></button>
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="w-full max-w-lg aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              {viewingChatStory.type === 'video' ? <video src={viewingChatStory.url} className="w-full h-full object-contain" autoPlay loop controls /> : <img src={viewingChatStory.url} className="w-full h-full object-contain" />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isViewerOpen && currentStory && (
        <div className="fixed inset-0 z-[100] bg-black flex justify-center items-center">
          <div className="relative w-full max-w-lg h-full md:h-[90vh] md:rounded-[3rem] bg-[#1a1a1a] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col border border-white/10">
            
            <AnimatePresence>
              {toastMessage && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1A233A] text-white px-8 py-4 rounded-full font-bold shadow-2xl border border-[#E1B143]/30 flex items-center gap-3 text-base whitespace-nowrap">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span> {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/40 to-transparent p-5 pt-8 md:pt-6 pointer-events-none">
              <div className="flex gap-2 mb-6">
                {activeStories.map((_, i) => (
                  <div key={i} className="h-1.5 bg-white/20 rounded-full flex-1 overflow-hidden">
                    {i === currentStoryIndex ? (
                       <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 15, ease: "linear" }} className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" /> 
                    ) : (
                       <div className={`h-full bg-white ${i < currentStoryIndex ? 'w-full' : 'w-0'}`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-2 pointer-events-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] rounded-full flex items-center justify-center font-black text-[#1A233A] text-lg border-2 border-[#1A233A] shadow-md">{currentStory.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="text-white font-bold text-base leading-none drop-shadow-lg">{currentStory.name}</p>
                    <p className="text-white/70 text-xs font-medium drop-shadow-md mt-1">{getTimeAgo(currentStory.timestamp)}</p>
                  </div>
                </div>
                <button onClick={cerrarVisor} className="text-white/80 hover:text-white p-2.5 drop-shadow-lg z-50 relative hover:bg-white/10 rounded-full transition-colors bg-black/20 backdrop-blur-sm"><HiOutlineX className="w-7 h-7" /></button>
              </div>
            </div>
            
            <div className="flex-1 w-full h-full bg-black flex items-center justify-center relative">
               {currentStory.mediaType === 'video' ? <video src={currentStory.mediaUrl} className="w-full h-full object-contain" autoPlay playsInline /> : <img src={currentStory.mediaUrl} className="w-full h-full object-contain" alt="Story content" />}
            </div>
            
            <div className="absolute top-24 bottom-28 left-0 w-1/2 z-40 cursor-pointer" onClick={anteriorHistoria}></div>
            <div className="absolute top-24 bottom-28 right-0 w-1/2 z-40 cursor-pointer" onClick={siguienteHistoria}></div>
            
            {currentStory.name !== userName && (
              <div className="absolute bottom-0 left-0 right-0 p-5 pb-8 md:pb-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-[9999]">
                <form onSubmit={enviarMensajeHistoria} className="flex gap-4 items-center relative z-50">
                  <input type="text" value={mensajeHistoria} onChange={(e) => setMensajeHistoria(e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Enviar mensaje..." className="flex-1 bg-black/40 border border-white/20 rounded-full px-6 py-4 text-base text-white outline-none focus:border-white transition-colors backdrop-blur-md shadow-inner" />
                  {mensajeHistoria.trim() ? (
                    <button type="submit" onClick={(e) => e.stopPropagation()} className="text-[#131a2c] bg-[#E1B143] font-bold px-6 py-3.5 rounded-full hover:scale-105 transition-transform shadow-[0_5px_15px_rgba(225,177,67,0.4)] text-base">Enviar</button>
                  ) : (
                    <button type="button" onClick={toggleLikeHistoria} className="p-3 transition-transform hover:scale-110 active:scale-95 bg-black/20 rounded-full backdrop-blur-sm">
                      {(currentStory.likedBy || []).includes(userName) ? <HiHeart className="w-8 h-8 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" /> : <HiOutlineHeart className="w-8 h-8 text-white drop-shadow-md" />}
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isArchiveModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 md:p-10"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-5xl h-[85vh] bg-[#1A233A] rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl relative"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#131a2c]/50 z-10 shrink-0">
                <h2 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-4">
                   <div className="w-12 h-12 bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] rounded-full flex items-center justify-center text-[#1A233A] font-black text-xl shadow-lg">{userInitial}</div>
                   Archivo de Historias
                </h2>
                <button onClick={() => setIsArchiveModalOpen(false)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><HiOutlineX size={28}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
                
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <h3 className="text-xl font-bold text-white">Activas (24h)</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {misHistorias.filter(h => h.name === userName && (Date.now() - h.timestamp < UN_DIA_MS)).length > 0 ? (
                      misHistorias.filter(h => h.name === userName && (Date.now() - h.timestamp < UN_DIA_MS)).map(s => (
                        <div key={s.id} className="aspect-[9/16] bg-black rounded-2xl overflow-hidden border-2 border-[#E1B143]/50 relative group shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform cursor-pointer">
                          {s.mediaType === 'video' ? <video src={s.mediaUrl} className="w-full h-full object-cover" /> : <img src={s.mediaUrl} className="w-full h-full object-cover" />}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">{getTimeAgo(s.timestamp)}</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-white/40 text-base italic font-medium bg-white/5 p-8 rounded-2xl text-center border border-white/5">No tienes historias activas actualmente.</div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <HiOutlineBookmark className="text-white/40" size={24} />
                    <h3 className="text-xl font-bold text-white/50">Archivo (7 Días)</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {misHistorias.filter(h => h.name === userName && (Date.now() - h.timestamp >= UN_DIA_MS)).length > 0 ? (
                      misHistorias.filter(h => h.name === userName && (Date.now() - h.timestamp >= UN_DIA_MS)).map(s => (
                        <div key={s.id} className="aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 relative group opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                          {s.mediaType === 'video' ? <video src={s.mediaUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" /> : <img src={s.mediaUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">{getTimeAgo(s.timestamp)}</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-white/40 text-base italic font-medium bg-white/5 p-8 rounded-2xl text-center border border-white/5">Tu archivo de los últimos 7 días está vacío.</div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isStoryModalOpen && (
        <div className="fixed inset-0 bg-[#0A0F1C]/95 backdrop-blur-xl z-[150] flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Publicar Historia</h2>
            <button onClick={() => setIsStoryModalOpen(false)} className="text-white/50 hover:text-white p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><HiOutlineX className="w-6 h-6" /></button>
          </div>
          <div className="w-full max-w-md aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-white/10">
            {storyType === 'video' ? <video src={storyPreview!} className="w-full h-full object-contain" autoPlay loop muted /> : <img src={storyPreview!} className="w-full h-full object-contain" alt="Preview" />}
          </div>
          <button onClick={confirmarPublicacionHistoria} className="w-full max-w-md mt-10 py-5 bg-[#E1B143] text-[#131a2c] font-black text-lg rounded-full transition-all hover:scale-105 shadow-[0_10px_30px_rgba(225,177,67,0.3)] uppercase tracking-widest">Añadir a mi historia</button>
        </div>
      )}

    </div>
  );
}