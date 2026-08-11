import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mentees, mentors as mockMentors, sessions as mockSessions, reviews as mockReviews } from '../data/mockData';
import { blogSeed, eventsSeed, resourcesSeed, storiesSeed } from '../data/communityData';

const makeEmail = (name) => {
  const clean = name.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/\s+/g, '.');
  return clean ? `${clean}@example.com` : 'user@example.com';
};

const seedUsers = () => {
  const seededAdmins = [
    {
      id: 'admin-1',
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'adminpassword123',
      role: 'admin',
      accountStatus: 'active',
      isVerified: true,
      createdAt: '2026-07-11T12:00:00.000Z'
    }
  ];

  const seededMentees = mentees.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email || makeEmail(m.name),
    password: 'password123',
    role: 'mentee',
    accountStatus: 'active',
    isVerified: true,
    avatar: m.avatar,
    college: m.college,
    branch: m.branch,
    year: m.year,
    goals: m.goals || [],
    createdAt: '2026-07-01T12:00:00.000Z'
  }));

  const seededMentors = mockMentors.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email || makeEmail(m.name),
    password: 'password123',
    role: 'mentor',
    jobRole: m.role,
    accountStatus: 'active',
    isVerified: true,
    approvalStatus: 'Approved',
    avatar: m.avatar,
    college: m.college,
    branch: m.branch,
    year: m.year,
    company: m.company,
    skills: m.skills,
    bio: m.bio,
    rating: m.rating,
    totalSessions: m.totalSessions,
    responseRate: m.responseRate,
    linkedin: m.linkedin,
    sessionTypes: m.sessionTypes,
    isAvailable: m.isAvailable,
    createdAt: '2026-07-01T12:00:00.000Z'
  }));

  const pendingMentors = [
    {
      id: 'm-pending-1',
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      password: 'password123',
      role: 'mentor',
      jobRole: 'SDE 1',
      accountStatus: 'active',
      isVerified: false,
      approvalStatus: 'Pending',
      avatar: 'https://ui-avatars.com/api/?name=Rohan+Sharma&background=7c3aed&color=fff&size=200',
      college: 'IIT Delhi',
      branch: 'CSE',
      year: 'Alumni',
      company: 'Amazon',
      skills: ['React', 'Node.js', 'DSA'],
      bio: 'Excited to mentor students in basic frontend technologies and preparation guidelines.',
      rating: 0,
      totalSessions: 0,
      responseRate: 100,
      linkedin: 'https://linkedin.com/in/rohan-mock',
      github: 'https://github.com/rohan-mock',
      portfolio: 'https://rohan.dev',
      sessionTypes: ['Career Chat', 'Resume Review'],
      isAvailable: true,
      verificationDocuments: ['Resume_Rohan.pdf', 'ID_Card.jpg'],
      createdAt: '2026-07-11T10:00:00.000Z'
    },
    {
      id: 'm-pending-2',
      name: 'Ananya Goel',
      email: 'ananya.goel@example.com',
      password: 'password123',
      role: 'mentor',
      jobRole: 'Data Scientist',
      accountStatus: 'active',
      isVerified: false,
      approvalStatus: 'Pending',
      avatar: 'https://ui-avatars.com/api/?name=Ananya+Goel&background=7c3aed&color=fff&size=200',
      college: 'BITS Pilani',
      branch: 'Electrical',
      year: 'Alumni',
      company: 'Microsoft',
      skills: ['Python', 'Machine Learning', 'SQL'],
      bio: 'Machine learning practitioner passionate about guiding data science aspirants.',
      rating: 0,
      totalSessions: 0,
      responseRate: 100,
      linkedin: 'https://linkedin.com/in/ananya-mock',
      github: 'https://github.com/ananya-mock',
      sessionTypes: ['Career Chat'],
      isAvailable: true,
      verificationDocuments: ['Ananya_CV.pdf'],
      createdAt: '2026-07-11T10:30:00.000Z'
    }
  ];

  return [...seededAdmins, ...seededMentees, ...seededMentors, ...pendingMentors];
};

const seedReports = () => [
  {
    id: 'rep-1',
    reporterId: 'u2',
    reportedUserId: 'm3',
    targetType: 'user',
    targetId: 'm3',
    reason: 'Spam',
    description: 'Mentor is advertising paid bootcamps and external courses during mock sessions.',
    evidenceUrl: '',
    status: 'Open',
    createdAt: '2026-07-10T15:00:00.000Z',
    resolvedAt: null
  },
  {
    id: 'rep-2',
    reporterId: 'u1',
    reportedUserId: 'm5',
    targetType: 'session',
    targetId: 's3',
    reason: 'Harassment',
    description: 'The mentor behaved inappropriately during the video interview call.',
    evidenceUrl: 'https://evidence-storage.s3.amazonaws.com/report-evidence-s3.jpg',
    status: 'Under Review',
    createdAt: '2026-07-11T08:00:00.000Z',
    resolvedAt: null
  },
  {
    id: 'rep-3',
    reporterId: 'u3',
    reportedUserId: 'm2',
    targetType: 'review',
    targetId: 'r3',
    reason: 'Inappropriate content',
    description: 'This review contains offensive language.',
    evidenceUrl: '',
    status: 'Resolved',
    resolutionNote: 'Removed offensive text from comments.',
    createdAt: '2026-07-09T10:00:00.000Z',
    resolvedAt: '2026-07-10T09:00:00.000Z'
  }
];

const initialFilters = { skills: [], companies: [], colleges: [], sessionTypes: [] };
const initialBookingData = {
  mentorId: null,
  sessionType: '',
  duration: 30,
  date: null,
  timeSlot: '',
  message: ''
};

