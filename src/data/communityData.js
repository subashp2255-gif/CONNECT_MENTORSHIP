export const blogSeed = [
  {
    id: 'b1',
    title: 'How I Cracked My First Product Interview',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    body: '## Start with fundamentals\nFocus on DSA and communication.\n\n## Mock interviews\nPractice with peers weekly.',
    tags: ['Interview', 'DSA'],
    authorId: 'm1',
    authorName: 'Arjun Sharma',
    createdAt: new Date().toISOString(),
    likes: 4,
    likedBy: [],
    bookmarkedBy: []
  }
];

export const resourcesSeed = [
  { id: 'r1', title: 'React Interview PDF', description: 'Most asked React questions.', type: 'PDF', url: 'https://example.com/react.pdf', mentorName: 'Priya Patel' },
  { id: 'r2', title: 'Roadmap to Backend', description: 'Stepwise backend roadmap.', type: 'Roadmap', url: 'https://example.com/backend-roadmap', mentorName: 'Rahul Verma' },
  { id: 'r3', title: 'Resume Template', description: 'ATS-friendly template.', type: 'Template', url: 'https://example.com/template', mentorName: 'Neha Gupta' },
  { id: 'r4', title: 'System Design Workshop', description: 'Recorded workshop.', type: 'Video', url: 'https://example.com/system-design-video', mentorName: 'Tara Nair' }
];

export const eventsSeed = [
  { id: 'e1', title: 'Live Mock Interview Marathon', host: 'Arjun Sharma', dateTime: new Date(Date.now() + 3 * 86400000).toISOString(), maxSeats: 100, rsvps: 78, description: 'Group mock interview with live feedback.' },
  { id: 'e2', title: 'Build your Resume Workshop', host: 'Priya Patel', dateTime: new Date(Date.now() + 6 * 86400000).toISOString(), maxSeats: 60, rsvps: 44, description: 'Hands-on resume teardown session.' },
  { id: 'e3', title: 'Past: Career Switch AMA', host: 'Tara Nair', dateTime: new Date(Date.now() - 10 * 86400000).toISOString(), maxSeats: 80, rsvps: 80, description: 'Q&A on branch and career switches.' }
];

export const storiesSeed = [
  {
    id: 's1',
    menteeName: 'Ravi Kumar',
    mentorName: 'Arjun Sharma',
    before: 'No interview confidence',
    after: 'Cracked SDE internship',
    quote: 'Mentorship turned my prep into a plan.',
    tags: ['Got a job', 'Confidence']
  },
  {
    id: 's2',
    menteeName: 'Naina Mathur',
    mentorName: 'Gauri Sen',
    before: 'No portfolio',
    after: 'Built and shipped 2 products',
    quote: 'Weekly check-ins kept me accountable.',
    tags: ['Launched startup', 'Portfolio']
  }
];
