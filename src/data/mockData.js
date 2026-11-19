export const topics = ['For you', 'Technology', 'Design', 'Career', 'Science', 'Campus life', 'Academics', 'Placements']

export const rooms = [
  { id: 1, name: 'The AI Lab', category: 'Technology', desc: 'A curious corner for builders, researchers, and everyone exploring what comes next.', memberCount: 12840, mark: '✳', tone: 'bg-[#e9efdc] dark:bg-[#364233] text-[#74895e]', tags: ['Artificial intelligence', 'Machine learning'], visibility: 'public', activity: 'Active 4 min ago', adminId: 'u3' },
  { id: 2, name: 'Design Commons', category: 'Design', desc: 'Thoughtful conversations about making digital things feel a little more human.', memberCount: 8430, mark: '◒', tone: 'bg-[#f5e6da] text-[#bd8662]', tags: ['Product design', 'Inspiration'], visibility: 'public', activity: 'Active 12 min ago', adminId: 'u4' },
  { id: 3, name: 'Career Kitchen', category: 'Career', desc: 'Trade notes, ask the awkward questions, and figure out your next move together.', memberCount: 6210, mark: '↗', tone: 'bg-[#eeebf6] text-[#897da9]', tags: ['Early careers', 'Work life'], visibility: 'public', activity: 'Active 20 min ago', adminId: 'u3' },
  { id: 4, name: 'Curious Minds', category: 'Science', desc: 'Big questions, little discoveries, and the joy of learning out loud.', memberCount: 4730, mark: '☼', tone: 'bg-[#f3efcf] text-[#a39a55]', tags: ['Space', 'Everyday science'], visibility: 'public', activity: 'Active 35 min ago', adminId: 'u3' },
  { id: 5, name: 'Campus Connect', category: 'Campus life', desc: 'A helpful space for student life, shared notes, and finding your people.', memberCount: 3160, mark: '⌂', tone: 'bg-[#e2edf1] text-[#678d9d]', tags: ['Student life', 'Study groups'], visibility: 'public', activity: 'Active 1 hr ago', adminId: 'u3' },
  { id: 6, name: 'Build in Public', category: 'Technology', desc: 'Show your work, get kind feedback, and learn from the process.', memberCount: 2940, mark: '⌘', tone: 'bg-[#f2e2e8] text-[#b07c92]', tags: ['Indie makers', 'Startups'], visibility: 'public', activity: 'Active 2 hrs ago', adminId: 'u4' },
  { id: 7, name: 'MAIT Academic Updates', category: 'Academics', desc: 'Official academic notices, exam schedules, and campus updates for MAIT students.', memberCount: 1860, mark: '⌂', tone: 'bg-[#e2edf1] text-[#678d9d]', tags: ['MAIT', 'Notices'], visibility: 'public', activity: 'Active 8 min ago', adminId: 'u2' },
  { id: 8, name: 'Computer Science & Engineering', category: 'Academics', desc: 'Coursework, labs, study groups, and advice for CSE students.', memberCount: 1240, mark: '⌘', tone: 'bg-[#e9efdc] text-[#74895e]', tags: ['CSE', 'Coursework'], visibility: 'public', activity: 'Active 18 min ago', adminId: 'u2' },
  { id: 9, name: 'Placement Preparation', category: 'Career', desc: 'Interview practice, company experiences, and placement preparation.', memberCount: 982, mark: '↗', tone: 'bg-[#eeebf6] text-[#897da9]', tags: ['Interviews', 'Placements'], visibility: 'public', activity: 'Active 30 min ago', adminId: 'u2' },
  { id: 10, name: 'Data Structures & Algorithms', category: 'Technology', desc: 'Practice problems and explain your approach with fellow developers.', memberCount: 3210, mark: '⌘', tone: 'bg-[#f3efcf] text-[#a39a55]', tags: ['DSA', 'Interview prep'], visibility: 'public', activity: 'Active 6 min ago', adminId: 'u4' },
  { id: 11, name: 'SIH 2026 Team', category: 'Campus life', desc: 'Private working space for the Smart India Hackathon 2026 team.', memberCount: 18, mark: '✳', tone: 'bg-[#f5e6da] text-[#bd8662]', tags: ['SIH 2026', 'Team'], visibility: 'private', inviteCode: 'SIH2026', activity: 'Active 3 min ago', adminId: 'u2' },
  { id: 12, name: 'CSE Faculty & HOD', category: 'Academics', desc: 'Department announcements and verified academic guidance.', memberCount: 42, mark: '⌂', tone: 'bg-[#e2edf1] text-[#678d9d]', tags: ['Private', 'Department'], visibility: 'private', inviteCode: 'CSEHOD', activity: 'Active today', adminId: 'u2' },
]