export const useStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoggedIn: false,
      role: 'mentee',
      themeMode: 'dark',
      onboardingCompleted: false,
      onboarding: {
        role: '',
        skills: [],
        interests: [],
        availability: {}
      },
      activeFilters: initialFilters,
      searchQuery: '',
      mentorList: [],
      savedMentorIds: [],
      blockedMentorIds: [],
      selectedMentor: null,
      bookingStep: 0,
      bookingData: initialBookingData,
      sessions: mockSessions,
      reviews: [],
      postFeedbackModalSessionId: null,
      feedbackResponses: [],
      blogPosts: blogSeed,
      resources: resourcesSeed,
      events: eventsSeed,
      stories: storiesSeed,
      reports: seedReports(),
      users: seedUsers(),
      auditLogs: [],
      waitlists: {},
      goals: [
        {
          id: 'g-1',
          mentorId: 'm1',
          menteeId: 'u1',
          title: 'Learn React Basics',
          description: 'Complete the basic React concepts and build a mini project.',
          priority: 'High',
          status: 'In Progress',
          startDate: '2026-07-01T00:00:00.000Z',
          targetDate: '2026-07-30T00:00:00.000Z',
          progress: 40,
          mentorFeedback: 'Keep up the good work! You are progressing well through the React component fundamentals.',
          isPaused: false,
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-11T12:00:00.000Z'
        },
        {
          id: 'g-2',
          mentorId: 'm1',
          menteeId: 'u1',
          title: 'Master DSA Arrays & Strings',
          description: 'Practice sliding window, two pointer techniques, and binary search.',
          priority: 'Medium',
          status: 'Overdue',
          startDate: '2026-06-01T00:00:00.000Z',
          targetDate: '2026-07-05T00:00:00.000Z',
          progress: 0,
          isPaused: false,
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z'
        },
        {
          id: 'g-3',
          mentorId: 'm1',
          menteeId: 'u1',
          title: 'System Design Fundamentals',
          description: 'Study scalability, load balancing, and database caching patterns.',
          priority: 'High',
          status: 'Under Review',
          startDate: '2026-07-01T00:00:00.000Z',
          targetDate: '2026-07-25T00:00:00.000Z',
          progress: 0,
          isPaused: false,
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-11T14:00:00.000Z'
        }
      ],
      goalTasks: [
        {
          id: 'gt-1',
          goalId: 'g-1',
          title: 'Components',
          description: 'Understand functional components and dynamic rendering.',
          orderIndex: 0,
          status: 'Approved',
          menteeNotes: 'Completed components section.',
          proofLink: 'https://github.com/ravi/react-components',
          mentorFeedback: 'Excellent understanding of functional components.',
          startedAt: '2026-07-01T09:00:00.000Z',
          submittedAt: '2026-07-02T10:00:00.000Z',
          approvedAt: '2026-07-03T11:00:00.000Z',
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-03T11:00:00.000Z'
        },
        {
          id: 'gt-2',
          goalId: 'g-1',
          title: 'Props',
          description: 'Learn prop-types and passing dynamic data down the tree.',
          orderIndex: 1,
          status: 'Approved',
          menteeNotes: 'Created props passing exercises.',
          proofLink: 'https://github.com/ravi/react-props',
          mentorFeedback: 'Good work. Clean code.',
          startedAt: '2026-07-03T09:00:00.000Z',
          submittedAt: '2026-07-04T10:00:00.000Z',
          approvedAt: '2026-07-05T11:00:00.000Z',
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-05T11:00:00.000Z'
        },
        {
          id: 'gt-3',
          goalId: 'g-1',
          title: 'State',
          description: 'Master useState and passing callback props up to parents.',
          orderIndex: 2,
          status: 'In Progress',
          startedAt: '2026-07-06T09:00:00.000Z',
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-06T09:00:00.000Z'
        },
        {
          id: 'gt-4',
          goalId: 'g-1',
          title: 'React Router',
          description: 'Configure layout routes, outlets, and link components.',
          orderIndex: 3,
          status: 'Pending',
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-01T00:00:00.000Z'
        },
        {
          id: 'gt-5',
          goalId: 'g-1',
          title: 'Build a Mini Project',
          description: 'Create a dashboard or simple app using React Hooks.',
          orderIndex: 4,
          status: 'Pending',
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-01T00:00:00.000Z'
        },
        {
          id: 'gt-21',
          goalId: 'g-2',
          title: 'Two Pointer Practice',
          description: 'Solve 5 medium array questions using two pointers.',
          orderIndex: 0,
          status: 'Pending',
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z'
        },
        {
          id: 'gt-22',
          goalId: 'g-2',
          title: 'Sliding Window Problems',
          description: 'Practice fixed and dynamic sliding window algorithms.',
          orderIndex: 1,
          status: 'Pending',
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z'
        },
        {
          id: 'gt-31',
          goalId: 'g-3',
          title: 'Scale from 0 to 10 Million Users',
          description: 'Create an architecture diagram and write dynamic trade-offs.',
          orderIndex: 0,
          status: 'Submitted',
          menteeNotes: 'Read System Design Primer and summarized routing.',
          proofLink: 'https://gist.github.com/ravi/scale-sys',
          startedAt: '2026-07-01T10:00:00.000Z',
          submittedAt: '2026-07-11T14:00:00.000Z',
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-11T14:00:00.000Z'
        }
      ],
      goalActivities: [
        { id: 'ga-1', goalId: 'g-1', userId: 'm1', activityType: 'create', message: 'Goal created by Arjun Sharma', createdAt: '2026-07-01T00:00:00.000Z' },
        { id: 'ga-2', goalId: 'g-1', taskId: 'gt-1', userId: 'u1', activityType: 'start', message: 'Ravi Kumar started Components task', createdAt: '2026-07-01T09:00:00.000Z' },
        { id: 'ga-3', goalId: 'g-1', taskId: 'gt-1', userId: 'u1', activityType: 'submit', message: 'Ravi Kumar submitted Components task', createdAt: '2026-07-02T10:00:00.000Z' },
        { id: 'ga-4', goalId: 'g-1', taskId: 'gt-1', userId: 'm1', activityType: 'approve', message: 'Arjun Sharma approved Components task', createdAt: '2026-07-03T11:00:00.000Z' },
        { id: 'ga-5', goalId: 'g-1', taskId: 'gt-2', userId: 'u1', activityType: 'start', message: 'Ravi Kumar started Props task', createdAt: '2026-07-03T09:00:00.000Z' },
        { id: 'ga-6', goalId: 'g-1', taskId: 'gt-2', userId: 'u1', activityType: 'submit', message: 'Ravi Kumar submitted Props task', createdAt: '2026-07-04T10:00:00.000Z' },
        { id: 'ga-7', goalId: 'g-1', taskId: 'gt-2', userId: 'm1', activityType: 'approve', message: 'Arjun Sharma approved Props task', createdAt: '2026-07-05T11:00:00.000Z' },
        { id: 'ga-8', goalId: 'g-1', taskId: 'gt-3', userId: 'u1', activityType: 'start', message: 'Ravi Kumar started State task', createdAt: '2026-07-06T09:00:00.000Z' },
        { id: 'ga-9', goalId: 'g-2', userId: 'm1', activityType: 'create', message: 'Goal created by Arjun Sharma', createdAt: '2026-06-01T00:00:00.000Z' },
        { id: 'ga-10', goalId: 'g-3', userId: 'm1', activityType: 'create', message: 'Goal created by Arjun Sharma', createdAt: '2026-07-01T00:00:00.000Z' },
        { id: 'ga-11', goalId: 'g-3', taskId: 'gt-31', userId: 'u1', activityType: 'start', message: 'Ravi Kumar started Scale from 0 to 10 Million Users task', createdAt: '2026-07-01T10:00:00.000Z' },
        { id: 'ga-12', goalId: 'g-3', taskId: 'gt-31', userId: 'u1', activityType: 'submit', message: 'Ravi Kumar submitted Scale from 0 to 10 Million Users task', createdAt: '2026-07-11T14:00:00.000Z' }
      ],
      conversations: [],
      availability: {},
      bannedUserIds: [],
      checklist: {
        completed: [],
        dismissed: false
      },
      dismissedNudgeUntil: null,
      notifications: [
        { id: '1', type: 'message', text: 'Arjun sent you a message', read: false, createdAt: new Date().toISOString() },
        { id: '2', type: 'system', text: 'Welcome to CoNnEcT!', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
      ],
      commandPaletteOpen: false,
      
      // Follow & Social Feed Initial State
      follows: [
        { id: 'f-1', followerId: 'u2', mentorId: 'm1', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() }
      ],
      socialPosts: [
        {
          id: 'sp-1',
          authorId: 'm1',
          title: 'Understanding React Server Components (RSC)',
          content: 'React Server Components are changing the way we build React applications. By running components exclusively on the server, we reduce the client bundle size dramatically and improve initial load times.\n\nKey advantages:\n- Zero bundle size impact\n- Direct access to backend resources/databases\n- Enhanced security for credentials and data fetching\n- Improved SEO out of the box\n\nWhat are your thoughts on shifting fully to RSCs?',
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
          tags: ['React', 'Web Development', 'AI'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-2',
          authorId: 'm2',
          title: 'Essential Math Topics for Machine Learning Beginners',
          content: 'Many students ask me if they need to master advanced calculus to start with Machine Learning. The short answer is: No, but you do need a solid foundation in a few key mathematical branches.\n\nHere are the top 3 priorities:\n1. **Linear Algebra**: Matrices, vectors, eigenvalues, and singular value decomposition.\n2. **Probability & Statistics**: Bayes theorem, distributions, and hypothesis testing.\n3. **Multivariate Calculus**: Derivatives, partial derivatives, and gradient descent.\n\nMaster these first, and coding algorithms will feel much more natural!',
          image: null,
          tags: ['Machine Learning', 'Python', 'Data Science'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-3',
          authorId: 'm3',
          title: 'How to Build a Production-Ready Node.js Backend',
          content: 'Building a Node.js API is easy, but making it production-grade requires careful architecture. Here is a quick checklist of what you should implement:\n\n- **Environment Variables**: Always use `dotenv` to store secret keys and database strings.\n- **Error Handling**: Use a centralized error middleware handler to avoid leaking stack traces.\n- **Structured Logging**: Setup a logger like Winston or Bunyan to track runtime issues.\n- **Rate Limiting**: Add `express-rate-limit` to prevent brute force and DOS attacks.\n- **Health Checks**: Expose a `/health` endpoint to monitor database connections.',
          image: null,
          tags: ['Web Development', 'Node.js', 'Backend'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-4',
          authorId: 'm4',
          title: 'My Strategy for Cracking Product-Based Placements',
          content: 'I recently cracked Flipkart, and here is exactly how I prepared:\n\n1. **Data Structures**: Solved 250+ LeetCode problems, focusing on patterns (two pointers, sliding window, backtracking, dynamic programming).\n2. **System Design**: Read Grokking the System Design and watched YouTube mock interviews.\n3. **Projects**: Built a real-time collaborative whiteboard utilizing WebSockets.\n\nConsistency is the key! Set aside 2 hours every day to practice DSA problems and review your logic.',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
          tags: ['Career Guidance', 'Interview Tips', 'DSA'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-5',
          authorId: 'm5',
          title: 'Introduction to Microservices Architecture',
          content: 'Transitioning from a monolith to microservices can be daunting. Remember these core design principles:\n\n- **Single Responsibility**: Each microservice manages one specific business subdomain.\n- **Database Per Service**: Avoid sharing databases; use APIs or event-driven queues (like Kafka) to synchronize updates.\n- **Resilience**: Implement circuit breakers (like Hystrix) to prevent system-wide cascading failures.',
          image: null,
          tags: ['System Design', 'Backend', 'Web Development'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-6',
          authorId: 'm6',
          title: 'Why TypeScript is Essential for Large Codebases',
          content: 'In large scale React codebases, dynamic typing in JavaScript can lead to runtime crashes. TypeScript solves this by introducing strict type definitions:\n\n- Catches bugs during development, not in production\n- Offers excellent autocomplete and developer productivity in VS Code\n- Acts as self-documenting code for new team members\n\nAre you using TypeScript in your student projects yet? It is highly recommended.',
          image: null,
          tags: ['React', 'Web Development'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-7',
          authorId: 'm1',
          title: 'System Design 101: Understanding Load Balancers',
          content: 'How do big platforms handle millions of concurrent requests? Load Balancers! They distribute incoming network traffic across multiple servers.\n\nTop algorithms:\n1. **Round Robin**: Sequential distribution\n2. **Least Connections**: Route to the server with the fewest active sessions\n3. **IP Hash**: Route based on client IP hash to keep sessions stateful\n\nWhere do you usually position a load balancer in your network design?',
          image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
          tags: ['System Design', 'Web Development'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-8',
          authorId: 'm2',
          title: 'A Practical Guide to Neural Networks for Beginners',
          content: 'Neural networks mimic the human brain using layers of interconnected nodes. Let us break down the basic layers:\n\n- **Input Layer**: Receives the raw features (e.g. image pixels)\n- **Hidden Layers**: Perform mathematical transformations (weighted sums + activation functions)\n- **Output Layer**: Outputs the final prediction (e.g. classification class)\n\nStart building with PyTorch or TensorFlow to see them in action!',
          image: null,
          tags: ['Machine Learning', 'AI', 'Python'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-9',
          authorId: 'm3',
          title: 'Dockerizing Your React App in 3 Simple Steps',
          content: 'Want to ensure your frontend application runs identically across everyone\'s local environments? Use Docker!\n\nStep 1: Write a `Dockerfile` specifying Node.js base image\nStep 2: Install dependencies and compile static files (`npm run build`)\nStep 3: Serve build outputs using a lightweight Nginx container\n\nThis makes deployment to AWS or GCP extremely straightforward.',
          image: null,
          tags: ['Web Development', 'Python'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 9).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-10',
          authorId: 'm4',
          title: 'Top Resume Mistakes to Avoid as a Tech Student',
          content: 'Reviewing student resumes, I notice the same common red flags:\n\n- **Lack of Impact**: Don\'t just list what you did. Use the STAR method: \'Improved API latency by 35% by implementing Redis caching.\'\n- **Too Long**: Keep it to a strict 1-page limit.\n- **Outdated Links**: Make sure your GitHub and LinkedIn profile links are working.',
          image: null,
          tags: ['Career Guidance', 'Interview Tips'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-11',
          authorId: 'm5',
          title: 'How Git Rebase Works (and Why It\'s Better Than Merge)',
          content: 'Many developers are terrified of `git rebase`, but it\'s the key to maintaining a clean, linear git commit history.\n\nUnlike `git merge` which creates a messy merge commit, `git rebase` temporarily stashes your local commits, pulls the latest changes from master, and re-applies your local commits on top. This keeps your branch history clean and simple!',
          image: null,
          tags: ['Web Development', 'Python'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 11).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 11).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-12',
          authorId: 'm6',
          title: 'Optimizing React Performance with useMemo and useCallback',
          content: 'React is fast, but unnecessary re-renders can slow down complex layouts. Here is how to optimize:\n\n- **useMemo**: Memoizes computed values so they are not re-calculated on every render.\n- **useCallback**: Memoizes callback functions so they maintain referential identity.\n\nTip: Don\'t over-use them! They carry memory overhead. Only apply when rendering complex lists or passing functions as dependencies.',
          image: null,
          tags: ['React', 'Web Development'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-13',
          authorId: 'm1',
          title: 'What is Database Sharding? Scalability Explained',
          content: 'When your database grows too large, vertical scaling (adding more RAM/CPU) reaches its limit. Database Sharding is the horizontal scaling solution:\n\n- Splits a single database into smaller, faster pieces called \'shards\'\n- Shards are distributed across separate server instances\n- Routing is based on a shard key (e.g. user_id)\n\nIt is complex but essential for handling massive datasets.',
          image: null,
          tags: ['System Design', 'Web Development'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 13).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 13).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-14',
          authorId: 'm2',
          title: 'Getting Started with Hugging Face for Natural Language Processing',
          content: 'Hugging Face has democratized AI. With just a few lines of Python, you can leverage state-of-the-art transformer models (like BERT, GPT) for sentiment analysis, text summarization, or translation.\n\nCheck out their `transformers` pipeline API—it makes integrating advanced AI models into your software applications incredibly easy.',
          image: null,
          tags: ['AI', 'Machine Learning', 'Python'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-15',
          authorId: 'm3',
          title: 'The Importance of Writing Unit Tests in Software Engineering',
          content: 'Students often neglect unit tests because they seem like extra work. But in production, unit tests are your safety net:\n\n- Prevents regressions (breaking old features when writing new ones)\n- Documents how your code is expected to behave under different edge cases\n- Simplifies refactoring and speeds up CI/CD pipelines',
          image: null,
          tags: ['Web Development', 'Python'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 15).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 15).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-16',
          authorId: 'm4',
          title: 'How to Answer the \'Tell Me About Yourself\' Interview Question',
          content: 'This is the most critical question because it sets the tone for your whole technical interview. Use this simple structure:\n\n1. **Present**: What is your current role/year in college, and what do you study?\n2. **Past**: Briefly highlight 1 or 2 past achievements or projects.\n3. **Future**: Why are you excited about this specific role/company?\n\nKeep it under 2 minutes and practice it until it flows naturally!',
          image: null,
          tags: ['Interview Tips', 'Career Guidance'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 16).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-17',
          authorId: 'm5',
          title: 'An Introduction to Event-Driven Microservices',
          content: 'In an event-driven architecture, services communicate by publishing and subscribing to events rather than direct REST API calls.\n\nBenefits:\n- **Asynchronous**: Publishers don\'t wait for subscribers to finish\n- **Loose Coupling**: Services are completely independent\n- **Scalability**: High throughput engines (like Kafka or RabbitMQ) queue up traffic seamlessly during load spikes.',
          image: null,
          tags: ['System Design', 'Web Development'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 17).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 17).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-18',
          authorId: 'm6',
          title: 'State Management in React: Redux, Zustand, or Context API',
          content: 'Choosing a state manager can be confusing. Here is my rule of thumb:\n\n- **React Context**: Best for low-frequency updates (themes, user auth info).\n- **Zustand**: Perfect for lightweight, fast, and scalable global state (like our CONNECT store!).\n- **Redux Toolkit**: Ideal for enterprise-grade apps with complex data trees and middlewares.',
          image: null,
          tags: ['React', 'Web Development'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-19',
          authorId: 'm1',
          title: 'Understanding ACID Properties in Relational Databases',
          content: 'Relational databases (SQL) guarantee data integrity using ACID transactions:\n\n- **Atomicity**: All operations in a transaction succeed, or all fail (no partial writes).\n- **Consistency**: Data matches database rules/constraints before and after.\n- **Isolation**: Concurrent transactions do not interfere.\n- **Durability**: Written data survives system crashes.',
          image: null,
          tags: ['System Design', 'Web Development'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 19).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 19).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-20',
          authorId: 'm2',
          title: 'Unsupervised vs. Supervised Machine Learning',
          content: 'What is the core difference between these two ML paradigms?\n\n- **Supervised**: Trained on labeled data (input + output). Examples: Linear Regression, Neural Network classification.\n- **Unsupervised**: Trained on unlabeled data. The algorithm finds hidden patterns/clusters. Examples: K-Means Clustering, PCA dimension reduction.',
          image: null,
          tags: ['Machine Learning', 'AI', 'Python'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-21',
          authorId: 'm3',
          title: 'A Guide to RESTful API Design Best Practices',
          content: 'Designing clean APIs makes integration a breeze for frontend developers. Remember to:\n\n- Use plural nouns for resources (e.g. `/users`, not `/getUser`)\n- Use correct HTTP verbs (`GET` for fetch, `POST` for create, `PUT` for edit, `DELETE` for remove)\n- Return standard HTTP status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found)',
          image: null,
          tags: ['Web Development', 'Python'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 21).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 21).toISOString(),
          deletedAt: null
        },
        {
          id: 'sp-22',
          authorId: 'm4',
          title: 'How to Build a Strong Github Profile to Attract Recruiters',
          content: 'As a student, your GitHub is your proof of capability. Make sure to:\n\n- Write clear `README.md` files describing what your project does, how to install it, and adding screenshots.\n- Pin your top 3 projects showcasing different tech stacks.\n- Maintain a clean commit history with descriptive commit messages.',
          image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop&q=60',
          tags: ['Career Guidance', 'Interview Tips'],
          visibility: 'public',
          createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
          deletedAt: null
        }
      ],
      socialLikes: [
        { id: 'sl-1', postId: 'sp-1', userId: 'u2', createdAt: new Date(Date.now() - 3600000 * 11).toISOString() }
      ],
      socialComments: [
        {
          id: 'sc-1',
          postId: 'sp-1',
          authorId: 'u2',
          authorRole: 'mentee',
          content: 'This explains RSC so clearly! Do you suggest learning Next.js to start with RSC, or can we use vanilla React?',
          parentId: null,
          createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          deletedAt: null
        },
        {
          id: 'sc-2',
          postId: 'sp-1',
          authorId: 'm1',
          authorRole: 'mentor',
          content: 'Great question, Ravi! Currently, framework routers like Next.js or Expo are the most production-ready ways to adopt RSCs. Writing a custom implementation from scratch is extremely complex.',
          parentId: 'sc-1',
          createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 9).toISOString(),
          deletedAt: null
        }
      ],

      // Forum Initial State
      forumPosts: [
        {
          id: 'fp-1',
          authorId: 'u1',
          title: 'How should I start learning React?',
          description: 'I know HTML, CSS and JavaScript. What concepts should I learn before starting React? Any recommendations for courses or resources?',
          categoryId: 'cat-1',
          tags: ['React', 'JavaScript', 'Frontend'],
          status: 'active',
          isSolved: true,
          acceptedAnswerId: 'fa-1',
          isPinned: true,
          isLocked: false,
          viewCount: 120,
          viewedBy: ['u1', 'm1'],
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          deletedAt: null
        },
        {
          id: 'fp-2',
          authorId: 'u2',
          title: 'Best approach to study Machine Learning for beginners?',
          description: 'I want to shift into AI/ML. What math topics are absolutely essential before coding?',
          categoryId: 'cat-2',
          tags: ['Machine Learning', 'Python', 'AI'],
          status: 'active',
          isSolved: false,
          acceptedAnswerId: null,
          isPinned: false,
          isLocked: false,
          viewCount: 45,
          viewedBy: ['u2'],
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          deletedAt: null
        }
      ],
      forumAnswers: [
        {
          id: 'fa-1',
          postId: 'fp-1',
          authorId: 'm1',
          content: 'You should master JavaScript ES6 features first (arrow functions, destructuring, map/filter, promises). Then learn basic virtual DOM concepts and component architecture.',
          isAccepted: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          deletedAt: null
        }
      ],
      forumComments: [
        {
          id: 'fc-1',
          authorId: 'u1',
          postId: 'fp-1',
          answerId: null,
          content: 'Thanks, that is very helpful! I will look into ES6 syntax first.',
          createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
          deletedAt: null
        },
        {
          id: 'fc-2',
          authorId: 'u2',
          postId: null,
          answerId: 'fa-1',
          content: 'I agree. Destructuring is crucial for handling React props.',
          createdAt: new Date(Date.now() - 3600000 * 0.2).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 0.2).toISOString(),
          deletedAt: null
        }
      ],
      forumVotes: [
        {
          id: 'fv-1',
          userId: 'u2',
          postId: 'fp-1',
          answerId: null,
          voteType: 'UPVOTE',
          createdAt: new Date().toISOString()
        },
        {
          id: 'fv-2',
          userId: 'u2',
          postId: null,
          answerId: 'fa-1',
          voteType: 'UPVOTE',
          createdAt: new Date().toISOString()
        }
      ],
      forumCategories: [
        { id: 'cat-1', name: 'Web Development', description: 'HTML, CSS, JS, React, Node, etc.', icon: 'Code2', isActive: true },
        { id: 'cat-2', name: 'Artificial Intelligence', description: 'Neural networks, Deep Learning, NLP', icon: 'BrainCircuit', isActive: true },
        { id: 'cat-3', name: 'Machine Learning', description: 'Algorithms, regression, classification', icon: 'Cpu', isActive: true },
        { id: 'cat-4', name: 'Data Science', description: 'Pandas, NumPy, data cleaning, analytics', icon: 'Database', isActive: true },
        { id: 'cat-5', name: 'Programming', description: 'Python, C++, Java, Rust, Go', icon: 'Terminal', isActive: true },
        { id: 'cat-6', name: 'UI/UX Design', description: 'Figma, prototyping, design systems', icon: 'Palette', isActive: true },
        { id: 'cat-7', name: 'Career Guidance', description: 'CV prep, mock interviews, job tracks', icon: 'Briefcase', isActive: true },
        { id: 'cat-8', name: 'Interview Preparation', description: 'Leetcode practice, System Design templates', icon: 'Compass', isActive: true },
        { id: 'cat-9', name: 'Projects', description: 'Showcase your work, get feedback, team up', icon: 'GitBranch', isActive: true },
        { id: 'cat-10', name: 'General Discussion', description: 'Chat with other members, off-topic talks', icon: 'MessagesSquare', isActive: true }
      ],
      forumTags: [
        { id: 't-1', name: 'React', usageCount: 1, createdAt: new Date().toISOString() },
        { id: 't-2', name: 'JavaScript', usageCount: 1, createdAt: new Date().toISOString() },
        { id: 't-3', name: 'Frontend', usageCount: 1, createdAt: new Date().toISOString() },
        { id: 't-4', name: 'Machine Learning', usageCount: 1, createdAt: new Date().toISOString() },
        { id: 't-5', name: 'Python', usageCount: 1, createdAt: new Date().toISOString() },
        { id: 't-6', name: 'AI', usageCount: 1, createdAt: new Date().toISOString() }
      ],
      savedPosts: [],
      followedDiscussions: [],
      forumReports: [],
      reputationTransactions: [],
      forumBlockedWords: ['spammykeyword', 'crypto-scam-link'],
      forumModerationLogs: [],

      login: (userData, roleOverride) =>
        set({
          isLoggedIn: true,
          currentUser: userData || mentees[0],
          role: roleOverride || 'mentee'
        }),
      registerNewUser: (newUser) =>
        set((state) => {
          const userWithId = {
            ...newUser,
            id: newUser.id || `${newUser.role === 'mentor' ? 'm' : 'u'}-${Date.now()}`
          };
          return {
            users: [...state.users, userWithId]
          };
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          currentUser: mentees[0],
          role: 'mentee',
          activeFilters: initialFilters,
          searchQuery: '',
          selectedMentor: null,
          bookingStep: 0,
          bookingData: initialBookingData,
          commandPaletteOpen: false
        }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setRole: (role) => set({ role }),
      completeOnboarding: (payload) =>
        set((state) => ({
          onboardingCompleted: true,
          onboarding: { ...state.onboarding, ...payload }
        })),
      setFilter: (category, value) =>
        set((state) => {
          const currentList = state.activeFilters[category];
          const newList = currentList.includes(value)
            ? currentList.filter((item) => item !== value)
            : [...currentList, value];
          return { activeFilters: { ...state.activeFilters, [category]: newList } };
        }),
      clearFilters: () => set({ activeFilters: initialFilters }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setMentorList: (mentorList) => set({ mentorList }),
      toggleSaveMentor: (mentorId) =>
        set((state) => {
          const exists = state.savedMentorIds.includes(mentorId);
          const savedMentorIds = exists
            ? state.savedMentorIds.filter((id) => id !== mentorId)
            : [...state.savedMentorIds, mentorId];
          return { savedMentorIds };
        }),
      blockMentor: (mentorId) =>
        set((state) => ({
          blockedMentorIds: state.blockedMentorIds.includes(mentorId)
            ? state.blockedMentorIds
            : [...state.blockedMentorIds, mentorId]
        })),
      unblockMentor: (mentorId) =>
        set((state) => ({
          blockedMentorIds: state.blockedMentorIds.filter((id) => id !== mentorId)
        })),
      setSelectedMentor: (mentor) => set({ selectedMentor: mentor }),
      setBookingStep: (step) => set({ bookingStep: step }),
      updateBookingData: (data) => set((state) => ({ bookingData: { ...state.bookingData, ...data } })),
      addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
      cancelSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((session) => (session.id === sessionId ? { ...session, status: 'cancelled' } : session))
        })),
      updateSessionStatus: (sessionId, status) =>
        set((state) => ({
          sessions: state.sessions.map((session) => (session.id === sessionId ? { ...session, status } : session))
        })),
      requestRefund: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, refundStatus: 'Refund Requested' } : session
          )
        })),
      finalizeRefund: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, refundStatus: 'Refunded' } : session
          )
        })),
      addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
      updateSessionRating: (sessionId, rating, feedback) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, rating, feedback, status: 'completed' } : session
          )
        })),
      openPostFeedbackModal: (sessionId) => set({ postFeedbackModalSessionId: sessionId }),
      closePostFeedbackModal: () => set({ postFeedbackModalSessionId: null }),
      submitPostFeedback: (payload) =>
        set((state) => ({
          feedbackResponses: [{ id: `fb-${Date.now()}`, ...payload }, ...state.feedbackResponses],
          postFeedbackModalSessionId: null
        })),
      createBlogPost: (post) =>
        set((state) => ({ blogPosts: [{ id: `b-${Date.now()}`, ...post, createdAt: new Date().toISOString(), likes: 0, likedBy: [], bookmarkedBy: [] }, ...state.blogPosts] })),
      updateBlogPost: (id, patch) =>
        set((state) => ({ blogPosts: state.blogPosts.map((post) => (post.id === id ? { ...post, ...patch } : post)) })),
      deleteBlogPost: (id) => set((state) => ({ blogPosts: state.blogPosts.filter((post) => post.id !== id) })),
      toggleLikePost: (id, userId) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((post) => {
            if (post.id !== id) return post;
            const liked = post.likedBy.includes(userId);
            const likedBy = liked ? post.likedBy.filter((x) => x !== userId) : [...post.likedBy, userId];
            return { ...post, likedBy, likes: likedBy.length };
          })
        })),
      toggleBookmarkPost: (id, userId) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((post) =>
            post.id !== id
              ? post
              : {
                  ...post,
                  bookmarkedBy: post.bookmarkedBy.includes(userId)
                    ? post.bookmarkedBy.filter((x) => x !== userId)
                    : [...post.bookmarkedBy, userId]
                }
          )
        })),
      rsvpEvent: (eventId, userId) =>
        set((state) => ({
          events: state.events.map((event) => {
            if (event.id !== eventId) return event;
            const attendees = event.attendees || [];
            if (attendees.includes(userId) || event.rsvps >= event.maxSeats) return event;
            return { ...event, attendees: [...attendees, userId], rsvps: event.rsvps + 1 };
          })
        })),
      addNotificationWithToast: (text, userId) => {
        get().addNotification(text, userId);
      },
      addNotification: (text, userId) =>
        set((state) => ({
          notifications: [
            { id: `n-${Date.now()}`, text, createdAt: new Date().toISOString(), read: false, userId: userId || null },
            ...state.notifications
          ]
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        })),
      markAllNotificationsRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),

      // Resources Actions
      addResource: (resource) => set(state => ({
        resources: [...state.resources, resource]
      })),
      deleteResource: (id) => set(state => ({
        resources: state.resources.filter(r => r.id !== id)
      })),
      dismissNudgeFor3Days: () =>
        set({ dismissedNudgeUntil: Date.now() + 3 * 24 * 60 * 60 * 1000 }),
      completeChecklistItem: (item) =>
        set((state) => ({
          checklist: {
            ...state.checklist,
            completed: state.checklist.completed.includes(item)
              ? state.checklist.completed
              : [...state.checklist.completed, item]
          }
        })),
      dismissChecklist: () =>
        set((state) => ({
          checklist: { ...state.checklist, dismissed: true }
        })),
      submitReport: (report) =>
        set((state) => ({
          reports: [{ id: `rep-${Date.now()}`, status: 'open', createdAt: new Date().toISOString(), ...report }, ...state.reports]
        })),
      resolveReport: (id) =>
        set((state) => ({ reports: state.reports.map((report) => (report.id === id ? { ...report, status: 'resolved' } : report)) })),
      dismissReport: (id) =>
        set((state) => ({ reports: state.reports.map((report) => (report.id === id ? { ...report, status: 'dismissed' } : report)) })),
      joinWaitlist: (mentorId, userId) =>
        set((state) => {
          const existing = state.waitlists[mentorId] || [];
          if (existing.includes(userId)) return state;
          return { waitlists: { ...state.waitlists, [mentorId]: [...existing, userId] } };
        }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      resetBooking: () =>
        set({
          bookingStep: 0,
          selectedMentor: null,
          bookingData: initialBookingData
        }),
      _verifyRole: (requiredRole) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');
        const userRole = get().role;
        if (userRole !== requiredRole) throw new Error('Unauthorized');
        return user;
      },
      _recalculateGoal: (goalId) => {
        const state = get();
        const goal = state.goals.find(g => g.id === goalId);
        if (!goal) return;
        const tasks = state.goalTasks.filter(t => t.goalId === goalId);
        
        const totalTasks = tasks.length;
        const approvedTasks = tasks.filter(t => t.status === 'Approved').length;
        const progress = totalTasks > 0 ? Math.round((approvedTasks / totalTasks) * 100) : 0;
        
        let status = goal.status;
        if (goal.isPaused) {
          status = 'Paused';
        } else if (totalTasks > 0 && tasks.every(t => t.status === 'Approved')) {
          status = 'Completed';
        } else {
          const now = new Date();
          const targetDate = new Date(goal.targetDate);
          if (now > targetDate) {
            status = 'Overdue';
          } else if (totalTasks > 0 && tasks.every(t => t.status === 'Submitted' || t.status === 'Approved') && tasks.some(t => t.status === 'Submitted')) {
            status = 'Under Review';
          } else if (tasks.some(t => ['In Progress', 'Submitted', 'Approved', 'Needs Improvement'].includes(t.status))) {
            status = 'In Progress';
          } else {
            status = 'Not Started';
          }
        }
        
        const completedAt = status === 'Completed' ? (goal.completedAt || new Date().toISOString()) : null;
        
        set((state) => ({
          goals: state.goals.map(g => g.id === goalId ? {
            ...g,
            progress,
            status,
            completedAt,
            updatedAt: new Date().toISOString()
          } : g)
        }));
        
        // Notify if goal reaches 100% progress
        if (progress === 100 && goal.progress < 100) {
          get().addNotification(`Goal "${goal.title}" reaches 100% progress!`, goal.mentorId);
        }
      },
      createGoal: (goalData) => {
        const user = get()._verifyRole('mentor');
        
        if (!goalData.title?.trim()) throw new Error('Goal title is required');
        if (!goalData.menteeId) throw new Error('Assigned mentee is required');
        if (!goalData.tasks || goalData.tasks.length === 0) throw new Error('At least one task is required');
        if (new Date(goalData.targetDate) < new Date(goalData.startDate)) {
          throw new Error('Deadline cannot be earlier than the start date');
        }
        
        const taskTitles = goalData.tasks.map(t => t.title?.trim() || '');
        if (taskTitles.some(t => !t)) throw new Error('Empty task names are not allowed');
        const hasDuplicates = new Set(taskTitles).size !== taskTitles.length;
        if (hasDuplicates) {
          throw new Error('Duplicate task names are not allowed');
        }
        
        const goalId = `g-${Date.now()}`;
        const newGoal = {
          id: goalId,
          mentorId: user.id,
          menteeId: goalData.menteeId,
          title: goalData.title,
          description: goalData.description || '',
          priority: goalData.priority || 'Medium',
          status: 'Not Started',
          startDate: goalData.startDate || new Date().toISOString(),
          targetDate: goalData.targetDate,
          progress: 0,
          isPaused: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const newTasks = goalData.tasks.map((task, index) => ({
          id: `gt-${Date.now()}-${index}`,
          goalId,
          title: task.title,
          description: task.description || '',
          orderIndex: index,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        const newActivity = {
          id: `ga-${Date.now()}-c`,
          goalId,
          userId: user.id,
          activityType: 'create',
          message: `Goal "${newGoal.title}" created by ${user.name}`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          goals: [...state.goals, newGoal],
          goalTasks: [...state.goalTasks, ...newTasks],
          goalActivities: [...state.goalActivities, newActivity]
        }));
        
        get().addNotification(`${user.name} created a new goal: "${newGoal.title}"`, newGoal.menteeId);
        get()._recalculateGoal(goalId);
        return goalId;
      },
      updateGoalDetails: (goalId, data) => {
        const user = get().currentUser;
        const goal = get().goals.find(g => g.id === goalId);
        if (!goal) throw new Error('Goal not found');
        if (goal.mentorId !== user?.id) throw new Error('Unauthorized');
        
        if (data.title && !data.title.trim()) throw new Error('Goal title is required');
        if (data.targetDate && data.startDate && new Date(data.targetDate) < new Date(data.startDate)) {
          throw new Error('Deadline cannot be earlier than the start date');
        }
        
        const updatedGoal = {
          ...goal,
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        const activities = [];
        if (data.targetDate && data.targetDate !== goal.targetDate) {
          activities.push({
            id: `ga-${Date.now()}-dl`,
            goalId,
            userId: user.id,
            activityType: 'edit_deadline',
            message: `${user.name} edited the deadline to ${new Date(data.targetDate).toLocaleDateString()}`,
            createdAt: new Date().toISOString()
          });
          get().addNotification(`${user.name} edited the deadline for "${goal.title}"`, goal.menteeId);
        }
        
        if (data.mentorFeedback !== undefined && data.mentorFeedback !== goal.mentorFeedback) {
          activities.push({
            id: `ga-${Date.now()}-fb`,
            goalId,
            userId: user.id,
            activityType: 'feedback',
            message: `${user.name} added overall goal feedback`,
            createdAt: new Date().toISOString()
          });
          get().addNotification(`${user.name} added overall feedback to "${goal.title}"`, goal.menteeId);
        }
        
        set((state) => ({
          goals: state.goals.map(g => g.id === goalId ? updatedGoal : g),
          goalActivities: [...state.goalActivities, ...activities]
        }));
        
        get()._recalculateGoal(goalId);
      },
      deleteGoal: (goalId) => {
        const user = get().currentUser;
        const goal = get().goals.find(g => g.id === goalId);
        if (!goal) throw new Error('Goal not found');
        if (goal.mentorId !== user?.id) throw new Error('Unauthorized');
        
        set((state) => ({
          goals: state.goals.filter(g => g.id !== goalId),
          goalTasks: state.goalTasks.filter(t => t.goalId !== goalId),
          goalActivities: state.goalActivities.filter(a => a.goalId !== goalId)
        }));
      },
      pauseGoal: (goalId) => {
        const user = get().currentUser;
        const goal = get().goals.find(g => g.id === goalId);
        if (!goal) throw new Error('Goal not found');
        if (goal.mentorId !== user?.id) throw new Error('Unauthorized');
        
        const activity = {
          id: `ga-${Date.now()}-pause`,
          goalId,
          userId: user.id,
          activityType: 'pause',
          message: `Goal paused by ${user.name}`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          goals: state.goals.map(g => g.id === goalId ? { ...g, isPaused: true, updatedAt: new Date().toISOString() } : g),
          goalActivities: [...state.goalActivities, activity]
        }));
        
        get()._recalculateGoal(goalId);
      },
      resumeGoal: (goalId) => {
        const user = get().currentUser;
        const goal = get().goals.find(g => g.id === goalId);
        if (!goal) throw new Error('Goal not found');
        if (goal.mentorId !== user?.id) throw new Error('Unauthorized');
        
        const activity = {
          id: `ga-${Date.now()}-resume`,
          goalId,
          userId: user.id,
          activityType: 'resume',
          message: `Goal resumed by ${user.name}`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          goals: state.goals.map(g => g.id === goalId ? { ...g, isPaused: false, updatedAt: new Date().toISOString() } : g),
          goalActivities: [...state.goalActivities, activity]
        }));
        
        get()._recalculateGoal(goalId);
      },
      addTask: (goalId, taskData) => {
        const user = get().currentUser;
        const goal = get().goals.find(g => g.id === goalId);
        if (!goal) throw new Error('Goal not found');
        if (goal.mentorId !== user?.id) throw new Error('Unauthorized');
        
        if (!taskData.title?.trim()) throw new Error('Task title is required');
        
        const siblingTasks = get().goalTasks.filter(t => t.goalId === goalId);
        if (siblingTasks.some(t => t.title.toLowerCase() === taskData.title.trim().toLowerCase())) {
          throw new Error('Duplicate task names are not allowed');
        }
        
        const newTask = {
          id: `gt-${Date.now()}`,
          goalId,
          title: taskData.title.trim(),
          description: taskData.description || '',
          orderIndex: siblingTasks.length,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const activity = {
          id: `ga-${Date.now()}-ta`,
          goalId,
          taskId: newTask.id,
          userId: user.id,
          activityType: 'create',
          message: `Task "${newTask.title}" added by ${user.name}`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          goalTasks: [...state.goalTasks, newTask],
          goalActivities: [...state.goalActivities, activity]
        }));
        
        get().addNotification(`${user.name} added a new task: "${newTask.title}" to "${goal.title}"`, goal.menteeId);
        get()._recalculateGoal(goalId);
        return newTask.id;
      },
      updateTask: (taskId, data) => {
        const user = get().currentUser;
        const task = get().goalTasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        const goal = get().goals.find(g => g.id === task.goalId);
        if (!goal) throw new Error('Goal not found');
        if (goal.mentorId !== user?.id) throw new Error('Unauthorized');
        
        const updatedTask = {
          ...task,
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          goalTasks: state.goalTasks.map(t => t.id === taskId ? updatedTask : t)
        }));
        
        get()._recalculateGoal(goal.id);
      },
      deleteTask: (taskId) => {
        const user = get().currentUser;
        const task = get().goalTasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        const goal = get().goals.find(g => g.id === task.goalId);
        if (!goal) throw new Error('Goal not found');
        if (goal.mentorId !== user?.id) throw new Error('Unauthorized');
        
        const activity = {
          id: `ga-${Date.now()}-td`,
          goalId: goal.id,
          userId: user.id,
          activityType: 'delete',
          message: `Task "${task.title}" deleted by ${user.name}`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          goalTasks: state.goalTasks.filter(t => t.id !== taskId),
          goalActivities: [...state.goalActivities, activity]
        }));
        
        get()._recalculateGoal(goal.id);
      },
      reorderTasks: (goalId, taskIds) => {
        const user = get().currentUser;
        const goal = get().goals.find(g => g.id === goalId);
        if (!goal) throw new Error('Goal not found');
        if (goal.mentorId !== user?.id) throw new Error('Unauthorized');
        
        set((state) => ({
          goalTasks: state.goalTasks.map(t => {
            if (t.goalId !== goalId) return t;
            const newIndex = taskIds.indexOf(t.id);
            return newIndex !== -1 ? { ...t, orderIndex: newIndex, updatedAt: new Date().toISOString() } : t;
          })
        }));
      },
      startTask: (taskId) => {
        const user = get()._verifyRole('mentee');
        const task = get().goalTasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        const goal = get().goals.find(g => g.id === task.goalId);
        if (goal.menteeId !== user.id) throw new Error('Unauthorized');
        
        const updatedTask = {
          ...task,
          status: 'In Progress',
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const activity = {
          id: `ga-${Date.now()}-ts`,
          goalId: goal.id,
          taskId,
          userId: user.id,
          activityType: 'start',
          message: `${user.name} started task "${task.title}"`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          goalTasks: state.goalTasks.map(t => t.id === taskId ? updatedTask : t),
          goalActivities: [...state.goalActivities, activity]
        }));
        
        get().addNotification(`${user.name} started the task: "${task.title}"`, goal.mentorId);
        get()._recalculateGoal(goal.id);
      },
      submitTask: (taskId, { menteeNotes, proofLink }) => {
        const user = get()._verifyRole('mentee');
        
        if (proofLink && !proofLink.startsWith('http://') && !proofLink.startsWith('https://')) {
          throw new Error('Proof link must be a valid URL starting with http:// or https://');
        }
        
        const task = get().goalTasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        const goal = get().goals.find(g => g.id === task.goalId);
        if (goal.menteeId !== user.id) throw new Error('Unauthorized');
        
        const isResubmission = task.status === 'Needs Improvement';
        const updatedTask = {
          ...task,
          status: 'Submitted',
          menteeNotes,
          proofLink,
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const activity = {
          id: `ga-${Date.now()}-sub`,
          goalId: goal.id,
          taskId,
          userId: user.id,
          activityType: isResubmission ? 'resubmit' : 'submit',
          message: `${user.name} ${isResubmission ? 'resubmitted' : 'submitted'} task "${task.title}"`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          goalTasks: state.goalTasks.map(t => t.id === taskId ? updatedTask : t),
          goalActivities: [...state.goalActivities, activity]
        }));
        
        const actionText = isResubmission ? 'resubmitted' : 'submitted';
        get().addNotification(`${user.name} ${actionText} the task: "${task.title}"`, goal.mentorId);
        
        const siblingTasks = get().goalTasks.filter(t => t.goalId === goal.id);
        const allSubmitted = siblingTasks.every(t => t.id === taskId ? true : ['Submitted', 'Approved'].includes(t.status));
        if (allSubmitted) {
          get().addNotification(`All tasks submitted for goal "${goal.title}"`, goal.mentorId);
        }
        
        get()._recalculateGoal(goal.id);
      },
      approveTask: (taskId, { mentorFeedback }) => {
        const user = get()._verifyRole('mentor');
        const task = get().goalTasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        const goal = get().goals.find(g => g.id === task.goalId);
        if (goal.mentorId !== user.id) throw new Error('Unauthorized');
        
        const updatedTask = {
          ...task,
          status: 'Approved',
          mentorFeedback: mentorFeedback || '',
          approvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const activity = {
          id: `ga-${Date.now()}-app`,
          goalId: goal.id,
          taskId,
          userId: user.id,
          activityType: 'approve',
          message: `${user.name} approved task "${task.title}"`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          goalTasks: state.goalTasks.map(t => t.id === taskId ? updatedTask : t),
          goalActivities: [...state.goalActivities, activity]
        }));
        
        get().addNotification(`Task "${task.title}" was approved by ${user.name}`, goal.menteeId);
        
        get()._recalculateGoal(goal.id);
      },
      rejectTask: (taskId, { mentorFeedback }) => {
        const user = get()._verifyRole('mentor');
        if (!mentorFeedback?.trim()) throw new Error('Feedback is required when requesting improvements');
        
        const task = get().goalTasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        const goal = get().goals.find(g => g.id === task.goalId);
        if (goal.mentorId !== user.id) throw new Error('Unauthorized');
        
        const updatedTask = {
          ...task,
          status: 'Needs Improvement',
          mentorFeedback,
          updatedAt: new Date().toISOString()
        };
        
        const activity = {
          id: `ga-${Date.now()}-rej`,
          goalId: goal.id,
          taskId,
          userId: user.id,
          activityType: 'reject',
          message: `${user.name} requested changes on "${task.title}"`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          goalTasks: state.goalTasks.map(t => t.id === taskId ? updatedTask : t),
          goalActivities: [...state.goalActivities, activity]
        }));
        
        const truncate = (str, n) => (str.length > n) ? str.slice(0, n - 1) + '...' : str;
        get().addNotification(`Task "${task.title}" needs improvement. Feedback: "${truncate(mentorFeedback, 35)}"`, goal.menteeId);
        
        get()._recalculateGoal(goal.id);
      },
      addGoalFeedback: (goalId, feedback) => {
        get().updateGoalDetails(goalId, { mentorFeedback: feedback });
      },
      sendMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, messages: [...(c.messages || []), message] } : c
          )
        })),
      markConversationRead: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, unreadCount: 0 } : c
          )
        })),
      updateAvailability: (slots) =>
        set({ availability: slots }),
      setUserProfile: (changes) =>
        set((state) => ({ currentUser: { ...state.currentUser, ...changes } })),
      banUser: (userId) =>
        set((state) => ({
          bannedUserIds: state.bannedUserIds.includes(userId)
            ? state.bannedUserIds
            : [...state.bannedUserIds, userId]
        })),
      unbanUser: (userId) =>
        set((state) => ({
          bannedUserIds: state.bannedUserIds.filter((id) => id !== userId)
        })),

      // Forum Actions
      createForumPost: (postData) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');
        if (user.forumSuspended) throw new Error('Your forum participation has been suspended.');

        const { title, description, categoryId, tags, codeBlock, image } = postData;
        
        if (!title || title.trim().length < 10) {
          throw new Error('Title must contain at least 10 characters');
        }
        if (!description || description.trim().length < 20) {
          throw new Error('Description must contain at least 20 characters');
        }
        if (!categoryId) {
          throw new Error('At least one category must be selected');
        }
        if (!tags || tags.length === 0) {
          throw new Error('At least one tag is required');
        }
        if (tags.length > 5) {
          throw new Error('Limit tags to a maximum of 5');
        }

        const isDuplicate = get().forumPosts.some(p => p.title.toLowerCase() === title.trim().toLowerCase() && !p.deletedAt);
        if (isDuplicate) {
          throw new Error('A post with this exact title already exists.');
        }

        const blockedWords = get().forumBlockedWords || [];
        const hasBlockedWord = blockedWords.some(word => 
          title.toLowerCase().includes(word) || description.toLowerCase().includes(word)
        );
        if (hasBlockedWord) {
          throw new Error('Your post contains blocked keywords.');
        }

        const newPost = {
          id: `fp-${Date.now()}`,
          authorId: user.id,
          title: title.trim(),
          description: description.trim(),
          categoryId,
          tags: tags.map(t => t.trim()),
          status: 'active',
          isSolved: false,
          acceptedAnswerId: null,
          isPinned: false,
          isLocked: false,
          viewCount: 0,
          viewedBy: [],
          codeBlock: codeBlock || null,
          image: image || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        };

        let updatedTags = [...get().forumTags];
        tags.forEach(tagName => {
          const tName = tagName.trim();
          const tagIdx = updatedTags.findIndex(t => t.name.toLowerCase() === tName.toLowerCase());
          if (tagIdx !== -1) {
            updatedTags[tagIdx] = { ...updatedTags[tagIdx], usageCount: updatedTags[tagIdx].usageCount + 1 };
          } else {
            updatedTags.push({ id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, name: tName, usageCount: 1, createdAt: new Date().toISOString() });
          }
        });

        set(state => ({
          forumPosts: [newPost, ...state.forumPosts],
          forumTags: updatedTags
        }));

        return newPost.id;
      },

      updateForumPost: (postId, postData) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');
        
        const post = get().forumPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        if (post.authorId !== user.id && get().role !== 'admin') {
          throw new Error('Unauthorized to edit this post');
        }

        const { title, description, categoryId, tags, codeBlock, image } = postData;

        if (title && title.trim().length < 10) {
          throw new Error('Title must contain at least 10 characters');
        }
        if (description && description.trim().length < 20) {
          throw new Error('Description must contain at least 20 characters');
        }
        if (tags && tags.length > 5) {
          throw new Error('Limit tags to a maximum of 5');
        }

        if (title || description) {
          const blockedWords = get().forumBlockedWords || [];
          const hasBlockedWord = blockedWords.some(word => 
            (title && title.toLowerCase().includes(word)) || (description && description.toLowerCase().includes(word))
          );
          if (hasBlockedWord) {
            throw new Error('Your updates contain blocked keywords.');
          }
        }

        const updatedPost = {
          ...post,
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(categoryId && { categoryId }),
          ...(tags && { tags: tags.map(t => t.trim()) }),
          codeBlock: codeBlock !== undefined ? codeBlock : post.codeBlock,
          image: image !== undefined ? image : post.image,
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          forumPosts: state.forumPosts.map(p => p.id === postId ? updatedPost : p)
        }));
      },

      deleteForumPost: (postId) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');

        const post = get().forumPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        if (post.authorId !== user.id && get().role !== 'admin') {
          throw new Error('Unauthorized to delete this post');
        }

        set(state => ({
          forumPosts: state.forumPosts.map(p => p.id === postId ? { ...p, deletedAt: new Date().toISOString() } : p)
        }));

        if (get().role === 'admin' && post.authorId !== user.id) {
          get()._writeAuditLog('delete_post', 'forum_post', postId, post, { deletedAt: new Date().toISOString() }, 'Admin deleted forum post as spam/inappropriate');
          get().addNotification(`Your post "${post.title}" was removed by an administrator.`, post.authorId);
        }
      },

      lockForumPost: (postId, reason = '') => {
        get()._verifyAdminAccess();
        const post = get().forumPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        set(state => ({
          forumPosts: state.forumPosts.map(p => p.id === postId ? { ...p, isLocked: true, updatedAt: new Date().toISOString() } : p)
        }));

        get()._writeAuditLog('lock_post', 'forum_post', postId, post, { isLocked: true }, reason);
        get().addNotification(`Your post "${post.title}" has been locked by an administrator.`, post.authorId);
      },

      unlockForumPost: (postId) => {
        get()._verifyAdminAccess();
        const post = get().forumPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        set(state => ({
          forumPosts: state.forumPosts.map(p => p.id === postId ? { ...p, isLocked: false, updatedAt: new Date().toISOString() } : p)
        }));

        get()._writeAuditLog('unlock_post', 'forum_post', postId, post, { isLocked: false }, 'Unlock post');
      },

      pinForumPost: (postId) => {
        get()._verifyAdminAccess();
        const post = get().forumPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        set(state => ({
          forumPosts: state.forumPosts.map(p => p.id === postId ? { ...p, isPinned: true, updatedAt: new Date().toISOString() } : p)
        }));

        get()._writeAuditLog('pin_post', 'forum_post', postId, post, { isPinned: true }, 'Pin post');
      },

      unpinForumPost: (postId) => {
        get()._verifyAdminAccess();
        const post = get().forumPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        set(state => ({
          forumPosts: state.forumPosts.map(p => p.id === postId ? { ...p, isPinned: false, updatedAt: new Date().toISOString() } : p)
        }));

        get()._writeAuditLog('unpin_post', 'forum_post', postId, post, { isPinned: false }, 'Unpin post');
      },

      incrementForumPostViews: (postId) => {
        const user = get().currentUser;
        const userId = user ? user.id : 'guest-' + Math.random().toString(36).substr(2, 9);

        set(state => {
          const post = state.forumPosts.find(p => p.id === postId);
          if (!post) return {};
          
          const viewedBy = post.viewedBy || [];
          if (viewedBy.includes(userId)) return {};

          const updatedPosts = state.forumPosts.map(p => 
            p.id === postId 
              ? { ...p, viewCount: p.viewCount + 1, viewedBy: [...viewedBy, userId] }
              : p
          );
          return { forumPosts: updatedPosts };
        });
      },

      addForumAnswer: (postId, answerData) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');
        if (user.forumSuspended) throw new Error('Your forum participation has been suspended.');

        const post = get().forumPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');
        if (post.isLocked) throw new Error('This discussion is locked and cannot receive answers.');

        const { content, codeBlock, image } = answerData;
        if (!content || content.trim().length < 10) {
          throw new Error('Answer content must contain at least 10 characters');
        }

        const blockedWords = get().forumBlockedWords || [];
        if (blockedWords.some(word => content.toLowerCase().includes(word))) {
          throw new Error('Your answer contains blocked keywords.');
        }

        const newAnswer = {
          id: `fa-${Date.now()}`,
          postId,
          authorId: user.id,
          content: content.trim(),
          isAccepted: false,
          codeBlock: codeBlock || null,
          image: image || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        };

        set(state => ({
          forumAnswers: [...state.forumAnswers, newAnswer]
        }));

        if (post.authorId !== user.id) {
          get().addNotification(`${user.name} answered your question: "${post.title}"`, post.authorId);
        }

        const followers = get().followedDiscussions.filter(f => f.postId === postId && f.userId !== user.id);
        followers.forEach(f => {
          get().addNotification(`New answer in followed discussion: "${post.title}"`, f.userId);
        });

        return newAnswer.id;
      },

      updateForumAnswer: (answerId, content) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');
        
        const answer = get().forumAnswers.find(a => a.id === answerId);
        if (!answer) throw new Error('Answer not found');

        if (answer.authorId !== user.id && get().role !== 'admin') {
          throw new Error('Unauthorized to edit this answer');
        }

        if (!content || content.trim().length < 10) {
          throw new Error('Answer content must contain at least 10 characters');
        }

        const blockedWords = get().forumBlockedWords || [];
        if (blockedWords.some(word => content.toLowerCase().includes(word))) {
          throw new Error('Your answer contains blocked keywords.');
        }

        const updatedAnswer = {
          ...answer,
          content: content.trim(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          forumAnswers: state.forumAnswers.map(a => a.id === answerId ? updatedAnswer : a)
        }));
      },

      deleteForumAnswer: (answerId) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');

        const answer = get().forumAnswers.find(a => a.id === answerId);
        if (!answer) throw new Error('Answer not found');

        if (answer.authorId !== user.id && get().role !== 'admin') {
          throw new Error('Unauthorized to delete this answer');
        }

        const post = get().forumPosts.find(p => p.id === answer.postId);
        let reputationTransactions = [...get().reputationTransactions];
        let usersList = [...get().users];
        let updatedPosts = [...get().forumPosts];

        if (answer.isAccepted && post) {
          usersList = usersList.map(u => {
            if (u.id === answer.authorId) {
              return { ...u, reputation: Math.max(0, (u.reputation || 0) - 15) };
            }
            return u;
          });
          reputationTransactions.push({
            id: `rt-${Date.now()}-delrev`,
            userId: answer.authorId,
            sourceUserId: user.id,
            sourceType: 'answer',
            sourceId: answer.id,
            points: -15,
            reason: 'Accepted answer deleted',
            createdAt: new Date().toISOString()
          });

          updatedPosts = updatedPosts.map(p => 
            p.id === post.id 
              ? { ...p, acceptedAnswerId: null, isSolved: false, updatedAt: new Date().toISOString() } 
              : p
          );
        }

        const updatedAnswers = get().forumAnswers.map(a => 
          a.id === answerId ? { ...a, deletedAt: new Date().toISOString() } : a
        );

        set({
          forumAnswers: updatedAnswers,
          forumPosts: updatedPosts,
          users: usersList,
          reputationTransactions
        });

        if (get().role === 'admin' && answer.authorId !== user.id) {
          get()._writeAuditLog('delete_answer', 'forum_answer', answerId, answer, { deletedAt: new Date().toISOString() }, 'Admin deleted answer');
          get().addNotification(`Your answer in "${post?.title || 'a discussion'}" was removed by an administrator.`, answer.authorId);
        }
      },

      acceptForumAnswer: (postId, answerId) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');
        const role = get().role;

        const post = get().forumPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        if (post.authorId !== user.id && role !== 'admin') {
          throw new Error('Only the question author or an admin can accept an answer');
        }

        const oldAcceptedId = post.acceptedAnswerId;
        const isToggleOff = oldAcceptedId === answerId;
        const newAcceptedId = isToggleOff ? null : answerId;

        let reputationTransactions = [...get().reputationTransactions];
        let usersList = [...get().users];

        if (oldAcceptedId) {
          const oldAnswer = get().forumAnswers.find(a => a.id === oldAcceptedId);
          if (oldAnswer) {
            const oldAuthorId = oldAnswer.authorId;
            usersList = usersList.map(u => {
              if (u.id === oldAuthorId) {
                return { ...u, reputation: Math.max(0, (u.reputation || 0) - 15) };
              }
              return u;
            });
            reputationTransactions.push({
              id: `rt-${Date.now()}-rev`,
              userId: oldAuthorId,
              sourceUserId: user.id,
              sourceType: 'answer',
              sourceId: oldAcceptedId,
              points: -15,
              reason: 'Answer unaccepted',
              createdAt: new Date().toISOString()
            });
          }
        }

        if (newAcceptedId) {
          const newAnswer = get().forumAnswers.find(a => a.id === newAcceptedId);
          if (newAnswer) {
            const newAuthorId = newAnswer.authorId;
            usersList = usersList.map(u => {
              if (u.id === newAuthorId) {
                return { ...u, reputation: (u.reputation || 0) + 15 };
              }
              return u;
            });
            reputationTransactions.push({
              id: `rt-${Date.now()}-acc`,
              userId: newAuthorId,
              sourceUserId: user.id,
              sourceType: 'answer',
              sourceId: newAcceptedId,
              points: 15,
              reason: 'Answer accepted',
              createdAt: new Date().toISOString()
            });

            get().addNotification(`Your answer to "${post.title}" was accepted!`, newAuthorId);
          }
        }

        const updatedPosts = get().forumPosts.map(p => 
          p.id === postId 
            ? { ...p, acceptedAnswerId: newAcceptedId, isSolved: !!newAcceptedId, updatedAt: new Date().toISOString() } 
            : p
        );

        const updatedAnswers = get().forumAnswers.map(a => {
          if (a.postId === postId) {
            return { ...a, isAccepted: a.id === newAcceptedId };
          }
          return a;
        });

        set({
          forumPosts: updatedPosts,
          forumAnswers: updatedAnswers,
          users: usersList,
          reputationTransactions
        });
      },

      addForumComment: (commentData) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');
        if (user.forumSuspended) throw new Error('Your forum participation has been suspended.');

        const { postId, answerId, content } = commentData;

        if ((postId && answerId) || (!postId && !answerId)) {
          throw new Error('A comment must belong to either a post or an answer, not both.');
        }

        let post = null;
        if (postId) {
          post = get().forumPosts.find(p => p.id === postId);
          if (!post) throw new Error('Post not found');
        } else {
          const answer = get().forumAnswers.find(a => a.id === answerId);
          if (!answer) throw new Error('Answer not found');
          post = get().forumPosts.find(p => p.id === answer.postId);
          if (!post) throw new Error('Associated post not found');
        }

        if (post.isLocked) {
          throw new Error('This discussion is locked and cannot receive comments.');
        }

        if (!content || content.trim().length < 2) {
          throw new Error('Comment must contain at least 2 characters');
        }

        const blockedWords = get().forumBlockedWords || [];
        if (blockedWords.some(word => content.toLowerCase().includes(word))) {
          throw new Error('Your comment contains blocked keywords.');
        }

        const newComment = {
          id: `fc-${Date.now()}`,
          authorId: user.id,
          postId: postId || null,
          answerId: answerId || null,
          content: content.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        };

        set(state => ({
          forumComments: [...state.forumComments, newComment]
        }));

        if (postId) {
          if (post.authorId !== user.id) {
            get().addNotification(`${user.name} commented on your post: "${post.title}"`, post.authorId);
          }
        } else {
          const answer = get().forumAnswers.find(a => a.id === answerId);
          if (answer && answer.authorId !== user.id) {
            get().addNotification(`${user.name} commented on your answer to: "${post.title}"`, answer.authorId);
          }
        }

        const followers = get().followedDiscussions.filter(f => f.postId === post.id && f.userId !== user.id);
        followers.forEach(f => {
          get().addNotification(`New comment in followed discussion: "${post.title}"`, f.userId);
        });

        return newComment.id;
      },

      updateForumComment: (commentId, content) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');

        const comment = get().forumComments.find(c => c.id === commentId);
        if (!comment) throw new Error('Comment not found');

        if (comment.authorId !== user.id && get().role !== 'admin') {
          throw new Error('Unauthorized to edit this comment');
        }

        if (!content || content.trim().length < 2) {
          throw new Error('Comment must contain at least 2 characters');
        }

        const blockedWords = get().forumBlockedWords || [];
        if (blockedWords.some(word => content.toLowerCase().includes(word))) {
          throw new Error('Your comment contains blocked keywords.');
        }

        const updatedComment = {
          ...comment,
          content: content.trim(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          forumComments: state.forumComments.map(c => c.id === commentId ? updatedComment : c)
        }));
      },

      deleteForumComment: (commentId) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');

        const comment = get().forumComments.find(c => c.id === commentId);
        if (!comment) throw new Error('Comment not found');

        if (comment.authorId !== user.id && get().role !== 'admin') {
          throw new Error('Unauthorized to delete this comment');
        }

        set(state => ({
          forumComments: state.forumComments.map(c => c.id === commentId ? { ...c, deletedAt: new Date().toISOString() } : c)
        }));
      },

      voteForumContent: (type, targetId, voteType) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');
        const userId = user.id;

        let authorId = null;
        if (type === 'post') {
          const post = get().forumPosts.find(p => p.id === targetId);
          if (!post) throw new Error('Post not found');
          if (post.authorId === userId) throw new Error('You cannot vote on your own post');
          authorId = post.authorId;
        } else if (type === 'answer') {
          const answer = get().forumAnswers.find(a => a.id === targetId);
          if (!answer) throw new Error('Answer not found');
          if (answer.authorId === userId) throw new Error('You cannot vote on your own answer');
          authorId = answer.authorId;
        } else {
          throw new Error('Invalid vote target type');
        }

        const existingVote = get().forumVotes.find(v => 
          v.userId === userId && 
          (type === 'post' ? v.postId === targetId : v.answerId === targetId)
        );

        let reputationChange = 0;
        let newVotes = [];

        if (existingVote) {
          if (existingVote.voteType === voteType) {
            newVotes = get().forumVotes.filter(v => v.id !== existingVote.id);
            if (type === 'post') {
              reputationChange = voteType === 'UPVOTE' ? -2 : 1;
            } else {
              reputationChange = voteType === 'UPVOTE' ? -5 : 2;
            }
          } else {
            newVotes = get().forumVotes.map(v => 
              v.id === existingVote.id 
                ? { ...v, voteType, createdAt: new Date().toISOString() } 
                : v
            );
            if (type === 'post') {
              reputationChange = voteType === 'UPVOTE' ? 3 : -3;
            } else {
              reputationChange = voteType === 'UPVOTE' ? 7 : -7;
            }
          }
        } else {
          const newVote = {
            id: `fv-${Date.now()}`,
            userId,
            postId: type === 'post' ? targetId : null,
            answerId: type === 'answer' ? targetId : null,
            voteType,
            createdAt: new Date().toISOString()
          };
          newVotes = [...get().forumVotes, newVote];
          if (type === 'post') {
            reputationChange = voteType === 'UPVOTE' ? 2 : -1;
          } else {
            reputationChange = voteType === 'UPVOTE' ? 5 : -2;
          }

          if (voteType === 'UPVOTE') {
            get().addNotification(`${user.name} upvoted your ${type === 'post' ? 'post' : 'answer'}`, authorId);
          }
        }

        const updatedUsers = get().users.map(u => {
          if (u.id === authorId) {
            const currentPoints = u.reputation || 0;
            const newPoints = Math.max(0, currentPoints + reputationChange);
            return { ...u, reputation: newPoints };
          }
          return u;
        });

        let newTransactions = get().reputationTransactions;
        if (reputationChange !== 0) {
          const transaction = {
            id: `rt-${Date.now()}`,
            userId: authorId,
            sourceUserId: userId,
            sourceType: type,
            sourceId: targetId,
            points: reputationChange,
            reason: `${type === 'post' ? 'Post' : 'Answer'} received ${voteType.toLowerCase()}`,
            createdAt: new Date().toISOString()
          };
          newTransactions = [...newTransactions, transaction];
        }

        set({
          forumVotes: newVotes,
          users: updatedUsers,
          reputationTransactions: newTransactions
        });
      },

      saveForumPost: (postId) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');
        
        set(state => {
          const exists = state.savedPosts.some(s => s.userId === user.id && s.postId === postId);
          if (exists) return {};
          return {
            savedPosts: [...state.savedPosts, { id: `sp-${Date.now()}`, userId: user.id, postId, createdAt: new Date().toISOString() }]
          };
        });
      },

      unsaveForumPost: (postId) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');

        set(state => ({
          savedPosts: state.savedPosts.filter(s => !(s.userId === user.id && s.postId === postId))
        }));
      },

      followForumPost: (postId) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');

        set(state => {
          const exists = state.followedDiscussions.some(f => f.userId === user.id && f.postId === postId);
          if (exists) return {};
          return {
            followedDiscussions: [...state.followedDiscussions, { id: `fd-${Date.now()}`, userId: user.id, postId, createdAt: new Date().toISOString() }]
          };
        });
      },

      unfollowForumPost: (postId) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');

        set(state => ({
          followedDiscussions: state.followedDiscussions.filter(f => !(f.userId === user.id && f.postId === postId))
        }));
      },

      createForumReport: (reportData) => {
        const user = get().currentUser;
        if (!user) throw new Error('Unauthenticated');

        const { contentType, contentId, reason, description } = reportData;

        const isDuplicate = get().forumReports.some(r => 
          r.reporterId === user.id && 
          r.contentType === contentType && 
          r.contentId === contentId && 
          r.status === 'Open'
        );
        if (isDuplicate) {
          throw new Error('You have already submitted an active report for this content.');
        }

        const newReport = {
          id: `rep-forum-${Date.now()}`,
          reporterId: user.id,
          contentType,
          contentId,
          reason,
          description: description || '',
          status: 'Open',
          reviewedBy: null,
          reviewedAt: null,
          createdAt: new Date().toISOString()
        };

        set(state => ({
          forumReports: [newReport, ...state.forumReports]
        }));
      },

      resolveForumReport: (reportId, actionNotes) => {
        get()._verifyAdminAccess();
        const report = get().forumReports.find(r => r.id === reportId);
        if (!report) throw new Error('Report not found');

        if (report.contentType === 'post') {
          get().deleteForumPost(report.contentId);
        } else if (report.contentType === 'answer') {
          get().deleteForumAnswer(report.contentId);
        } else if (report.contentType === 'comment') {
          get().deleteForumComment(report.contentId);
        }

        set(state => ({
          forumReports: state.forumReports.map(r => 
            r.id === reportId 
              ? { ...r, status: 'Resolved', reviewedBy: state.currentUser.id, reviewedAt: new Date().toISOString(), resolutionNote: actionNotes }
              : r
          )
        }));

        get()._writeAuditLog('resolve_forum_report', 'forum_report', reportId, report, { status: 'Resolved' }, actionNotes);
      },

      dismissForumReport: (reportId, actionNotes) => {
        get()._verifyAdminAccess();
        const report = get().forumReports.find(r => r.id === reportId);
        if (!report) throw new Error('Report not found');

        set(state => ({
          forumReports: state.forumReports.map(r => 
            r.id === reportId 
              ? { ...r, status: 'Dismissed', reviewedBy: state.currentUser.id, reviewedAt: new Date().toISOString(), resolutionNote: actionNotes }
              : r
          )
        }));

        get()._writeAuditLog('dismiss_forum_report', 'forum_report', reportId, report, { status: 'Dismissed' }, actionNotes);
      },

      addForumCategory: (categoryData) => {
        get()._verifyAdminAccess();
        const { name, description, icon } = categoryData;
        if (!name || !name.trim()) throw new Error('Category name is required');

        const isDuplicate = get().forumCategories.some(c => c.name.toLowerCase() === name.trim().toLowerCase());
        if (isDuplicate) throw new Error('Category name already exists');

        const newCategory = {
          id: `cat-${Date.now()}`,
          name: name.trim(),
          description: description || '',
          icon: icon || 'MessageSquare',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          forumCategories: [...state.forumCategories, newCategory]
        }));

        get()._writeAuditLog('add_forum_category', 'forum_category', newCategory.id, null, newCategory, 'Created new category');
      },

      updateForumCategory: (categoryId, categoryData) => {
        get()._verifyAdminAccess();
        const category = get().forumCategories.find(c => c.id === categoryId);
        if (!category) throw new Error('Category not found');

        const { name, description, icon, isActive } = categoryData;

        const updatedCategory = {
          ...category,
          ...(name && { name: name.trim() }),
          ...(description !== undefined && { description }),
          ...(icon && { icon }),
          ...(isActive !== undefined && { isActive }),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          forumCategories: state.forumCategories.map(c => c.id === categoryId ? updatedCategory : c)
        }));

        get()._writeAuditLog('update_forum_category', 'forum_category', categoryId, category, updatedCategory, 'Updated category settings');
      },

      deleteForumCategory: (categoryId) => {
        get()._verifyAdminAccess();
        const category = get().forumCategories.find(c => c.id === categoryId);
        if (!category) throw new Error('Category not found');

        set(state => ({
          forumCategories: state.forumCategories.map(c => c.id === categoryId ? { ...c, isActive: false, updatedAt: new Date().toISOString() } : c)
        }));

        get()._writeAuditLog('delete_forum_category', 'forum_category', categoryId, category, { isActive: false }, 'Deactivated category');
      },

      suspendForumUser: (userId, reason) => {
        get()._verifyAdminAccess();
        const user = get().users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');

        set(state => ({
          users: state.users.map(u => 
            u.id === userId 
              ? { ...u, accountStatus: 'suspended', forumSuspended: true, forumSuspendedReason: reason, forumSuspendedAt: new Date().toISOString() } 
              : u
          )
        }));

        get()._writeAuditLog('suspend_forum_user', 'user', userId, user, { forumSuspended: true }, reason);
        get().addNotification(`Your forum participation has been suspended by an administrator. Reason: ${reason}`, userId);
      },

      unsuspendForumUser: (userId) => {
        get()._verifyAdminAccess();
        const user = get().users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');

        set(state => ({
          users: state.users.map(u => 
            u.id === userId 
              ? { ...u, accountStatus: 'active', forumSuspended: false, forumSuspendedReason: null, forumSuspendedAt: null } 
              : u
          )
        }));

        get()._writeAuditLog('unsuspend_forum_user', 'user', userId, user, { forumSuspended: false }, 'Admin manual lift');
        get().addNotification(`Your forum participation has been unsuspended.`, userId);
      },

      setForumBlockedWords: (words) => {
        get()._verifyAdminAccess();
        set({ forumBlockedWords: words.map(w => w.toLowerCase().trim()) });
      },

      fetchMentors: async () => {
        const { users } = get();
        const activeMentors = users.filter(u => u.role === 'mentor' && u.accountStatus === 'active' && u.approvalStatus === 'Approved');
        set({ mentorList: activeMentors });
      },

      fetchSessions: async (userId, role) => {
        set((state) => {
          if (state.sessions && state.sessions.length > 0) return {};
          return { sessions: mockSessions };
        });
      },

      addSessionToDb: async (sessionData) => {
        const formatted = {
          ...sessionData,
          id: `sess-${Date.now()}`,
          status: 'upcoming'
        };

        set((state) => ({
          sessions: [formatted, ...state.sessions]
        }));
        
        return formatted;
      },

      // Admin Secure Helper Actions
      _writeAuditLog: (actionType, targetType, targetId, previousValue, newValue, reason) => {
        const adminId = get().currentUser?.id || 'admin-1';
        const log = {
          id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          adminId,
          actionType,
          targetType,
          targetId,
          previousValue: previousValue ? JSON.stringify(previousValue) : '',
          newValue: newValue ? JSON.stringify(newValue) : '',
          reason: reason || '',
          createdAt: new Date().toISOString()
        };
        set(state => ({ auditLogs: [log, ...state.auditLogs] }));
      },

      _verifyAdminAccess: () => {
        const user = get().currentUser;
        if (!user || get().role !== 'admin' || user.role !== 'admin') {
          throw new Error('This operation requires administrator privileges.');
        }
        if (user.accountStatus !== 'active') {
          throw new Error('Your administrator account has been disabled.');
        }
      },

      // Admin CRUD Operations
      registerNewUser: (userData) => {
        set(state => ({
          users: [...state.users, {
            id: `user-${Date.now()}`,
            accountStatus: 'active',
            isVerified: true,
            createdAt: new Date().toISOString(),
            ...userData
          }]
        }));
      },

      blockUser: (userId, reason) => {
        get()._verifyAdminAccess();
        const previousUser = get().users.find(u => u.id === userId);
        if (!previousUser) throw new Error('User not found.');

        set(state => {
          const updatedUsers = state.users.map(u => 
            u.id === userId 
              ? { ...u, accountStatus: 'blocked', blockedBy: state.currentUser?.id, blockedAt: new Date().toISOString(), blockReason: reason } 
              : u
          );
          const updatedBanned = state.bannedUserIds.includes(userId) 
            ? state.bannedUserIds 
            : [...state.bannedUserIds, userId];
          
          // Cancel active sessions for blocked user
          const updatedSessions = state.sessions.map(s => 
            (s.mentorId === userId || s.menteeId === userId) && ['upcoming', 'pending', 'scheduled'].includes(s.status)
              ? { ...s, status: 'cancelled', cancellationReason: 'Account blocked by administrator' }
              : s
          );

          return { 
            users: updatedUsers, 
            bannedUserIds: updatedBanned,
            sessions: updatedSessions
          };
        });

        get()._writeAuditLog('block_user', 'user', userId, previousUser, { accountStatus: 'blocked' }, reason);
      },

      unblockUser: (userId) => {
        get()._verifyAdminAccess();
        const previousUser = get().users.find(u => u.id === userId);
        if (!previousUser) throw new Error('User not found.');

        set(state => {
          const updatedUsers = state.users.map(u => 
            u.id === userId 
              ? { ...u, accountStatus: 'active', blockedBy: null, blockedAt: null, blockReason: null } 
              : u
          );
          const updatedBanned = state.bannedUserIds.filter(id => id !== userId);
          return { users: updatedUsers, bannedUserIds: updatedBanned };
        });

        get()._writeAuditLog('unblock_user', 'user', userId, previousUser, { accountStatus: 'active' }, 'Admin manual override');
      },

      suspendUser: (userId, reason) => {
        get()._verifyAdminAccess();
        const previousUser = get().users.find(u => u.id === userId);
        if (!previousUser) throw new Error('User not found.');

        set(state => {
          const updatedUsers = state.users.map(u => 
            u.id === userId 
              ? { ...u, accountStatus: 'suspended', suspendedBy: state.currentUser?.id, suspendedAt: new Date().toISOString(), suspendReason: reason } 
              : u
          );
          
          // Cancel active sessions for suspended user
          const updatedSessions = state.sessions.map(s => 
            (s.mentorId === userId || s.menteeId === userId) && ['upcoming', 'pending', 'scheduled'].includes(s.status)
              ? { ...s, status: 'cancelled', cancellationReason: 'Account suspended by administrator' }
              : s
          );

          return { users: updatedUsers, sessions: updatedSessions };
        });

        get()._writeAuditLog('suspend_user', 'user', userId, previousUser, { accountStatus: 'suspended' }, reason);
      },

      deleteUser: (userId, reason) => {
        get()._verifyAdminAccess();
        const previousUser = get().users.find(u => u.id === userId);
        if (!previousUser) throw new Error('User not found.');

        set(state => {
          const updatedUsers = state.users.map(u => 
            u.id === userId 
              ? { ...u, accountStatus: 'deleted', deletedAt: new Date().toISOString(), deleteReason: reason } 
              : u
          );

          // Cancel active sessions for deleted user
          const updatedSessions = state.sessions.map(s => 
            (s.mentorId === userId || s.menteeId === userId) && ['upcoming', 'pending', 'scheduled'].includes(s.status)
              ? { ...s, status: 'cancelled', cancellationReason: 'Account deleted by administrator' }
              : s
          );

          return { users: updatedUsers, sessions: updatedSessions };
        });

        get()._writeAuditLog('delete_user', 'user', userId, previousUser, { accountStatus: 'deleted' }, reason);
      },

      approveMentor: (mentorId) => {
        get()._verifyAdminAccess();
        const previousUser = get().users.find(u => u.id === mentorId);
        if (!previousUser) throw new Error('Mentor not found.');

        set(state => {
          const updatedUsers = state.users.map(u => 
            u.id === mentorId 
              ? { ...u, approvalStatus: 'Approved', approvedBy: state.currentUser?.id, approvedAt: new Date().toISOString() } 
              : u
          );
          return { users: updatedUsers };
        });

        // Trigger mentor list refresh
        get().fetchMentors();

        get()._writeAuditLog('approve_mentor', 'user', mentorId, previousUser, { approvalStatus: 'Approved' }, 'Application criteria satisfied');
      },

      rejectMentor: (mentorId, reason) => {
        get()._verifyAdminAccess();
        const previousUser = get().users.find(u => u.id === mentorId);
        if (!previousUser) throw new Error('Mentor not found.');

        set(state => {
          const updatedUsers = state.users.map(u => 
            u.id === mentorId 
              ? { ...u, approvalStatus: 'Rejected', rejectedAt: new Date().toISOString(), rejectionReason: reason } 
              : u
          );
          return { users: updatedUsers };
        });

        get()._writeAuditLog('reject_mentor', 'user', mentorId, previousUser, { approvalStatus: 'Rejected' }, reason);
      },

      resolveReport: (reportId, notes) => {
        get()._verifyAdminAccess();
        const previousReport = get().reports.find(r => r.id === reportId);
        if (!previousReport) throw new Error('Report not found.');

        set(state => {
          const updatedReports = state.reports.map(r => 
            r.id === reportId 
              ? { ...r, status: 'Resolved', assignedAdminId: state.currentUser?.id, resolutionNote: notes, resolvedAt: new Date().toISOString() } 
              : r
          );
          return { reports: updatedReports };
        });

        get()._writeAuditLog('resolve_report', 'report', reportId, previousReport, { status: 'Resolved' }, notes);
      },

      dismissReport: (reportId, notes) => {
        get()._verifyAdminAccess();
        const previousReport = get().reports.find(r => r.id === reportId);
        if (!previousReport) throw new Error('Report not found.');

        set(state => {
          const updatedReports = state.reports.map(r => 
            r.id === reportId 
              ? { ...r, status: 'Dismissed', assignedAdminId: state.currentUser?.id, resolutionNote: notes, resolvedAt: new Date().toISOString() } 
              : r
          );
          return { reports: updatedReports };
        });

        get()._writeAuditLog('dismiss_report', 'report', reportId, previousReport, { status: 'Dismissed' }, notes);
      },

      cancelSessionAdmin: (sessionId, reason) => {
        get()._verifyAdminAccess();
        const previousSession = get().sessions.find(s => s.id === sessionId);
        if (!previousSession) throw new Error('Session not found.');

        set(state => {
          const updatedSessions = state.sessions.map(s => 
            s.id === sessionId 
              ? { ...s, status: 'cancelled', cancellationReason: reason } 
              : s
          );
          return { sessions: updatedSessions };
        });

        get()._writeAuditLog('cancel_session', 'session', sessionId, previousSession, { status: 'cancelled' }, reason);
      },

      // --- LINKEDIN FEED & FOLLOW SYSTEM ACTIONS ---
      followMentor: (mentorId) => {
        const { isLoggedIn, currentUser, role, follows, users } = get();
        if (!isLoggedIn) throw new Error('You must be logged in to follow mentors.');
        if (role !== 'mentee') throw new Error('Only students can follow mentors.');
        if (currentUser.id === mentorId) throw new Error('You cannot follow yourself.');

        const mentor = users.find(u => u.id === mentorId && u.role === 'mentor');
        if (!mentor) throw new Error('Mentor not found.');

        const alreadyFollowing = follows.some(f => f.followerId === currentUser.id && f.mentorId === mentorId);
        if (alreadyFollowing) return;

        const newFollow = {
          id: `f-${Date.now()}`,
          followerId: currentUser.id,
          mentorId,
          createdAt: new Date().toISOString()
        };

        set(state => ({
          follows: [...state.follows, newFollow]
        }));

        get()._writeAuditLog('follow_mentor', 'follow', newFollow.id, null, newFollow);
      },

      unfollowMentor: (mentorId) => {
        const { isLoggedIn, currentUser, role, follows } = get();
        if (!isLoggedIn) throw new Error('You must be logged in to unfollow mentors.');
        if (role !== 'mentee') throw new Error('Only students can participate in follow system.');

        const followEntry = follows.find(f => f.followerId === currentUser.id && f.mentorId === mentorId);
        if (!followEntry) return;

        set(state => ({
          follows: state.follows.filter(f => f.id !== followEntry.id)
        }));

        get()._writeAuditLog('unfollow_mentor', 'follow', followEntry.id, followEntry, null);
      },

      createSocialPost: async ({ title, content, image, tags, visibility }) => {
        const { isLoggedIn, currentUser, role, forumBlockedWords } = get();
        if (!isLoggedIn) throw new Error('You must be logged in.');
        if (role !== 'mentor') throw new Error('Only mentors can publish posts.');

        if (!title || title.trim().length < 5) throw new Error('Title must be at least 5 characters.');
        if (!content || content.trim().length < 15) throw new Error('Content must be at least 15 characters.');

        const lowerTitle = title.toLowerCase();
        const lowerContent = content.toLowerCase();
        const isSpam = forumBlockedWords.some(word => 
          lowerTitle.includes(word.toLowerCase()) || lowerContent.includes(word.toLowerCase())
        );
        if (isSpam) throw new Error('Your post contains blocked keywords/spam language.');

        const newPost = {
          id: `sp-${Date.now()}`,
          authorId: currentUser.id,
          title: title.trim(),
          content: content.trim(),
          image: image?.trim() || null,
          tags: (tags || []).map(t => t.trim()).filter(Boolean),
          visibility: visibility || 'public',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        };

        set(state => ({
          socialPosts: [newPost, ...state.socialPosts]
        }));

        const followers = get().follows.filter(f => f.mentorId === currentUser.id);
        const notificationText = `${currentUser.name} shared a new post: "${title.length > 30 ? title.substring(0, 30) + '...' : title}"`;
        
        set(state => {
          const newNotifications = followers.map(f => ({
            id: `notif-${Date.now()}-${f.followerId}`,
            type: 'social_post',
            text: notificationText,
            read: false,
            link: `/feed?postId=${newPost.id}`,
            createdAt: new Date().toISOString()
          }));
          return {
            notifications: [...newNotifications, ...state.notifications]
          };
        });

        get()._writeAuditLog('create_social_post', 'social_post', newPost.id, null, newPost);
        return newPost.id;
      },

      updateSocialPost: async (postId, { title, content, image, tags, visibility }) => {
        const { isLoggedIn, currentUser, socialPosts } = get();
        if (!isLoggedIn) throw new Error('You must be logged in.');

        const post = socialPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found.');
        if (post.authorId !== currentUser.id) throw new Error('Only the author can edit this post.');

        set(state => ({
          socialPosts: state.socialPosts.map(p => 
            p.id === postId 
              ? { 
                  ...p, 
                  title: title.trim(), 
                  content: content.trim(), 
                  image: image?.trim() || null, 
                  tags: (tags || []).map(t => t.trim()).filter(Boolean), 
                  visibility: visibility || 'public',
                  updatedAt: new Date().toISOString(),
                  isEdited: true 
                } 
              : p
          )
        }));

        get()._writeAuditLog('update_social_post', 'social_post', postId, post, get().socialPosts.find(p => p.id === postId));
      },

      deleteSocialPost: async (postId) => {
        const { isLoggedIn, currentUser, role, socialPosts } = get();
        if (!isLoggedIn) throw new Error('You must be logged in.');

        const post = socialPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found.');
        
        if (post.authorId !== currentUser.id && role !== 'admin') {
          throw new Error('Unauthorized deletion.');
        }

        set(state => ({
          socialPosts: state.socialPosts.map(p => p.id === postId ? { ...p, deletedAt: new Date().toISOString() } : p),
          socialLikes: state.socialLikes.filter(l => l.postId !== postId),
          socialComments: state.socialComments.filter(c => c.postId !== postId)
        }));

        get()._writeAuditLog('delete_social_post', 'social_post', postId, post, null);
      },

      likeSocialPost: (postId) => {
        const { isLoggedIn, currentUser, socialLikes, socialPosts } = get();
        if (!isLoggedIn) throw new Error('You must be logged in.');

        const post = socialPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found.');

        const alreadyLiked = socialLikes.some(l => l.postId === postId && l.userId === currentUser.id);
        if (alreadyLiked) return;

        const newLike = {
          id: `sl-${Date.now()}`,
          postId,
          userId: currentUser.id,
          createdAt: new Date().toISOString()
        };

        set(state => ({
          socialLikes: [...state.socialLikes, newLike]
        }));

        if (post.authorId !== currentUser.id) {
          const notificationText = `${currentUser.name} liked your post: "${post.title.substring(0, 20)}..."`;
          const newNotif = {
            id: `notif-${Date.now()}`,
            type: 'social_like',
            text: notificationText,
            read: false,
            link: `/feed?postId=${postId}`,
            createdAt: new Date().toISOString()
          };
          set(state => ({
            notifications: [newNotif, ...state.notifications]
          }));
        }
      },

      unlikeSocialPost: (postId) => {
        const { isLoggedIn, currentUser, socialLikes } = get();
        if (!isLoggedIn) throw new Error('You must be logged in.');

        const likeEntry = socialLikes.find(l => l.postId === postId && l.userId === currentUser.id);
        if (!likeEntry) return;

        set(state => ({
          socialLikes: state.socialLikes.filter(l => l.id !== likeEntry.id)
        }));
      },

      addSocialComment: ({ postId, content, parentId }) => {
        const { isLoggedIn, currentUser, role, socialPosts, socialComments } = get();
        if (!isLoggedIn) throw new Error('You must be logged in.');

        const post = socialPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found.');

        if (!content || content.trim().length < 2) throw new Error('Comment must be at least 2 characters.');

        const newComment = {
          id: `sc-${Date.now()}`,
          postId,
          authorId: currentUser.id,
          authorRole: role,
          content: content.trim(),
          parentId: parentId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        };

        set(state => ({
          socialComments: [...state.socialComments, newComment]
        }));

        if (parentId) {
          const parentComment = socialComments.find(c => c.id === parentId);
          if (parentComment && parentComment.authorId !== currentUser.id) {
            const notificationText = `${currentUser.name} replied to your comment: "${content.substring(0, 20)}..."`;
            const newNotif = {
              id: `notif-${Date.now()}`,
              type: 'social_comment_reply',
              text: notificationText,
              read: false,
              link: `/feed?postId=${postId}`,
              createdAt: new Date().toISOString()
            };
            set(state => ({
              notifications: [newNotif, ...state.notifications]
            }));
          }
        } else {
          if (post.authorId !== currentUser.id) {
            const notificationText = `${currentUser.name} commented on your post: "${content.substring(0, 20)}..."`;
            const newNotif = {
              id: `notif-${Date.now()}`,
              type: 'social_comment',
              text: notificationText,
              read: false,
              link: `/feed?postId=${postId}`,
              createdAt: new Date().toISOString()
            };
            set(state => ({
              notifications: [newNotif, ...state.notifications]
            }));
          }
        }

        return newComment.id;
      },

      updateSocialComment: (commentId, content) => {
        const { isLoggedIn, currentUser, socialComments } = get();
        if (!isLoggedIn) throw new Error('You must be logged in.');

        const comment = socialComments.find(c => c.id === commentId);
        if (!comment) throw new Error('Comment not found.');
        if (comment.authorId !== currentUser.id) throw new Error('Unauthorized edit.');

        set(state => ({
          socialComments: state.socialComments.map(c => 
            c.id === commentId 
              ? { ...c, content: content.trim(), updatedAt: new Date().toISOString() } 
              : c
          )
        }));
      },

      deleteSocialComment: (commentId) => {
        const { isLoggedIn, currentUser, role, socialComments } = get();
        if (!isLoggedIn) throw new Error('You must be logged in.');

        const comment = socialComments.find(c => c.id === commentId);
        if (!comment) throw new Error('Comment not found.');

        if (comment.authorId !== currentUser.id && role !== 'admin') {
          throw new Error('Unauthorized deletion.');
        }

        const getReplyIds = (id) => {
          const replies = socialComments.filter(c => c.parentId === id);
          return [id, ...replies.flatMap(r => getReplyIds(r.id))];
        };

        const targetIds = getReplyIds(commentId);

        set(state => ({
          socialComments: state.socialComments.filter(c => !targetIds.includes(c.id))
        }));
      }
    }),
    {
      name: 'connect-app-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
        role: state.role,
        onboardingCompleted: state.onboardingCompleted,
        themeMode: state.themeMode,
        onboarding: state.onboarding,
        activeFilters: state.activeFilters,
        searchQuery: state.searchQuery,
        mentorList: state.mentorList,
        savedMentorIds: state.savedMentorIds,
        blockedMentorIds: state.blockedMentorIds,
        sessions: state.sessions,
        reviews: state.reviews,
        postFeedbackModalSessionId: state.postFeedbackModalSessionId,
        feedbackResponses: state.feedbackResponses,
        blogPosts: state.blogPosts,
        resources: state.resources,
        events: state.events,
        stories: state.stories,
        reports: state.reports,
        users: state.users,
        auditLogs: state.auditLogs,
        waitlists: state.waitlists,
        goals: state.goals,
        goalTasks: state.goalTasks,
        goalActivities: state.goalActivities,
        conversations: state.conversations,
        availability: state.availability,
        bannedUserIds: state.bannedUserIds,
        checklist: state.checklist,
        dismissedNudgeUntil: state.dismissedNudgeUntil,
        notifications: state.notifications,
        forumPosts: state.forumPosts,
        forumAnswers: state.forumAnswers,
        forumComments: state.forumComments,
        forumVotes: state.forumVotes,
        forumCategories: state.forumCategories,
        forumTags: state.forumTags,
        savedPosts: state.savedPosts,
        followedDiscussions: state.followedDiscussions,
        forumReports: state.forumReports,
        reputationTransactions: state.reputationTransactions,
        forumBlockedWords: state.forumBlockedWords,
        forumModerationLogs: state.forumModerationLogs,
        follows: state.follows,
        socialPosts: state.socialPosts,
        socialLikes: state.socialLikes,
        socialComments: state.socialComments
      })
    }
  )
);
