import { useEffect, useMemo, useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import { AskDialog, PrivateRoomDialog } from './components/PrototypeDialogs'
import './App.css'

import { answers, mockNotifications, questions as mockQuestions, roomDiscussions, rooms, topics, trendingQuestions, users } from './data/mockData'
import { answerQuestion } from './services/mockAIService'
import { addMockDocument, getAnnouncements, getDocuments, getPendingQuestions, getPrivateRoom } from './services/mockRoomService'
import { readStore, writeStore, makeId } from './services/storage'

const questions = mockQuestions.map(question => {
  const author = users.find(user => user.id === question.authorId) || users[0]
  return { ...question, room: rooms.find(room => room.id === question.roomId)?.name || 'Community', time: question.createdAt, initials: author.initials, tone: author.role === 'admin' ? 'bg-[#e2edf1] text-[#678d9d]' : 'bg-[#f1ddd4] text-[#a76f58]' }
})
function Icon({ name, size = 18 }) {
  const paths = { search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>, compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></>, grid: <><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></>, bookmark: <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4V4.8Z"/>, bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>, plus: <path d="M12 5v14M5 12h14"/>, arrow: <path d="M5 12h14M13 6l6 6-6 6"/>, chevron: <path d="m9 18 6-6-6-6"/>, users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>, message: <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>, spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z"/><path d="m19 14 1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1L19 14Z"/></>, close: <path d="m18 6-12 12M6 6l12 12"/>, check: <path d="m5 12 4 4L19 6"/>, globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></> }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
function TrendingView({ onBack, onOpen }) {
  return <div className="mx-auto max-w-[970px] px-[18px] pb-12 pt-[30px] lg:px-11 lg:pb-16 lg:pt-[43px] xl:px-[58px]"><button onClick={onBack} className="mb-6 flex items-center gap-2 text-[11px] font-semibold text-[#77816f] hover:text-[#354a39]"><span className="rotate-180"><Icon name="arrow" size={15}/></span> Back to Explore</button><div className="text-[9px] font-bold tracking-[1.2px] text-[#8b9183]">COMMUNITY PULSE</div><h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#28342b] dark:text-[#eff2eb]">Trending this week</h1><p className="mt-2 text-[11px] text-[#85877f] dark:text-[#b3bab0]">Questions people are discussing across AskOra right now.</p><div className="mt-6 grid gap-3">{trendingQuestions.map((item,index)=><button key={item.id} onClick={()=>onOpen(item)} className="group flex items-center gap-4 rounded-xl border border-[#eeede7] bg-[#fffefa] p-4 text-left transition hover:border-[#d8e1cf] hover:shadow-md dark:border-[#353b34] dark:bg-[#222720] dark:hover:border-[#56644e]"><span className="w-8 font-serif text-xl text-[#bdc2b3]">0{index+1}</span><span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#e9efdc] text-[#74895e] dark:bg-[#364233]">{index===0?'✳':index===1?'◒':'↗'}</span><span className="min-w-0 flex-1"><strong className="block text-[12px] font-semibold text-[#42473f] dark:text-[#dfe4db]">{item.title}</strong><span className="mt-1 block text-[10px] leading-relaxed text-[#85877f] dark:text-[#b3bab0]">{item.summary}</span><span className="mt-2 block text-[9px] text-[#92968a]">{item.room} · {item.answers} replies</span></span><span className="grid h-8 w-8 flex-none place-items-center rounded-full border border-[#eeede7] text-[#78836f] group-hover:bg-[#edf1e5]"><Icon name="arrow" size={15}/></span></button>)}</div></div>
}function RoomView({ room, memberCount, onBack, onLeave, onAsk, selectedTrend, roomQuestions, roomAnnouncements, roomDocuments, members, role, isJoined, onJoin, onRestricted }) {
  const storageKey = `askora:room-replies:${room.id}`
  const [expanded, setExpanded] = useState(null)
  const [replyTarget, setReplyTarget] = useState(null)
  const [draft, setDraft] = useState('')
  const posts = roomQuestions.length ? roomQuestions.map(question => {
    const author = members.find(user => user.id === question.authorId) || users[0]
    return { id: question.id, name: author.name, initials: author.initials, age: question.createdAt, title: question.title, body: question.body, replies: question.answers, tone: 'bg-[#e1ebef] text-[#648391]' }
  }) : room.id === 1 ? roomDiscussions : []
  const [replies, setReplies] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}') } catch { return {} }
  })
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(replies)) } catch { /* Browser storage can be disabled. */ }
  }, [replies, storageKey])
  const addReply = (event, postIndex) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setReplies(current => ({ ...current, [postIndex]: [...(current[postIndex] || []), { name: 'Alex Morgan', initials: 'AM', body: text }] }))
    setDraft('')
    setExpanded(postIndex)
    setReplyTarget(null)
  }
  return <div className="mx-auto max-w-[970px] px-[18px] pb-12 pt-[30px] lg:px-11 lg:pb-16 lg:pt-[43px] xl:px-[58px]">
    <button onClick={onBack} className="mb-6 flex items-center gap-2 text-[11px] font-semibold text-[#77816f] hover:text-[#354a39]"><span className="rotate-180"><Icon name="arrow" size={15}/></span> Back to Explore</button>
    <section className="rounded-2xl border border-[#e9e8df] dark:border-[#3a4138] bg-[#fffefa] dark:bg-[#222720] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className={`grid h-14 w-14 place-items-center rounded-2xl text-3xl ${room.tone}`}>{room.mark}</span><div><div className="mb-1 flex items-center gap-1.5 text-[9px] text-[#8a9183] dark:text-[#aab4a5]"><Icon name="globe" size={13}/> PUBLIC ROOM <span className="px-1">·</span>{room.category.toUpperCase()}</div><h1 className="text-2xl font-semibold tracking-tight text-[#28342b] dark:text-[#eff2eb]">{room.name}</h1></div></div>{isJoined?<button onClick={onLeave} className="shrink-0 rounded-lg border border-[#e1e5d9] dark:border-[#485043] px-3 py-2 text-[10px] font-semibold text-[#52664d] hover:bg-[#f4f6ef] dark:bg-[#2a332a]">Leave room</button>:<button onClick={onJoin} className="shrink-0 rounded-lg bg-[#354a39] px-3 py-2 text-[10px] font-semibold text-white">Join room</button>}</div><p className="mt-4 max-w-2xl text-[12px] leading-relaxed text-[#777d72] dark:text-[#b2baaf]">{room.desc}</p><div className="mt-4 flex flex-wrap items-center gap-2">{room.tags.map(tag=><span key={tag} className="rounded-full bg-[#f4f3ed] dark:bg-[#30362f] px-2.5 py-1 text-[9px] text-[#85867c]">{tag}</span>)}<span className="ml-auto flex items-center gap-1 text-[10px] text-[#96988e] dark:text-[#a0a99e]"><Icon name="users" size={15}/>{memberCount} members</span></div></section>
    {roomAnnouncements.length>0&&<section className="mt-5 rounded-xl border border-[#e9e8df] bg-[#fffefa] p-4 dark:border-[#3a4138] dark:bg-[#222720]"><div className="text-[9px] font-bold tracking-wide text-[#8b9183]">ROOM ANNOUNCEMENTS</div>{roomAnnouncements.map(item=><article key={item.id} className="mt-2 border-t border-[#f0efe9] pt-2 dark:border-[#353b34]"><strong className="text-[10px]">{item.title}</strong><p className="mt-1 text-[9px] text-[#85877f] dark:text-[#b3bab0]">{item.body}</p></article>)}</section>}
{roomDocuments.length>0&&<details className="mt-3 rounded-xl border border-[#e9e8df] bg-[#fffefa] p-4 dark:border-[#3a4138] dark:bg-[#222720]"><summary className="cursor-pointer text-[10px] font-semibold">Room knowledge sources · {roomDocuments.length}</summary>{roomDocuments.map(doc=><div key={doc.id} className="mt-2 text-[9px] text-[#85877f] dark:text-[#b3bab0]">{doc.name} · {doc.type} · {doc.status}</div>)}</details>}<div className="mt-7 flex items-end justify-between"><div><div className="text-[9px] font-bold tracking-[1.2px] text-[#8b9183] dark:text-[#aab4a5]">THE CONVERSATION</div><h2 className="mt-1 text-xl font-semibold tracking-tight">Room discussions</h2></div><button onClick={onAsk} className="flex h-9 items-center gap-1.5 rounded-lg bg-[#354a39] px-3 text-[10px] font-semibold text-white hover:bg-[#273a2c]"><Icon name="plus" size={15}/> Ask the room</button></div>
    {selectedTrend?.roomId===room.id&&<article className="mt-4 rounded-xl border border-[#e5dfc8] bg-[#fbf8e9] p-4 dark:border-[#544f3c] dark:bg-[#302e25]"><div className="flex items-center gap-2 text-[9px] font-bold tracking-wide text-[#998348]">TRENDING DISCUSSION <span className="font-normal tracking-normal text-[#96988e]">· {selectedTrend.answers} replies</span></div><h3 className="mt-2 text-[13px] font-semibold text-[#42473f] dark:text-[#dfe4db]">{selectedTrend.title}</h3><p className="mt-1.5 text-[10px] leading-relaxed text-[#85877f] dark:text-[#b3bab0]">{selectedTrend.summary}</p><button onClick={onAsk} className="mt-3 text-[9px] font-semibold text-[#64785a] hover:underline dark:text-[#c7d5b5]">Add your perspective →</button></article>}    {room.id===1&&<article className="mt-4 rounded-xl border border-[#dfe8d6] bg-[#f4f6ef] dark:bg-[#2a332a] p-4 sm:p-5"><div className="flex items-center gap-2 text-[9px] font-bold tracking-wide text-[#667c5b]"><Icon name="check" size={15}/> VERIFIED ANSWER <span className="font-normal tracking-normal text-[#96988e] dark:text-[#a0a99e]">· Room guide</span></div><h3 className="mt-2 text-[13px] font-semibold">Start with a real question, then learn just enough to answer it.</h3><p className="mt-1.5 text-[11px] leading-relaxed text-[#747a70]">Try a small project using a model API first. Once you have a working prototype, explore the fundamentals behind the pieces you used. This keeps learning practical and helps you spot what to study next.</p><div className="mt-3 flex items-center justify-between border-t border-[#e4e9dd] pt-2.5 text-[9px] text-[#8a9183] dark:text-[#aab4a5]"><span>Source: Getting started guide</span><span>Helpful · 34</span></div></article>}
    <div className="mt-3 grid gap-3">{posts.map((post, index)=>{ const userReplies = replies[index] || []; return <article key={post.title} className="rounded-xl border border-[#eeede7] dark:border-[#353b34] bg-[#fffefa] dark:bg-[#222720] p-4"><div className="flex items-center gap-2"><span className={`grid h-8 w-8 place-items-center rounded-full text-[9px] font-bold ${post.tone}`}>{post.initials}</span><div><strong className="block text-[10px]">{post.name}</strong><span className="text-[9px] text-[#a0a197] dark:text-[#9da69b]">{post.age}</span></div><button className="ml-auto text-[10px] text-[#91948a]">···</button></div><h3 className="mt-3 text-[12px] font-semibold text-[#42473f] dark:text-[#dfe4db]">{post.title}</h3><p className="mt-1.5 text-[10px] leading-relaxed text-[#85877f] dark:text-[#b3bab0]">{post.body}</p><div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"><button onClick={()=>{setExpanded(expanded===index?null:index);setReplyTarget(null)}} aria-expanded={expanded===index} className="flex items-center gap-1.5 text-[9px] font-semibold text-[#78836f]"><Icon name="message" size={14}/>{post.replies + userReplies.length} replies · {expanded===index?'Hide replies':'Check replies'}</button>{role==='guest'?<button onClick={()=>onRestricted("Switch to Member to reply.")} className="text-[9px] font-semibold text-[#85877f]">Sign in as Member to reply</button>:<button onClick={()=>{setExpanded(index);setReplyTarget(index);setDraft('')}} className="text-[9px] font-semibold text-[#52694c] hover:underline">Join the conversation</button>}</div>
    {expanded===index&&<div className="mt-3 grid gap-2 border-l-2 border-[#e6ebdf] pl-3">{(userReplies.length?userReplies:[{name:'Sam Rivera',initials:'SR',body:'I would start with a small project and learn the concepts as you need them.'},{name:'Nina Park',initials:'NP',body:'The fast feedback from trying an API first makes the fundamentals easier to understand.'}]).map((reply, replyIndex)=><div key={`${reply.name}-${replyIndex}`} className="rounded-lg bg-[#f8f8f3] dark:bg-[#2b302a] p-3"><div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e9efdc] dark:bg-[#364233] text-[8px] font-bold text-[#657a59]">{reply.initials}</span><strong className="text-[9px]">{reply.name}</strong><span className="text-[8px] text-[#a0a197] dark:text-[#9da69b]">· just now</span></div><p className="ml-8 mt-1 text-[10px] leading-relaxed text-[#73786f]">{reply.body}</p></div>)}</div>}
    {replyTarget===index&&<form onSubmit={event=>addReply(event,index)} className="mt-3 rounded-lg border border-[#e9e8df] dark:border-[#3a4138] bg-[#fbfaf7] dark:bg-[#171a17] p-3"><label className="mb-2 block text-[9px] font-semibold text-[#62685d]" htmlFor={`reply-${room.id}-${index}`}>Your reply</label><textarea id={`reply-${room.id}-${index}`} autoFocus rows="3" value={draft} onChange={event=>setDraft(event.target.value)} placeholder="Add something helpful..." className="w-full resize-y rounded-md border border-[#e9e8df] dark:border-[#3a4138] bg-[#fffefa] dark:bg-[#222720] p-2.5 text-[10px] outline-none focus:border-[#aebc9c] focus:ring-2 focus:ring-[#dce7d4]"/><div className="mt-2 flex justify-end gap-2"><button type="button" onClick={()=>setReplyTarget(null)} className="rounded-md px-3 py-1.5 text-[9px] font-semibold text-[#85877f] dark:text-[#b3bab0]">Cancel</button><button type="submit" disabled={!draft.trim()} className="rounded-md bg-[#354a39] px-3 py-1.5 text-[9px] font-semibold text-white disabled:opacity-50">Post reply</button></div></form>}
    </article>})}</div>
  </div>
}function App() {
  const [topic, setTopic] = useState('For you'), [query, setQuery] = useState(''), [joined, setJoined] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('askora:joined-rooms') || '[]')
      return Array.isArray(saved) ? saved.filter(id => rooms.some(room => room.id === id)) : [1, 7]
    } catch { return [] }
  }), [modal, setModal] = useState(false), [question, setQuestion] = useState(''), [nav, setNav] = useState('Explore'), [currentRoomId, setCurrentRoomId] = useState(null), [showTrending, setShowTrending] = useState(false), [selectedTrend, setSelectedTrend] = useState(null), [notificationsOpen, setNotificationsOpen] = useState(false), [profileOpen, setProfileOpen] = useState(false), [profileModal, setProfileModal] = useState(false), [inviteState, setInviteState] = useState('idle'), [readNotifications, setReadNotifications] = useState(() => { try { return JSON.parse(localStorage.getItem('askora:read-notifications') || '[]') } catch { return [] } }), [darkMode, setDarkMode] = useState(() => { try { return localStorage.getItem('askora:theme') === 'dark' } catch { return false } })
  const [role, setRole] = useState(() => readStore('role', 'member'))
  const [adminOpen, setAdminOpen] = useState(false)
  const [privateModal, setPrivateModal] = useState(false)
  const [privateCode, setPrivateCode] = useState('')
  const [toast, setToast] = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [askRoomId, setAskRoomId] = useState(1), [questionFilter, setQuestionFilter] = useState('recent'), [likedIds, setLikedIds] = useState(() => readStore('upvotes', []))
  const [pendingItems, setPendingItems] = useState(() => getPendingQuestions())
  const [docItems, setDocItems] = useState(() => getDocuments())
  const [announcementItems, setAnnouncementItems] = useState(() => getAnnouncements())
  const [notificationItems, setNotificationItems] = useState(() => readStore('notifications', mockNotifications))
  const [demoUsers, setDemoUsers] = useState(() => readStore('demo-users', users))
  const [questionItems, setQuestionItems] = useState(() => readStore('questions', questions)), [answerItems, setAnswerItems] = useState(() => readStore('answers', answers))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light'
    try { localStorage.setItem('askora:theme', darkMode ? 'dark' : 'light') } catch { /* Browser storage can be disabled. */ }
  }, [darkMode])
  useEffect(() => {
    try { localStorage.setItem('askora:joined-rooms', JSON.stringify(joined)) } catch { /* Browser storage can be disabled. */ }
  }, [joined])
  useEffect(() => { try { localStorage.setItem('askora:read-notifications', JSON.stringify(readNotifications)) } catch { /* Browser storage can be disabled. */ } }, [readNotifications])
  const unreadCount = notificationItems.filter(item => !readNotifications.includes(item.id)).length
  const openNotification = item => { setReadNotifications(list => list.includes(item.id) ? list : [...list, item.id]); setNotificationsOpen(false); if(rooms.find(room=>room.id===item.roomId)?.visibility==="private"&&role==="guest"){setToast("Switch to Member to accept private room invitations.");return}; if(!joined.includes(item.roomId)&&role!=="guest")setJoined(list=>[...list,item.roomId]); openRoom(item.roomId) }
  useEffect(() => { writeStore('role', role) }, [role])
  useEffect(() => { writeStore('documents', docItems) }, [docItems])
  useEffect(() => { writeStore('announcements', announcementItems) }, [announcementItems])
  useEffect(() => { writeStore('notifications', notificationItems) }, [notificationItems])
  useEffect(() => { writeStore('demo-users', demoUsers) }, [demoUsers])
  useEffect(() => { writeStore('questions', questionItems) }, [questionItems])
  useEffect(() => { writeStore('upvotes', likedIds) }, [likedIds])
  useEffect(() => { writeStore('answers', answerItems) }, [answerItems])
  useEffect(() => { writeStore('pending-questions', pendingItems) }, [pendingItems])
  const filtered = useMemo(() => rooms.filter(r => r.visibility === 'public' && (nav !== 'My rooms' || joined.includes(r.id)) && (topic === 'For you' || r.category === topic) && `${r.name} ${r.desc} ${r.category} ${r.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [topic, query, nav, joined])
  const toggleJoin = id => setJoined(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  const questionCards = useMemo(() => questionItems.map(item => {
    const author = demoUsers.find(user => user.id === item.authorId) || users[0]
    return { ...item, room: rooms.find(room => room.id === item.roomId)?.name || 'Community', time: item.createdAt, initials: author.initials, tone: 'bg-[#e1ebef] text-[#648391]' }
  }).filter(item => !query || `${item.title} ${item.room} ${item.body}`.toLowerCase().includes(query.toLowerCase())).filter(item => questionFilter === 'unanswered' ? item.status === 'pending' : questionFilter === 'resolved' ? item.status === 'resolved' : questionFilter === 'trending' ? item.trending : true).sort((a,b) => questionFilter === 'recent' ? String(a.createdAt).localeCompare(String(b.createdAt)) : b.upvotes - a.upvotes), [questionItems,demoUsers,query,questionFilter])
  const toggleUpvote = id => {
    if (role === 'guest') { setToast('Switch to Member to vote on questions.'); return }
    setLikedIds(list => list.includes(id) ? list.filter(item=>item!==id) : [...list,id])
    setQuestionItems(list => list.map(item => item.id === id ? { ...item, upvotes: Math.max(0,item.upvotes + (likedIds.includes(id) ? -1 : 1)) } : item))
  }
  const inviteFriend = async () => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?invite=ASKORA`
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(inviteUrl)
        setInviteState('copied')
      } else {
        const field = document.createElement('textarea')
        field.value = inviteUrl
        field.setAttribute('readonly', '')
        field.style.position = 'fixed'
        field.style.opacity = '0'
        document.body.appendChild(field)
        field.select()
        const copied = document.execCommand('copy')
        document.body.removeChild(field)
        setInviteState(copied ? 'copied' : 'ready')
      }
      window.setTimeout(() => setInviteState('idle'), 3000)
    } catch {
      // Keep the invite usable in browsers that deny clipboard access.
      setInviteState('ready')
    }
  }
  const openRoom = id => { setCurrentRoomId(id); setShowTrending(false); setAdminOpen(false); setNav('Room') }
  const openTrending = item => { setSelectedTrend(item); joinRoom(item.roomId) }
  const leaveRoom = id => { setJoined(list => list.filter(roomId => roomId !== id)); setCurrentRoomId(null); setNav('Explore') }
  const openAsk = (roomId = currentRoomId || 1) => {
    if (role === 'guest') { setToast('Switch to Member to ask questions.'); return }
    setAskRoomId(roomId)
    setAiResult(null)
    setQuestion('')
    setModal(true)
  }
  const submit = event => {
    event.preventDefault()
    if (!question.trim()) return
    const result = answerQuestion(question, Number(askRoomId), questionItems)
    setAiResult(result)
    const duplicate = result.duplicates?.some(item => item.similarity >= 0.65)
    if (result.classification === 'question' && !duplicate) {
      const newItem = { id: makeId('q'), roomId: Number(askRoomId), title: question.trim(), body: question.trim(), authorId: 'u1', createdAt: 'Just now', answers: result.status === 'answered' ? 1 : 0, status: result.status === 'unresolved' ? 'pending' : 'resolved', trending: false, upvotes: 0, tag: 'Community question' }
      setQuestionItems(items => [newItem, ...items])
      if (result.status === 'answered' && result.answerKind === 'ai') setAnswerItems(items => [{ id: makeId('ai-answer'), questionId: newItem.id, authorId: 'u5', kind: 'ai', body: result.answer, sourceIds: result.sources.map(source=>source.id), confidence: result.confidence }, ...items])
    }
    if (result.status === 'unresolved') setPendingItems(getPendingQuestions())
  }
  const joinRoom = id => {
    if (role === 'guest') { setToast('Switch to Member to join rooms.'); return }
    if (!joined.includes(id)) setJoined(list => [...list, id])
    openRoom(id)
  }
  const joinPrivateRoom = (event, code = privateCode) => {
    event.preventDefault()
    if (role === 'guest') { setToast('Switch to Member to join private rooms.'); return }
    const room = getPrivateRoom(code)
    if (!room) { setToast('That room code was not found. Check it and try again.'); return }
    if (!joined.includes(room.id)) setJoined(list => [...list, room.id])
    setPrivateModal(false)
    setPrivateCode('')
    setToast(`Joined ${room.name}`)
    openRoom(room.id)
  }
  const verifyPending = item => {
    const response = window.prompt(`Write a verified answer for: ${item.title || item.body}`)
    if (!response?.trim()) return
    setAnswerItems(list => [{ id: makeId('a'), questionId: item.id, authorId: 'u2', kind: 'verified', body: response.trim(), sourceIds: [], confidence: 1 }, ...list])
    setPendingItems(list => list.map(query => query.id === item.id ? { ...query, status: 'resolved', verifiedAnswer: response.trim() } : query))
    setNotificationItems(list => [{ id: makeId('n'), title: 'An admin answered your question', body: response.trim(), time: 'Just now', roomId: item.roomId, kind: 'verified' }, ...list])
  }
  const rejectPending = item => setPendingItems(list => list.map(query => query.id === item.id ? { ...query, status: 'rejected' } : query))
  const editAnnouncement = item => {
    const title = window.prompt('Edit announcement title', item.title)
    if (!title?.trim()) return
    const body = window.prompt('Edit announcement', item.body)
    if (!body?.trim()) return
    setAnnouncementItems(list => list.map(current => current.id === item.id ? { ...current, title: title.trim(), body: body.trim(), editedAt: 'Just now' } : current))
  }
  const removeMember = (roomId, userId) => setDemoUsers(list => list.map(user => user.id === userId ? { ...user, joinedRoomIds: user.joinedRoomIds.filter(id => id !== roomId) } : user))
  const uploadDocument = (roomId, file) => {
    if (!/\.(pdf|docx)$/i.test(file.name)) { setToast('Choose a PDF or DOCX file.'); return }
    setDocItems(list => [addMockDocument(roomId, file), ...list])
  }
  const createAnnouncement = (roomId, title, body) => setAnnouncementItems(list => [{ id: makeId('announcement'), roomId, title, body, authorId: 'u2', createdAt: 'Just now', pinned: false }, ...list])
  const changeUserRole = (userId, newRole) => setDemoUsers(list => list.map(user => user.id === userId ? { ...user, role: newRole } : user))
  const formatMembers = count => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count)

  const tiny = 'text-[9px] font-bold tracking-[1.2px] text-[#8b9183] dark:text-[#aab4a5]'
  const link = 'flex items-center gap-1.5 border-0 bg-transparent p-1 text-[10px] font-semibold text-[#77816f] hover:text-[#354a39]'
  const action = 'flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#354a39] px-3.5 text-[11px] font-semibold text-white transition hover:-translate-y-px hover:bg-[#273a2c] disabled:cursor-not-allowed disabled:opacity-50'
  return <div className="min-h-screen bg-[#fbfaf7] dark:bg-[#171a17] text-[#252923] dark:text-[#eff2eb] lg:grid lg:grid-cols-[228px_minmax(520px,1fr)_316px] xl:grid-cols-[250px_minmax(620px,1fr)_340px]">
    <aside className="sticky top-0 z-10 flex h-[58px] items-center justify-between border-b border-[#eeede8] dark:border-[#353b34] bg-[#fffefa] dark:bg-[#222720] px-4 lg:relative lg:h-screen lg:flex-col lg:items-stretch lg:border-b-0 lg:border-r lg:px-[18px] lg:py-[27px]">
      <a className="mb-0 flex items-center gap-2 text-[23px] font-extrabold tracking-[-1.2px] lg:mb-[50px] lg:ml-2" href="#top"><span className="flex h-6 w-6 -rotate-[7deg] items-center justify-center gap-0.5 rounded-lg bg-[#283a2f]"><i className="h-[11px] w-[3px] rounded bg-[#d7edb1]"/><i className="h-[15px] w-[3px] rounded bg-[#d7edb1]"/><i className="h-2 w-[3px] rounded bg-[#d7edb1]"/></span>askora<span className="-ml-2 text-[#ed8e65]">.</span></a>
      <div className="hidden lg:block"><div className={`${tiny} mb-3 px-2`}>YOUR SPACE</div><nav className="grid gap-1">{[['Explore','compass'],['My rooms','grid'],['Saved','bookmark']].map(([label,icon])=><button key={label} onClick={()=>{setNav(label);setAdminOpen(false);setShowTrending(false);setCurrentRoomId(null)}} className={`flex h-[42px] items-center gap-3 rounded-lg px-3 text-left text-[13px] ${nav===label?'bg-[#f0f2e9] dark:bg-[#354032] font-semibold text-[#334738]':'text-[#71746d] dark:text-[#b5bcb0]'}`}><Icon name={icon}/>{label}{label==='My rooms'&&joined.length>0&&<span className="ml-auto rounded-full bg-[#dce6d2] px-2 py-0.5 text-[10px]">{joined.length}</span>}</button>)}</nav>{(role==='admin'||role==='moderator')&&<button onClick={()=>{setAdminOpen(true);setCurrentRoomId(null);setShowTrending(false);setNav("Admin dashboard")}} className="mt-2 flex h-10 items-center gap-3 rounded-lg px-3 text-left text-[12px] font-semibold text-[#52664d] hover:bg-[#f0f2e9]"><Icon name="grid"/>Admin dashboard</button>}<div className={`${tiny} mb-3 mt-10 flex items-center justify-between px-2`}>YOUR ROOMS<button aria-label="Join a private room" title="Join with a room code" onClick={()=>setPrivateModal(true)}><Icon name="plus" size={15}/></button></div><div className="grid gap-1">{joined.length?rooms.filter(r=>joined.includes(r.id)).map(r=><button key={r.id} onClick={()=>openRoom(r.id)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] text-[#62675f]"><span className={`grid h-6 w-6 place-items-center rounded-lg ${r.tone}`}>{r.mark}</span>{r.name}</button>):<p className="px-2 text-[11px] leading-5 text-[#aaa99f]">Your joined rooms<br/>will show up here.</p>}</div></div>
      <div className="hidden lg:mt-auto lg:block"><div className="mb-4 rounded-xl border border-[#e9e8df] dark:border-[#3a4138] bg-[#f7f6ef] p-3.5"><span className="mb-2.5 grid h-7 w-7 place-items-center rounded-lg bg-[#e7eddc] text-[#5c7253]"><Icon name="spark" size={17}/></span><strong className="block text-[13px] leading-4">Good questions<br/>make good things.</strong><span className="mt-1 block text-[10px] text-[#8a8c83]">Invite someone curious.</span><button className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[#53684b]" onClick={inviteFriend}>{inviteState==="copied"?"Invite link copied!":inviteState==="shared"?"Invite shared":inviteState==="ready"?"Select link to copy":"Invite a friend"} <Icon name="arrow" size={14}/></button>{inviteState==="ready"&&<input aria-label="Invite link" readOnly value={`${window.location.origin}${window.location.pathname}?invite=ASKORA`} onFocus={event=>event.target.select()} className="mt-2 w-full rounded border border-[#e1e5d9] bg-[#fffefa] px-2 py-1.5 text-[9px] text-[#52664d]" />}</div><button onClick={()=>setProfileModal(true)} className="flex w-full items-center gap-2 border-t border-[#eeede8] dark:border-[#353b34] pt-3 text-left"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8b19b] text-xs font-bold">A</span><span><strong className="block text-[11px]">Alex Morgan</strong><small className="text-[9px] text-[#98998f]">Personal space</small></span><span className="ml-auto">···</span></button></div>
      <span className="text-[11px] text-[#777e72] lg:hidden">Explore · Rooms · Saved</span>
    </aside>
    <main id="top" className="min-w-0"><header className="flex h-[58px] items-center justify-between border-b border-[#eeede8] dark:border-[#353b34] px-[18px] lg:h-[67px] lg:px-11"><div className="flex items-center gap-2 text-[11px] text-[#9a9b93]">Community <Icon name="chevron" size={14}/><strong className="text-[#464b43] dark:text-[#dfe4db]">{nav}</strong></div><div className="relative flex items-center gap-3 sm:gap-4"><button onClick={()=>setDarkMode(mode=>!mode)} aria-label={darkMode?"Switch to light theme":"Switch to dark theme"} title={darkMode?"Switch to light theme":"Switch to dark theme"} className="grid h-8 w-8 place-items-center rounded-lg text-[#8a8d84] hover:bg-[#f4f3ed] dark:bg-[#30362f] dark:text-[#d3dacb] dark:hover:bg-[#343b32]">{darkMode?"☀":"☾"}</button><div className="relative"><button onClick={()=>{setNotificationsOpen(open=>!open);setProfileOpen(false)}} aria-expanded={notificationsOpen} aria-label={`Notifications${unreadCount?`, ${unreadCount} unread`:''}`} className="relative grid h-8 w-8 place-items-center rounded-lg text-[#8a8d84] hover:bg-[#f4f3ed] dark:text-[#d3dacb] dark:hover:bg-[#343b32]"><Icon name="bell"/>{unreadCount>0&&<i className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-[#fffefa] bg-[#e89572]"/>}</button>{notificationsOpen&&<section className="absolute right-0 top-11 z-30 w-[min(350px,calc(100vw-24px))] overflow-hidden rounded-xl border border-[#e9e8df] bg-[#fffefa] shadow-xl dark:border-[#3a4138] dark:bg-[#222720]"><div className="flex items-center justify-between border-b border-[#eeede8] px-4 py-3 dark:border-[#353b34]"><div><h2 className="text-[13px] font-semibold">Notifications</h2><p className="mt-0.5 text-[9px] text-[#85877f] dark:text-[#b3bab0]">{unreadCount?`${unreadCount} unread updates`:'You are all caught up'}</p></div><button onClick={()=>setReadNotifications(notificationItems.map(item=>item.id))} disabled={!unreadCount} className="text-[9px] font-semibold text-[#64785a] disabled:opacity-40 dark:text-[#b8c9a8]">Mark all read</button></div><div className="max-h-[350px] overflow-y-auto">{notificationItems.map(item=>{const isRead=readNotifications.includes(item.id);return <button key={item.id} onClick={()=>openNotification(item)} className={`flex w-full gap-3 border-b border-[#f0efe9] px-4 py-3 text-left transition hover:bg-[#f7f7f1] dark:border-[#353b34] dark:hover:bg-[#2b302a] ${isRead?'opacity-70':''}`}><span className={`mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg ${item.kind==='verified'?'bg-[#e9efdc] text-[#667c5b]':'bg-[#f5e6da] text-[#bd8662]'}`}><Icon name={item.kind==='verified'?'check':'message'} size={15}/></span><span className="min-w-0 flex-1"><strong className="block text-[10px]">{item.title}</strong><span className="mt-1 block text-[9px] leading-relaxed text-[#85877f] dark:text-[#b3bab0]">{item.body}</span><span className="mt-1.5 block text-[8px] text-[#a0a197]">{item.time}</span></span>{!isRead&&<i className="mt-1.5 h-2 w-2 flex-none rounded-full bg-[#89a77b]"/>}</button>})}</div></section>}</div><div className="relative"><button onClick={()=>{setProfileOpen(open=>!open);setNotificationsOpen(false)}} aria-expanded={profileOpen} aria-label="Open Alex Morgan profile menu" className="grid h-[31px] w-[31px] place-items-center rounded-full bg-[#e8b19b] text-[11px] font-bold text-[#593e35] ring-2 ring-transparent hover:ring-[#dce5d2]">A</button>{profileOpen&&<section className="absolute right-0 top-11 z-30 w-[230px] rounded-xl border border-[#e9e8df] bg-[#fffefa] p-2 shadow-xl dark:border-[#3a4138] dark:bg-[#222720]"><div className="flex items-center gap-2.5 border-b border-[#eeede8] px-2 pb-3 pt-1 dark:border-[#353b34]"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#e8b19b] text-xs font-bold text-[#593e35]">A</span><span><strong className="block text-[11px]">Alex Morgan</strong><small className="text-[9px] text-[#85877f] dark:text-[#b3bab0]">Personal space</small></span></div><button onClick={()=>{setProfileOpen(false);setProfileModal(true)}} className="mt-1 w-full rounded-lg px-2 py-2 text-left text-[10px] hover:bg-[#f4f3ed] dark:hover:bg-[#30362f]">View profile</button>{joined.length>0&&<button onClick={()=>{setProfileOpen(false);openRoom(joined[0])}} className="w-full rounded-lg px-2 py-2 text-left text-[10px] hover:bg-[#f4f3ed] dark:hover:bg-[#30362f]">Open {rooms.find(room=>room.id===joined[0]).name}</button>}<label className="mt-1 block px-2 text-[9px] text-[#85877f]">Demo role<select value={role} onChange={event=>{setRole(event.target.value);if(!["admin","moderator"].includes(event.target.value))setAdminOpen(false);setProfileOpen(false)}} className="mt-1 w-full rounded-md border border-[#e9e8df] bg-[#fffefa] px-2 py-1.5 text-[10px] dark:border-[#3a4138] dark:bg-[#222720]"><option value="guest">Guest</option><option value="member">Member</option><option value="moderator">Moderator</option><option value="admin">Room admin</option></select></label><button onClick={()=>{setProfileOpen(false);inviteFriend()}} className="w-full rounded-lg px-2 py-2 text-left text-[10px] hover:bg-[#f4f3ed] dark:hover:bg-[#30362f]">Copy invite link</button><button onClick={()=>{setDarkMode(mode=>!mode);setProfileOpen(false)}} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-[10px] hover:bg-[#f4f3ed] dark:hover:bg-[#30362f]">Appearance <span className="text-[9px] text-[#85877f] dark:text-[#b3bab0]">{darkMode?'Dark':'Light'}</span></button><div className="mt-1 border-t border-[#eeede8] px-2 pt-2 text-[8px] text-[#a0a197] dark:border-[#353b34]">AskOra community member</div></section>}</div></div></header>
      {currentRoomId ? <RoomView room={rooms.find(room => room.id === currentRoomId)} memberCount={formatMembers(rooms.find(room => room.id === currentRoomId).memberCount + (joined.includes(currentRoomId) ? 1 : 0))} selectedTrend={selectedTrend} roomQuestions={questionItems.filter(item=>item.roomId===currentRoomId)} roomAnnouncements={announcementItems.filter(item=>item.roomId===currentRoomId)} roomDocuments={docItems.filter(item=>item.roomId===currentRoomId)} members={demoUsers} role={role} isJoined={joined.includes(currentRoomId)} onJoin={()=>joinRoom(currentRoomId)} onRestricted={message=>setToast(message)} onBack={() => { setCurrentRoomId(null); setSelectedTrend(null); setNav("Explore") }} onLeave={() => leaveRoom(currentRoomId)} onAsk={() => openAsk(currentRoomId)} /> : showTrending ? <TrendingView onBack={() => { setShowTrending(false); setNav("Explore") }} onOpen={openTrending} /> : adminOpen ? <AdminDashboard rooms={rooms} questions={questionItems} answers={answerItems} documents={docItems} announcements={announcementItems} pending={pendingItems.filter(item=>item.status==="pending")} members={demoUsers} onVerify={verifyPending} onReject={rejectPending} onEditAnnouncement={editAnnouncement} onRemoveMember={(roomId,userId)=>removeMember(roomId,userId)} onUpload={uploadDocument} onDeleteDocument={id=>setDocItems(list=>list.filter(doc=>doc.id!==id))} onCreateAnnouncement={createAnnouncement} onDeleteAnnouncement={id=>setAnnouncementItems(list=>list.filter(item=>item.id!==id))} onRoleChange={changeUserRole} /> : <div className="mx-auto max-w-[970px] px-[18px] pb-12 pt-[30px] lg:px-11 lg:pb-16 lg:pt-[43px] xl:px-[58px]">
        <section className="flex items-center justify-between"><div><div className={`${tiny} flex items-center gap-2`}><i className="h-2 w-2 rounded-full bg-[#d1dfad] ring-4 ring-[#eef2e4]"/> A LITTLE KNOWLEDGE GOES A LONG WAY</div><h1 className="my-4 text-[27px] font-semibold leading-[1.08] tracking-[-1.5px] text-[#28342b] dark:text-[#eff2eb] sm:text-[31px] lg:text-[35px]">Find your people.<br/><span className="text-[#919783]">Figure it out together.</span></h1><p className="text-[10px] leading-[1.7] text-[#85877f] dark:text-[#b3bab0] lg:text-[11px]">A good question can take you somewhere new. Find a room,<br className="hidden sm:block"/> share what you know, and make sense of things together.</p></div><div className="relative mr-1 hidden h-[185px] w-[206px] flex-none items-center justify-center sm:flex"><div className="absolute h-[113px] w-[188px] rotate-[-29deg] rounded-[50%] border border-[#e6e8da]"/><div className="absolute h-24 w-[155px] rotate-[31deg] rounded-[50%] border border-[#e6e8da]"/><div className="z-10 grid h-[71px] w-[71px] place-items-center rounded-full bg-gradient-to-br from-[#b9c99d] to-[#819774] text-4xl text-[#fbfaf5] shadow-lg">✳</div><div className="absolute left-1 top-6 rotate-[-8deg] rounded-lg border border-[#efeee7] bg-[#fffefa] dark:bg-[#222720] p-2 text-[9px] leading-tight text-[#70786b] shadow">“ that's a<br/>great question</div><div className="absolute bottom-4 right-0 flex rotate-[5deg] items-center gap-1 rounded-lg border border-[#efeee7] bg-[#fffefa] dark:bg-[#222720] p-2 text-[9px] text-[#82735f] shadow"><Icon name="spark" size={14}/> made clearer</div></div></section>
        <section className="mt-6 flex gap-2"><label className="flex h-[46px] min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[#e9e8e1] bg-[#fffefa] dark:bg-[#222720] px-3 text-[#a1a398] shadow-sm focus-within:border-[#aebc9c] focus-within:ring-2 focus-within:ring-[#dce7d4]"><Icon name="search" size={20}/><input className="w-full bg-transparent text-[10px] text-[#424940] outline-none placeholder:text-[#a5a69f] lg:text-[11px]" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search rooms, topics, or questions..."/><kbd className="hidden rounded border border-[#ecebe5] px-1.5 py-1 text-[9px] sm:block">⌘ K</kbd></label><button className={action} onClick={()=>openAsk()}><Icon name="plus" size={17}/><span className="hidden min-[420px]:inline">Ask a question</span><span className="min-[420px]:hidden">Ask</span></button></section>
        <section className="mt-9 lg:mt-11"><div className="flex items-end justify-between"><div><div className={tiny}>A PLACE TO START</div><h2 className="mt-1 text-[17px] font-semibold tracking-tight text-[#30372f] dark:text-[#e8ece4] lg:text-[19px]">{nav==='My rooms'?'My rooms':'Explore rooms'}</h2></div><button className={link} onClick={()=>setTopic('For you')}>See all rooms <Icon name="arrow" size={15}/></button></div><div className="my-4 flex gap-1.5 overflow-x-auto pb-0.5">{topics.map(t=><button key={t} onClick={()=>setTopic(t)} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] ${topic===t?'border-[#e3e9d8] bg-[#edf1e5] dark:bg-[#354032] font-semibold text-[#42573f]':'border-transparent text-[#82847c]'}`}>{t}</button>)}</div>
          <div className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2">{filtered.length?filtered.map(r=><article key={r.id} className="flex min-h-[200px] flex-col rounded-xl border border-[#eeede7] dark:border-[#353b34] bg-[#fffefa] dark:bg-[#222720] p-3.5 transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-center justify-between"><span className={`grid h-[34px] w-[34px] place-items-center rounded-[10px] text-xl ${r.tone}`}>{r.mark}</span><span className="flex items-center gap-1 text-[9px] text-[#a1a297]"><Icon name="globe" size={13}/> Public</span></div><div className="mt-3 text-[9px] text-[#a0a095]">{r.category}</div><h3 className="my-1 text-[13px] font-bold">{r.name}</h3><p className="min-h-[30px] text-[10px] leading-[1.5] text-[#85877f] dark:text-[#b3bab0]">{r.desc}</p><div className="mt-2.5 flex flex-wrap gap-1.5">{r.tags.map(t=><span key={t} className="rounded bg-[#f4f3ed] dark:bg-[#30362f] px-1.5 py-1 text-[8px] text-[#85867c]">{t}</span>)}</div><div className="mt-auto flex items-center justify-between border-t border-[#f0efe9] dark:border-[#363c34] pt-2.5"><span className="flex items-center gap-1 text-[9px] text-[#96988e] dark:text-[#a0a99e]"><Icon name="users" size={15}/>{formatMembers(r.memberCount + (joined.includes(r.id) ? 1 : 0))} members</span><button type="button" aria-pressed={joined.includes(r.id)} aria-label={`${joined.includes(r.id) ? "Leave" : "Join"} ${r.name}`} onClick={()=>{if(!joined.includes(r.id))toggleJoin(r.id);openRoom(r.id)}} className={`flex h-[27px] items-center gap-1 rounded-md border px-2.5 text-[9px] font-semibold ${joined.includes(r.id)?'border-[#dce5d2] bg-[#edf1e7] text-[#52664d]':'border-[#e1e5d9] dark:border-[#485043] text-[#52664d]'}`}>{joined.includes(r.id)?<><Icon name="check" size={14}/> Joined</>:'Join room'}</button></div></article>):<div className="col-span-full rounded-xl border border-dashed p-7 text-center text-[11px] text-[#92948a]">No rooms found. Try another topic or search.</div>}</div>
        </section>
        <section className="mt-9 lg:mt-11"><div className="flex items-end justify-between"><div><div className={tiny}>GOOD THINGS TO GET INTO</div><h2 className="mt-1 text-[17px] font-semibold tracking-tight text-[#30372f] dark:text-[#e8ece4] lg:text-[19px]">Questions worth a look <span className="text-[#cb9d69]">✳</span></h2></div><button className={link} onClick={()=>{setShowTrending(true);setNav("Trending")}}>Browse questions <Icon name="arrow" size={15}/></button></div><div className="mt-3 flex flex-wrap gap-1.5">{[["recent","Recent"],["trending","Trending"],["unanswered","Unanswered"],["resolved","Resolved"]].map(([key,label])=><button key={key} onClick={()=>setQuestionFilter(key)} className={`rounded-full px-2.5 py-1 text-[8px] ${questionFilter===key?"bg-[#edf1e5] font-semibold text-[#52694c]":"text-[#85877f]"}`}>{label}</button>)}</div><div className="mt-3.5 border-t border-[#eeede7] dark:border-[#353b34]">{questionCards.map(q=><article key={q.title} className="flex items-center gap-2.5 border-b border-[#eeede7] dark:border-[#353b34] py-3"><span className={`grid h-[31px] w-[31px] flex-none place-items-center rounded-full text-[9px] font-bold ${q.tone}`}>{q.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5 text-[9px] text-[#a0a197] dark:text-[#9da69b]"><span className="font-semibold text-[#687361]">{q.room}</span><i className="h-[3px] w-[3px] rounded-full bg-[#c4c4bb]"/>{q.time}</div><h3 className="my-1.5 truncate text-[10px] font-semibold text-[#42473f] dark:text-[#dfe4db] lg:text-[11px]">{q.title}</h3><span className="rounded bg-[#f4f3ed] dark:bg-[#30362f] px-1.5 py-1 text-[8px] text-[#85867c]">{q.tag}</span></div><button onClick={()=>toggleUpvote(q.id)} aria-label={`Upvote question, ${q.upvotes} votes`} className={`flex items-center gap-1 text-[9px] ${likedIds.includes(q.id)?"text-[#52694c]":"text-[#85877e]"}`}>↑ {q.upvotes}</button><button onClick={()=>openRoom(q.roomId)} className="flex items-center gap-1 text-[9px] text-[#85877e]"><Icon name="message" size={15}/>{q.answers}<span className="hidden sm:inline"> answers</span></button><button aria-label="Open question" onClick={()=>openRoom(q.roomId)} className="hidden h-7 w-7 place-items-center rounded-full border border-[#eeede7] dark:border-[#353b34] text-[#90948a] sm:grid"><Icon name="arrow" size={16}/></button></article>)}</div></section>
      </div>}
    </main>
    <aside className="hidden min-h-screen flex-col border-l border-[#eeede8] dark:border-[#353b34] bg-[#fffefa] dark:bg-[#222720] px-5 py-7 lg:flex xl:px-[22px]"><div className="flex items-center justify-between text-[9px] font-bold tracking-[1px] text-[#8c9085] dark:text-[#aab4a5]"><span>YOUR DAILY DOSE</span><span className="rounded border border-[#ecebe5] px-1.5 py-1 text-[8px] tracking-normal">THU, OCT 23</span></div><section className="relative mt-4 overflow-hidden rounded-xl bg-[#344638] p-[18px] text-[#fffefa]"><div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#75876633] blur-sm"/><span className="relative grid h-[31px] w-[31px] place-items-center rounded-lg bg-white/10 text-[#e1edca]"><Icon name="spark" size={19}/></span><div className="relative mt-5 text-[8px] font-bold tracking-[1.2px] text-[#d5dfc8]">A QUESTION TO PONDER</div><h2 className="relative my-2 text-[18px] font-semibold leading-tight tracking-tight">What’s something you changed your mind about recently?</h2><p className="relative text-[10px] leading-relaxed text-[#d2d8cb]">Sometimes the best answers start with a little curiosity.</p><button onClick={()=>openAsk()} className="relative mt-4 flex h-8 items-center gap-2 rounded-md bg-[#eef1e4] px-2.5 text-[9px] font-semibold text-[#40523c]">Share your take <Icon name="arrow" size={15}/></button><div className="mt-3.5 border-t border-white/15 pt-2.5 text-[8px] text-[#c3ceb8]">✳&nbsp; 36 people are thinking about this</div></section>
      <section className="mt-7"><div className="flex items-center justify-between"><h3 className="text-[13px] font-semibold">Trending this week</h3><span className="flex items-center gap-1.5 text-[8px] font-bold tracking-wide text-[#a4a59c]"><i className="h-1.5 w-1.5 rounded-full bg-[#89a77b] ring-2 ring-[#edf2e8]"/> LIVE</span></div><div className="mt-2">{trendingQuestions.map((item,index)=><button key={item.id} onClick={()=>openTrending(item)} className="flex w-full items-center gap-2 border-b border-[#f0efe9] py-3 text-left hover:text-[#64785a]"><span className="w-4 font-serif text-[13px] text-[#c0c2b7]">0{index+1}</span><span className="grid min-w-0 flex-1 gap-1"><strong className="truncate text-[10px] font-semibold">{item.title}</strong><small className="text-[8px] text-[#9c9d94]">{item.room}</small></span><span className="flex items-center gap-1 text-[8px] text-[#a0a197]"><Icon name="message" size={13}/>{item.answers}</span></button>)}</div><button onClick={()=>{setShowTrending(true);setNav("Trending")}} className={link+" mt-2"}>See what is trending <Icon name="arrow" size={14}/></button></section>
      <section className="mt-5 flex gap-2.5 rounded-lg border border-[#edede5] bg-[#fbfaf6] dark:bg-[#262b25] p-3"><span className="grid h-6 w-6 flex-none place-items-center rounded-md bg-[#e9f0e3] text-[#6a8262]"><Icon name="check" size={16}/></span><div><span className="block text-[7px] font-bold tracking-wide text-[#90958a]">THE ASKORA PROMISE</span><strong className="mt-1 block text-[10px]">Answers with receipts.</strong><p className="mt-1 text-[8px] leading-relaxed text-[#93948a]">Helpful answers backed by real people and trusted sources.</p></div></section><footer className="mt-auto flex flex-wrap gap-3 pt-6 text-[8px] text-[#a1a197]"><a href="#about">About</a><a href="#guidelines">Guidelines</a><a href="#privacy">Privacy</a><span className="w-full">© 2025 AskOra</span></footer>
    </aside>
    {profileModal&&<div className="fixed inset-0 z-30 grid place-items-center bg-[#20271f]/45 p-5 backdrop-blur-sm" onMouseDown={event=>{if(event.target===event.currentTarget)setProfileModal(false)}}><section role="dialog" aria-modal="true" aria-labelledby="profile-title" className="relative w-full max-w-[380px] rounded-2xl border border-[#e9e8df] bg-[#fffefa] p-6 shadow-2xl dark:border-[#3a4138] dark:bg-[#222720]"><button aria-label="Close profile" onClick={()=>setProfileModal(false)} className="absolute right-4 top-4 text-[#989a90]"><Icon name="close"/></button><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e8b19b] text-lg font-bold text-[#593e35]">A</span><h2 id="profile-title" className="mt-3 text-center text-lg font-semibold">Alex Morgan</h2><p className="text-center text-[10px] text-[#85877f] dark:text-[#b3bab0]">Curious community member · Joined October 2025</p><div className="mt-5 rounded-xl bg-[#f4f3ed] p-3 dark:bg-[#30362f]"><div className="text-[9px] font-bold tracking-wide text-[#8b9183]">YOUR ASKORA ACTIVITY</div><div className="mt-2 flex justify-between text-[10px]"><span>Rooms joined</span><strong>{joined.length}</strong></div><div className="mt-1.5 flex justify-between text-[10px]"><span>Notifications</span><strong>{unreadCount} unread</strong></div></div><div className="mt-4"><div className="text-[9px] font-bold tracking-wide text-[#8b9183]">INTERESTS</div><div className="mt-2 flex flex-wrap gap-1.5">{['AI & technology','Design','Learning','Career growth'].map(interest=><span key={interest} className="rounded-full bg-[#f4f3ed] px-2.5 py-1 text-[9px] text-[#72786d] dark:bg-[#30362f] dark:text-[#c2c9bd]">{interest}</span>)}</div></div><button onClick={()=>setProfileModal(false)} className="mt-5 w-full rounded-lg bg-[#354a39] py-2.5 text-[10px] font-semibold text-white hover:bg-[#273a2c]">Done</button></section></div>}    {privateModal&&<PrivateRoomDialog onClose={()=>setPrivateModal(false)} onJoin={(event,code)=>joinPrivateRoom(event,code)}/>}
    {modal&&<AskDialog rooms={rooms} joined={joined} roomId={askRoomId} setRoomId={setAskRoomId} question={question} setQuestion={setQuestion} result={aiResult} onSubmit={submit} onClose={()=>{setModal(false);setAiResult(null)}}/>}
    {toast&&<div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#283a2f] px-4 py-3 text-[10px] font-medium text-white shadow-xl">{toast}<button aria-label="Dismiss" onClick={()=>setToast('')} className="ml-3 text-white/70">×</button></div>}
  </div>
}
export default App













































