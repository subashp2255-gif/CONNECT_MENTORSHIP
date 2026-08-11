import { mentors } from '../data/mockData';

export async function getAiMentorMatch(goalText) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    return fallbackMatch(goalText);
  }

  try {
    const mentorSummary = mentors
      .map((mentor) => `${mentor.id}: ${mentor.name} | ${mentor.skills.join(', ')} | ${mentor.role} at ${mentor.company}`)
      .join('\n');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        max_tokens: 180,
        messages: [
          {
            role: 'user',
            content: `Pick the best mentor ID for this goal: "${goalText}".\nMentors:\n${mentorSummary}\nReturn JSON like {"mentorId":"m1","reason":"..."}.`
          }
        ]
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(text);
    const mentor = mentors.find((m) => m.id === parsed.mentorId) || mentors[0];
    return { mentor, reason: parsed.reason || 'Matched by Claude.' };
  } catch (error) {
    return fallbackMatch(goalText);
  }
}

function fallbackMatch(goalText) {
  const lower = goalText.toLowerCase();
  const mentor =
    mentors.find((item) => item.skills.some((skill) => lower.includes(skill.toLowerCase()))) ||
    mentors[0];
  return { mentor, reason: 'Matched from skill overlap.' };
}
