import { announcements, documents, mockNotifications, questions, rooms, users } from '../data/mockData'
import { makeId, readStore, writeStore } from './storage'

export const getJoinedRooms = () => readStore('joined-rooms', [1, 7])
export const setJoinedRooms = ids => writeStore('joined-rooms', [...new Set(ids)])
export const getPrivateRoom = code => rooms.find(room => room.visibility === 'private' && room.inviteCode.toLowerCase() === code.trim().toLowerCase()) || null
export const getDocuments = () => readStore('documents', documents)
export const saveDocuments = value => writeStore('documents', value)
export const getAnnouncements = () => readStore('announcements', announcements)
export const saveAnnouncements = value => writeStore('announcements', value)
export const getPendingQuestions = () => readStore('pending-questions', questions.filter(item => item.status === 'pending'))
export const savePendingQuestions = value => writeStore('pending-questions', value)
export const getNotifications = () => readStore('notifications', mockNotifications)
export const saveNotifications = value => writeStore('notifications', value)
export const getMembers = roomId => users.filter(user => user.joinedRoomIds.includes(roomId))
export const addMockDocument = (roomId, file) => ({ id: makeId('doc'), roomId, name: file.name, type: file.name.toLowerCase().endsWith('.docx') ? 'DOCX' : 'PDF', size: file.size < 1_000_000 ? `${Math.max(1, Math.round(file.size / 1000))} KB` : `${(file.size / 1_000_000).toFixed(1)} MB`, uploadedAt: new Date().toLocaleDateString(), status: 'Indexed (mock)' })

