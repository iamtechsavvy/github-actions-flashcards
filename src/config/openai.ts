import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateJiraContent = async (prompt: string) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a JIRA expert. Generate detailed JIRA ticket content based on the provided information. Format the response in a clear, structured way."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    throw error;
  }
}; 