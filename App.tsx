
import React, { useState, useEffect } from 'react';
import { MobileContainer } from './components/MobileContainer';
import { Navigation } from './components/Navigation';
import { AppTab, CoupleChallenge, RelationshipQuest, MoodEntry, Wallpaper, Song } from './types';
import { getDailyChallenge, getRelationshipQuests, suggestSong } from './services/geminiService';
import { 
  Flame, 
  ChevronRight, 
  Loader2, 
  Sparkles, 
  History,
  Camera,
  Heart,
  Image as ImageIcon,
  Bell,
  X,
  Plus,
  Music,
  Play,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Plane,
  Gift,
  Eye,
  EyeOff
} from 'lucide-react';

const WALLPAPERS: Wallpaper[] = [
  { id: '1', name: 'Rose Petals', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000' },
  { id: '2', name: 'Midnight Sky', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=1000' },
  { id: '3', name: 'Golden Hour', url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1000' },
  { id: '4', name: 'Soft Linen', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000' },
];

const MEMORIES = [
  "https://images.unsplash.com/photo-1516589174184-c6858b16ecb0?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=800"
];

const INITIAL_SONG: Song = {
  title: "Lover",
  artist: "Taylor Swift",
  albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200",
  spotifyUrl: "https://open.spotify.com"
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [loading, setLoading] = useState(false);
  const [candleLit, setCandleLit] = useState(false);
  
  // Interactive States
  const [missYouActive, setMissYouActive] = useState(false);
  const [sharedWallpaper, setSharedWallpaper] = useState(WALLPAPERS[0].url);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [partnerSong] = useState<Song | null>(INITIAL_SONG);
  const [mySong, setMySong] = useState<Song | null>(null);

  // LDR & Surprise States
  const [reunionDate, setReunionDate] = useState<string | null>(null);
  const [isSurprise, setIsSurprise] = useState(false);
  const [revealHours, setRevealHours] = useState(12);
  const [viewAsPartner, setViewAsPartner] = useState(false); // Demo toggle: see it as the surprised person
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);

  const [bucketList, setBucketList] = useState<string[]>(["Sunset hike", "First breakfast together"]);
  const [newBucketItem, setNewBucketItem] = useState("");

  // Data States
  const [challenge, setChallenge] = useState<CoupleChallenge | null>(null);
  const [quests, setQuests] = useState<RelationshipQuest[]>([]);
  const [moods] = useState<MoodEntry[]>([
    { user: 'You', emoji: '😊', label: 'Missing Alex', timestamp: 'Now' },
    { user: 'Partner', emoji: '😍', label: 'Thinking of us', timestamp: '2m ago' }
  ]);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const c = await getDailyChallenge();
        setChallenge(c);
      } catch (e) { console.error(e); }
    };
    fetchChallenge();

    const memoryInterval = setInterval(() => {
      setCurrentMemoryIndex((prev) => (prev + 1) % MEMORIES.length);
    }, 8000);

    return () => clearInterval(memoryInterval);
  }, []);

  const calculateDaysLeft = (date: string) => {
    const today = new Date();
    const target = new Date(date);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateHoursLeft = (date: string) => {
    const today = new Date();
    const target = new Date(date);
    const diff = target.getTime() - today.getTime();
    return Math.max(0, diff / (1000 * 60 * 60));
  };

  const isRevealed = () => {
    if (!reunionDate) return false;
    const hours = calculateHoursLeft(reunionDate);
    return hours <= revealHours;
  };

  const triggerMissYou = () => {
    setMissYouActive(true);
    setTimeout(() => setMissYouActive(false), 4000);
  };

  const handleFetchQuests = async (cat: string) => {
    setLoading(true);
    try {
      const qs = await getRelationshipQuests(cat);
      setQuests(qs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const shareSong = async () => {
    if (!spotifyConnected) {
      setSpotifyConnected(true);
      setShowNotification("Spotify Synced! 🎵");
      return;
    }
    setLoading(true);
    const suggested = await suggestSong("missing you");
    const [title, artist] = suggested.split(" - ");
    setMySong({
      title,
      artist,
      albumArt: `https://images.unsplash.com/photo-1459749411177-042180ceea72?auto=format&fit=crop&q=80&w=200`,
      spotifyUrl: "https://open.spotify.com"
    });
    setShowNotification(`Sent "${title}" to Alex! 🎶`);
    setLoading(false);
  };

  const renderHome = () => {
    const daysLeft = reunionDate ? calculateDaysLeft(reunionDate) : null;
    const showTimerOnHome = daysLeft !== null && daysLeft <= 10;
    const shouldShowSurpriseGift = isSurprise && !isRevealed() && viewAsPartner;

    return (
      <div className="relative h-full overflow-y-auto p-6 space-y-6 animate-in fade-in duration-700">
        <header className="flex justify-between items-center pt-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">AYKACEM</h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">3,420 miles between hearts</p>
          </div>
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-200 flex items-center justify-center text-rose-600 font-bold shadow-sm">Y</div>
            <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold shadow-sm">A</div>
          </div>
        </header>

        {/* Shared Memories Photo Frame */}
        <section className="relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group">
          <img 
            src={MEMORIES[currentMemoryIndex]} 
            className="w-full h-full object-cover transition-opacity duration-1000"
            alt="Shared Memory"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute bottom-6 left-8 flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
             <p className="text-white text-xs font-bold italic tracking-tight uppercase opacity-80">Our Memories • June 2024</p>
          </div>
        </section>

        {/* Conditional Reunion Widget */}
        {showTimerOnHome && (
          <div className="animate-in slide-in-from-bottom duration-500">
            {shouldShowSurpriseGift ? (
              <div className="bg-gradient-to-br from-indigo-900 to-black rounded-[2.5rem] p-6 text-white relative overflow-hidden flex flex-col items-center gap-3 text-center border-2 border-indigo-400/20">
                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center animate-bounce">
                    <Gift size={32} className="text-indigo-300" />
                 </div>
                 <div>
                    <h4 className="font-black text-sm uppercase italic tracking-tighter">A Surprise is waiting!</h4>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Someone is planning a special visit.<br/>Check back soon to reveal the date.</p>
                 </div>
                 <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-1/3 animate-pulse"></div>
                 </div>
              </div>
            ) : (
              <section className="bg-black rounded-[2.5rem] p-6 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10 -mr-4 -mt-4"><Plane size={80} /></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                     <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Reunion Imminent</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                     <span className="text-5xl font-black italic">{daysLeft}</span>
                     <span className="text-xs font-bold text-gray-400 uppercase">Days Left</span>
                  </div>
                  <p className="text-[10px] mt-4 text-gray-500 font-medium">{isSurprise ? '🎁 SURPRISE UNVEILED' : 'LHR ✈ JFK • MAY 15'}</p>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Interactive Hub */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={triggerMissYou}
            className="bg-rose-500 h-40 rounded-[2.5rem] shadow-xl shadow-rose-200 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 relative overflow-hidden"
          >
            <Heart size={32} className="text-white fill-white animate-pulse" />
            <span className="text-white font-black text-[10px] uppercase tracking-widest">Miss You Blast</span>
          </button>
          <div className="flex flex-col gap-4">
             <button 
              onClick={() => setLoading(true)}
              className="bg-white flex-1 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
             >
                <Camera size={20} className="text-indigo-500" />
                <span className="font-bold text-[10px] text-gray-800 uppercase">WYD?</span>
             </button>
             <button 
              onClick={() => setCandleLit(!candleLit)}
              className={`flex-1 rounded-[2rem] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${candleLit ? 'bg-orange-500 text-white shadow-lg' : 'bg-white shadow-sm border border-gray-100 text-gray-800'}`}
             >
                <Flame size={20} className={candleLit ? 'text-white' : 'text-orange-500'} />
                <span className="font-bold text-[10px] uppercase tracking-tighter">Flame</span>
             </button>
          </div>
        </div>

        {/* Daily Challenge */}
        {challenge && (
          <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 relative">
            <div className="absolute top-0 right-0 p-3 text-rose-500"><Sparkles size={16} /></div>
            <h3 className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Daily Blast</h3>
            <h4 className="text-lg font-bold text-gray-900 leading-tight mb-2">{challenge.title}</h4>
            <p className="text-gray-500 text-xs mb-4 leading-relaxed italic">"{challenge.description}"</p>
            <button className="w-full bg-gray-900 text-white py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest">Mark Done</button>
          </section>
        )}
      </div>
    );
  };

  const renderMoi = () => (
    <div className="flex flex-col h-full bg-white">
      <header className="p-8 pt-12 pb-4">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Planning Space</h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Manage your milestones</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Reunion / Surprise Config */}
        <section className="bg-gray-50 rounded-[2.5rem] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xs text-gray-900 uppercase tracking-widest">Next Meeting</h3>
            <span className="text-[10px] font-bold text-gray-400">PLANNER</span>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                 <Calendar size={18} className="text-rose-500"/>
                 <input 
                  type="date" 
                  className="flex-1 text-xs font-bold text-gray-700 outline-none"
                  value={reunionDate || ''}
                  onChange={(e) => setReunionDate(e.target.value)}
                 />
              </div>
              <div className="h-px bg-gray-100 w-full" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gift size={18} className={isSurprise ? 'text-indigo-500' : 'text-gray-300'} />
                  <span className="text-xs font-bold text-gray-700">Surprise Reveal</span>
                </div>
                <button 
                  onClick={() => setIsSurprise(!isSurprise)}
                  className={`w-10 h-5 rounded-full transition-all relative ${isSurprise ? 'bg-indigo-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isSurprise ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {isSurprise && (
              <div className="bg-indigo-50 p-4 rounded-3xl space-y-2">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-indigo-500 uppercase">Reveal before arrival</p>
                    <span className="text-[10px] font-bold text-indigo-400">{revealHours}h</span>
                 </div>
                 <input 
                    type="range" min="0" max="48" step="12" 
                    value={revealHours} 
                    onChange={(e) => setRevealHours(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                 />
                 <div className="flex justify-between items-center mt-4 p-2 bg-white rounded-xl">
                   <p className="text-[10px] font-bold text-gray-500">View as Partner</p>
                   <button onClick={() => setViewAsPartner(!viewAsPartner)} className="text-indigo-500">
                     {viewAsPartner ? <EyeOff size={16}/> : <Eye size={16}/>}
                   </button>
                 </div>
              </div>
            )}
          </div>
        </section>

        {/* Bucket List */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-4">
           <h4 className="font-black text-xs text-gray-900 uppercase tracking-widest">The "Finally Together" List</h4>
           <div className="space-y-2">
              {bucketList.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl group transition-all hover:bg-gray-100">
                   <CheckCircle2 size={16} className="text-green-500" />
                   <span className="text-xs font-medium text-gray-600 flex-1">{item}</span>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                 <input 
                  value={newBucketItem}
                  onChange={(e) => setNewBucketItem(e.target.value)}
                  className="flex-1 bg-gray-50 border-none text-xs rounded-xl p-3 shadow-inner focus:outline-none" 
                  placeholder="New meet-up goal..." 
                 />
                 <button 
                  onClick={() => {
                    if (newBucketItem.trim()) {
                      setBucketList([...bucketList, newBucketItem]);
                      setNewBucketItem("");
                    }
                  }}
                  className="bg-gray-900 text-white p-3 rounded-xl active:scale-95 transition-transform"
                 >
                   <Plus size={16}/>
                 </button>
              </div>
           </div>
        </section>

        {/* Wallpaper Picker */}
        <section className="space-y-4">
           <h3 className="font-black text-xs text-gray-900 uppercase tracking-widest px-2">Update Their Screen</h3>
           <div className="grid grid-cols-2 gap-4">
              {WALLPAPERS.map((wp) => (
                <button 
                  key={wp.id}
                  onClick={() => setSharedWallpaper(wp.url)}
                  className={`relative aspect-[9/16] rounded-[2rem] overflow-hidden border-4 transition-all ${sharedWallpaper === wp.url ? 'border-rose-500 scale-95 shadow-xl' : 'border-transparent'}`}
                >
                  <img src={wp.url} className="w-full h-full object-cover" alt={wp.name} />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-black/40 backdrop-blur-sm">
                    <p className="text-white text-[8px] font-black uppercase tracking-widest text-center">{wp.name}</p>
                  </div>
                </button>
              ))}
           </div>
        </section>
      </div>
    </div>
  );

  const renderGames = () => (
    <div className="p-8 pb-24 space-y-6 animate-in slide-in-from-right duration-500">
      <header className="pt-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Bonding Quests</h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Unlock your next level</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Virtual Date', cat: 'Apart', color: 'bg-indigo-50 text-indigo-600', icon: <Play size={14}/> },
          { label: 'LDR Quest', cat: 'Daily', color: 'bg-rose-50 text-rose-600', icon: <Heart size={14}/> },
          { label: 'Meet-Up Ideas', cat: 'Reunion', color: 'bg-green-50 text-green-600', icon: <MapPin size={14}/> },
          { label: 'Deep Truth', cat: 'Talk', color: 'bg-purple-50 text-purple-600', icon: <Clock size={14}/> }
        ].map((item) => (
          <button 
            key={item.label}
            onClick={() => handleFetchQuests(item.label)}
            className={`p-5 rounded-[2.5rem] flex flex-col items-start gap-4 transition-transform active:scale-95 ${item.color} shadow-sm border border-white`}
          >
            <div className="p-2 bg-white rounded-xl shadow-xs">{item.icon}</div>
            <div className="text-left">
               <span className="font-black text-xs uppercase italic tracking-tighter block leading-none">{item.label}</span>
               <span className="text-[8px] opacity-70 font-bold uppercase tracking-widest">{item.cat} Mode</span>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-rose-500" /></div>
        ) : (
          quests.map((q, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles size={40} /></div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight flex-1 pr-4 leading-tight">{q.title}</h4>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${q.isLdr ? 'bg-rose-50 text-rose-500' : 'bg-green-50 text-green-500'}`}>
                  {q.isLdr ? 'VIRTUAL' : 'IN-PERSON'}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed italic">"{q.description}"</p>
              <button className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-widest mt-4">
                Save Quest <ChevronRight size={10} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <MobileContainer>
      <div className="relative h-full transition-all duration-1000 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(242, 242, 247, 0.95), rgba(242, 242, 247, 0.95)), url(${sharedWallpaper})` }}>
        
        {/* Notifications */}
        {showNotification && (
          <div className="fixed top-12 left-6 right-6 z-[100] animate-in slide-in-from-top duration-500">
             <div className="bg-black/95 backdrop-blur-xl text-white p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-3 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-500 p-2 rounded-xl"><Heart size={16} fill="white" /></div>
                  <p className="text-[11px] font-bold leading-tight">{showNotification}</p>
                </div>
                <button onClick={() => setShowNotification(null)} className="text-gray-500"><X size={14}/></button>
             </div>
          </div>
        )}

        {/* Takeover Animation */}
        {missYouActive && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
            <div className="absolute inset-0 bg-rose-500/95 backdrop-blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <Heart size={100} className="text-white fill-white animate-bounce" />
              <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">THINKING<br/>OF US</h1>
              <div className="h-0.5 w-16 bg-white/20"></div>
              <p className="text-rose-100 font-bold uppercase tracking-[0.4em] text-[8px]">Distance means nothing</p>
            </div>
          </div>
        )}

        <main className="h-full pb-24 overflow-y-auto">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'games' && renderGames()}
          {activeTab === 'moi' && renderMoi()}
          {activeTab === 'mood' && (
             <div className="p-8 space-y-8 animate-in fade-in duration-500">
               <header className="pt-8">
                 <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Mood Bridge</h1>
                 <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Emotional sync status</p>
               </header>
               <div className="space-y-4">
                 {moods.map((m, idx) => (
                   <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-5">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">{m.emoji}</div>
                      <div>
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">{m.user}</p>
                        <p className="text-gray-900 font-bold text-sm leading-none">{m.label}</p>
                        <p className="text-gray-400 text-[10px] mt-1">{m.timestamp}</p>
                      </div>
                   </div>
                 ))}
               </div>
               <div className="bg-gray-900 rounded-[3rem] p-8 text-white text-center shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-[60px]"></div>
                 <h3 className="text-lg font-black uppercase italic tracking-tighter mb-8">Send a Vibe Signal</h3>
                 <div className="flex justify-center gap-4">
                   {['❤️', '🥺', '🔥', '😴', '✨'].map(e => (
                     <button key={e} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl hover:scale-125 transition-all duration-300 active:bg-rose-500">{e}</button>
                   ))}
                 </div>
               </div>
             </div>
          )}
          {activeTab === 'profile' && (
            <div className="p-8 pt-16 text-center space-y-12">
               <div className="relative inline-block">
                 <div className="w-32 h-32 bg-white rounded-[3rem] mx-auto flex items-center justify-center text-6xl text-rose-500 font-black shadow-2xl border-4 border-rose-50">Y</div>
                 <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white"><CheckCircle2 size={16}/></div>
               </div>
               <div>
                 <h2 className="text-3xl font-black tracking-tighter italic uppercase">Alex & Jordan</h2>
                 <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Together for 450 days</p>
               </div>
               <div className="space-y-3">
                  <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-4"><History size={20} className="text-indigo-500"/> <span className="text-xs font-black uppercase tracking-widest text-gray-700">Journey Log</span></div>
                     <ChevronRight size={18} className="text-gray-200" />
                  </div>
                  <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-4"><MapPin size={20} className="text-rose-500"/> <span className="text-xs font-black uppercase tracking-widest text-gray-700">Shared Pins</span></div>
                     <ChevronRight size={18} className="text-gray-200" />
                  </div>
               </div>
            </div>
          )}
        </main>
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .animate-music-bar-1 { animation: music-bar 0.9s ease-in-out infinite; }
        .animate-music-bar-2 { animation: music-bar 1.2s ease-in-out infinite 0.2s; }
        .animate-music-bar-3 { animation: music-bar 0.7s ease-in-out infinite 0.4s; }
        input[type="range"] {
          -webkit-appearance: none;
          background: rgba(0,0,0,0.05);
          height: 4px;
          border-radius: 2px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #6366f1;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>

      {loading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-2xl flex items-center justify-center z-[300]">
           <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-5 border border-gray-100 scale-90 sm:scale-100">
              <Loader2 className="text-rose-500 animate-spin" size={40} />
              <p className="font-black text-gray-800 text-[10px] uppercase tracking-[0.4em]">Bridging Distance...</p>
           </div>
        </div>
      )}
    </MobileContainer>
  );
};

export default App;
