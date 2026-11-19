import { answers, documents, questions } from '../data/mockData'
import { makeId, readStore, writeStore } from './storage'

const questionText = value => value.trim().toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ')
const terms = value => new Set(questionText(value).split(' ').filter(word => word.length > 2))

export function classifyQuestion(value) {
  const text = questionText(value)
  if (!text || /^(hi|hello|hey|good morning|thanks|thank you)[!. ]*$/.test(text)) return 'casual'
  if (text.length < 9 || !/[?]|^(how|what|when|where|why|who|which|can|could|does|do|is|are|will|should)\b/.test(value.trim().toLowerCase())) return 'unclear'
  return 'question'
}

export function findQuestionMatches(value, roomId, questionData = questions) {
  const incoming = terms(value)
  return questionData.filter(item => !roomId || item.roomId === roomId).map(item => {
    const existing = terms(`${item.title} ${item.body}`)
    const common = [...incoming].filter(word => existing.has(word)).length
    return { ...item, similarity: common / Math.max(1, new Set([...incoming, ...existing]).size) }
  }).filter(item => item.similarity >= 0.24).sort((a, b) => b.similarity - a.similarity)
}

export function answerQuestion(value, roomId, questionData = questions) {
  const kind = classifyQuestion(value)
  const duplicates = findQuestionMatches(value, roomId, questionData).slice(0, 3)
  if (kind !== 'question') return { status: kind, classification: kind, answer: kind === 'casual' ? 'That sounds like a conversation starter. Ask a how, what, or why question and I’ll search this room’s knowledge.' : 'Could you add a little more detail or phrase that as a question? I can search the room knowledge once I understand what you need.', confidence: 0, sources: [], duplicates }
  const exact = duplicates.find(item => item.similarity >= 0.65)
  if (exact) {
    const existingAnswer = answers.find(item => item.questionId === exact.id)
    return { status: 'duplicate', classification: kind, answer: `This looks similar to an existing question: “${exact.title}”. ${existingAnswer?.body || 'Open the discussion to see what the community has shared.'}`, confidence: exact.similarity, sources: existingAnswer?.sourceIds.map(id => documents.find(doc => doc.id === id)).filter(Boolean) || [], duplicates }
  }
  const relevant = roomId ? documents.filter(doc => doc.roomId === roomId) : documents
  const match = answers.find(item => {
    const sourceMatch = item.sourceIds.some(id => relevant.some(doc => doc.id === id))
    const sourceQuestion = questions.find(q => q.id === item.questionId)
    const overlap = sourceQuestion ? findQuestionMatches(value, sourceQuestion.roomId).find(q => q.id === sourceQuestion.id)?.similarity || 0 : 0
    return sourceMatch && overlap >= 0.12
  })
  if (match) return { status: 'answered', classification: kind, answer: match.body, confidence: match.confidence, answerKind: match.kind, sources: match.sourceIds.map(id => documents.find(doc => doc.id === id)).filter(Boolean), duplicates }
  const pending = readStore('pending-questions', [])
  const item = { id: makeId('pending'), roomId: roomId || 1, title: value.trim(), body: value.trim(), status: 'pending', createdAt: new Date().toLocaleString(), authorId: 'u1', sourceIds: [] }
  writeStore('pending-questions', [item, ...pending])
  return { status: 'unresolved', classification: kind, answer: 'I couldn’t find enough evidence in this room’s documents or verified answers. I’ve sent this question to a room admin for a reliable answer.', confidence: 0.18, sources: [], duplicates, pendingId: item.id }
}

export function getQuestionStats() {
  const pending = readStore('pending-questions', []).filter(item => item.status === 'pending')
  return { total: questions.length + readStore('pending-questions', []).length, pending: pending.length, aiResolved: answers.filter(item => item.kind === 'ai').length, verified: answers.filter(item => item.kind === 'verified').length }
}