export const users = [
  { id: 'u1', name: 'Alex Morgan', initials: 'A', role: 'member', title: 'Student · CSE', joinedRoomIds: [1, 7] },
  { id: 'u2', name: 'Dr. Anita Rao', initials: 'AR', role: 'admin', title: 'Room admin · MAIT', joinedRoomIds: [7, 8, 9, 11, 12] },
  { id: 'u3', name: 'Sam Rivera', initials: 'SR', role: 'moderator', title: 'Community moderator', joinedRoomIds: [1, 3, 4] },
  { id: 'u4', name: 'Nina Park', initials: 'NP', role: 'member', title: 'Product designer', joinedRoomIds: [2, 6, 10] },
]

export const questions = [
  { id: 'q1', roomId: 1, title: 'What should I learn first to build my own AI project?', body: 'I know some Python and want to make something useful. Should I start with a model API or learn the fundamentals first?', authorId: 'u1', createdAt: '12 min ago', answers: 18, status: 'resolved', trending: true, upvotes: 24, tag: 'Getting started' },
  { id: 'q2', roomId: 2, title: 'How do you make a portfolio stand out without years of experience?', body: 'I am putting together my first product design portfolio. What makes a case study memorable?', authorId: 'u4', createdAt: '38 min ago', answers: 24, status: 'resolved', trending: true, upvotes: 31, tag: 'Portfolio' },
  { id: 'q3', roomId: 3, title: 'What is one thing you wish you knew in your first job?', body: 'Looking for honest advice from people who have been there.', authorId: 'u1', createdAt: '1 hr ago', answers: 42, status: 'resolved', trending: true, upvotes: 19, tag: 'Work life' },
  { id: 'q4', roomId: 7, title: 'When will the odd semester exam timetable be published?', body: 'Trying to plan travel home after exams.', authorId: 'u1', createdAt: '22 min ago', answers: 0, status: 'pending', trending: false, upvotes: 8, tag: 'Exams' },
  { id: 'q5', roomId: 8, title: 'Is the DBMS lab submission due this Friday?', body: 'I heard two different dates from my classmates. Can someone confirm?', authorId: 'u4', createdAt: '45 min ago', answers: 0, status: 'pending', trending: false, upvotes: 5, tag: 'Coursework' },
  { id: 'q6', roomId: 9, title: 'How should I prepare for a DSA interview in 30 days?', body: 'I can study two hours a day. What topics should I prioritize?', authorId: 'u1', createdAt: '2 hrs ago', answers: 7, status: 'resolved', trending: true, upvotes: 14, tag: 'Interview prep' },
  { id: 'q7', roomId: 1, title: 'What is the attendance policy for the AI elective?', body: 'Does the department require 75% attendance for this course?', authorId: 'u1', createdAt: 'Today', answers: 0, status: 'pending', trending: false, upvotes: 2, tag: 'Course policy' },
]

export const answers = [
  { id: 'a1', questionId: 'q1', authorId: 'u3', kind: 'verified', body: 'Start with a small project that solves a real problem for you. Use an existing model API to get a working prototype, then learn the fundamentals behind the parts you used.', sourceIds: ['d1'], confidence: 0.94 },
  { id: 'a2', questionId: 'q2', authorId: 'u4', kind: 'community', body: 'Make your decisions visible. Show the problem, what you tried, what changed after feedback, and what you learned.', sourceIds: [], confidence: 0.76 },
  { id: 'a3', questionId: 'q3', authorId: 'u3', kind: 'community', body: 'Ask for context early, write down decisions, and protect time to learn. Small habits make the first year much easier.', sourceIds: [], confidence: 0.71 },
  { id: 'a4', questionId: 'q6', authorId: 'u4', kind: 'verified', body: 'Prioritize arrays, strings, hashing, trees, and graph traversal. Solve one timed problem daily and review mistakes.', sourceIds: ['d3'], confidence: 0.91 },
]

