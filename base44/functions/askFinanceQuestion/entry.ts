import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const question = typeof body.question === 'string' ? body.question.trim() : '';
    if (!question) return Response.json({ error: 'Question is required.' }, { status: 400 });
    if (question.length > 500) return Response.json({ error: 'Question must be 500 characters or fewer.' }, { status: 400 });

    const history = Array.isArray(body.history)
      ? body.history.slice(-6).filter((message) =>
          message &&
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string'
        ).map((message) => ({
          role: message.role,
          content: message.content.trim().slice(0, 1000),
        })).filter((message) => message.content)
      : [];

    const context = history
      .map((message) => `${message.role === 'user' ? 'Student' : 'FINOVA AI'}: ${message.content}`)
      .join('\n');

    const prompt = `You are FINOVA AI, a friendly financial education assistant for UAE university students. Keep responses concise, clear, and educational. Use simple language. Always include a UAE-relevant angle when possible. Never give direct investment advice — frame everything as education.

Recent conversation:
${context}

Student: ${question}

FINOVA AI:`;

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });
    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to answer right now.' }, { status: 500 });
  }
}