export const documents = [
  { id: 'd1', roomId: 1, name: 'AI Lab Getting Started Guide.pdf', type: 'PDF', size: '1.8 MB', uploadedAt: 'Oct 12, 2026', status: 'Indexed (mock)' },
  { id: 'd2', roomId: 7, name: 'MAIT Academic Calendar 2026-27.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: 'Oct 20, 2026', status: 'Indexed (mock)' },
  { id: 'd3', roomId: 9, name: 'Placement Preparation Handbook.docx', type: 'DOCX', size: '846 KB', uploadedAt: 'Oct 18, 2026', status: 'Indexed (mock)' },
  { id: 'd4', roomId: 8, name: 'CSE Lab Submission Guidelines.pdf', type: 'PDF', size: '620 KB', uploadedAt: 'Oct 21, 2026', status: 'Indexed (mock)' },
]

export const announcements = [
  { id: 'an1', roomId: 7, title: 'Odd semester registration window', body: 'Course registration closes on November 24. Contact your faculty advisor if you need to change an elective.', authorId: 'u2', createdAt: 'Nov 16, 2026', pinned: true },
  { id: 'an2', roomId: 11, title: 'SIH internal review on Friday', body: 'Please add your latest prototype notes to the team folder before 5 PM Thursday.', authorId: 'u2', createdAt: 'Nov 17, 2026', pinned: true },
  { id: 'an3', roomId: 1, title: 'Community project showcase', body: 'Share a short demo of what you have been building this month.', authorId: 'u3', createdAt: 'Nov 14, 2026', pinned: false },
]

export const roomDiscussions = [
  { id: 'q1', name: 'Maya Chen', initials: 'MC', age: '18 min ago', title: questions[0].title, body: questions[0].body, replies: 8, tone: 'bg-[#f5e6da] text-[#bd8662]' },
  { id: 'q8', name: 'Dev Patel', initials: 'DP', age: '42 min ago', title: 'A good beginner roadmap for building with AI', body: 'Start with a small problem you care about. Try an existing API first, then learn what is happening under the hood as you build.', replies: 12, tone: 'bg-[#e2edf1] text-[#678d9d]' },
  { id: 'q9', name: 'Rina Sato', initials: 'RS', age: '2 hr ago', title: 'Share your favorite learning resources', body: 'I collected a few free courses and practical tutorials that helped me get unstuck. Add your favorites below.', replies: 6, tone: 'bg-[#eeebf6] text-[#897da9]' },
]

export const trendingQuestions = [
  { id: 'q10', title: 'Will AI change how we learn?', room: 'The AI Lab', roomId: 1, answers: '2.4k', summary: 'Members are sharing how AI tools are changing study habits, research, and the way people learn new skills.' },
  { id: 'q2', title: questions[1].title, room: 'Design Commons', roomId: 2, answers: '1.8k', summary: 'Designers are comparing the small details and storytelling choices that help a portfolio stay with you.' },
  { id: 'q11', title: 'Is a career pivot ever too late?', room: 'Career Kitchen', roomId: 3, answers: '986', summary: 'People from different career stages are sharing practical advice on making a thoughtful change.' },
  { id: 'q6', title: questions[5].title, room: 'Placement Preparation', roomId: 9, answers: '742', summary: 'A focused community plan for preparing for technical interviews.' },
]

export const mockNotifications = [
  { id: 'n1', title: 'New answer in The AI Lab', body: 'Dev Patel replied to your AI project question.', time: '8 min ago', roomId: 1, kind: 'reply' },
  { id: 'n2', title: 'A verified answer was added', body: 'Placement Preparation has a verified interview guide.', time: '1 hr ago', roomId: 9, kind: 'verified' },
  { id: 'n3', title: 'Room invitation: SIH 2026 Team', body: 'Dr. Anita Rao invited you to join the team room.', time: 'Yesterday', roomId: 11, kind: 'invite' },
  { id: 'n4', title: 'New academic announcement', body: 'MAIT Academic Updates posted the registration window.', time: 'Yesterday', roomId: 7, kind: 'announcement' },
]
