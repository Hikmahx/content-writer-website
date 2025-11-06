import { prisma } from './prisma'

/**
 * Aggregates all admin data from the database to create context for the AI
 * This includes resume, posts, experience, education, and admin profile
 */
export async function getAdminContextData() {
  try {
    // Get admin profile
    const adminProfile = await prisma.adminProfile.findFirst()

    // Get admin user (assuming first user is admin)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      include: {
        PersonalInfo: true,
        Experience: true,
        Education: true,
        Post: {
          where: { published: true },
          select: {
            title: true,
            description: true,
            content: true,
            hashtags: true,
          },
        },
      },
    })

    if (!adminUser) {
      return null
    }

    // Format the data into a comprehensive context string
    const contextData = {
      personalInfo: adminUser.PersonalInfo?.[0] || {},
      experience: adminUser.Experience || [],
      education: adminUser.Education || [],
      posts: adminUser.Post || [],
      profile: adminProfile || {},
    }
    return contextData
  } catch (error) {
    console.error(' Error fetching admin context data:', error)
    return null
  }
}

/**
 * Creates a system prompt for the AI with admin context
 */
export function createSystemPrompt(contextData: any): string {
  const personalInfo = contextData?.personalInfo || {}
  const experience = contextData?.experience || []
  const education = contextData?.education || []
  const posts = contextData?.posts || []
  const profile = contextData?.profile || {}

  const systemPrompt = `You are an AI assistant representing ${
    personalInfo.firstName || 'the admin'
  }. Your role is to answer questions ONLY about the admin's professional background, experience, skills, and achievements.

ADMIN INFORMATION:
Name: ${personalInfo.firstName} ${personalInfo.lastName}
Email: ${personalInfo.email}
LinkedIn: ${personalInfo.linkedin}
Bio: ${profile.bio || 'Not provided'}
Specialties: ${profile.specialties?.join(', ') || 'Not provided'}
Years of Experience: ${profile.yearsExperience || 'Not provided'}
Awards: ${profile.awards?.join(', ') || 'None listed'}

PROFESSIONAL EXPERIENCE:
${
  experience
    .map(
      (exp: any) =>
        `- ${exp.position} at ${exp.organization} (${exp.location})
   Duration: ${new Date(exp.startDate).getFullYear()} - ${
          exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'
        }
   Responsibilities: ${exp.responsibilities?.join(', ') || 'Not specified'}`
    )
    .join('\n') || 'No experience listed'
}

EDUCATION:
${
  education
    .map(
      (edu: any) =>
        `- ${edu.degree || 'Degree'} in ${edu.major} from ${edu.institution} (${
          edu.location
        })
   Graduation: ${new Date(edu.graduationDate).getFullYear()}
   GPA: ${edu.gpa || 'Not specified'}`
    )
    .join('\n') || 'No education listed'
}

PUBLISHED ARTICLES/BLOG POSTS:
${
  posts
    .map((post: any) => `- "${post.title}": ${post.description}`)
    .join('\n') || 'No published posts'
}

IMPORTANT RULES:
1. Only answer questions about the admin's professional background, experience, skills, awards, and published content.
2. If someone asks about something NOT related to the admin, politely redirect them by saying: "I'm here to help with questions about the admin's professional background and experience. Is there anything specific about their career, skills, or achievements you'd like to know?"
3. If you don't have information about something the user asks, be honest and say: "I don't have that information available. You might want to reach out directly to ${
    personalInfo.email
  } for more details."
4. Be professional, friendly, and concise in your responses.
5. Do not make up or assume information not provided in the context above.`

  return systemPrompt
}

/**
 * Saves chat message to database
 */
// export async function saveChatMessage(
//   sessionId: string,
//   message: string | { content: string },
//   response: string
// ) {
//   try {
//     // Extract message content if it's an object
//     const messageContent =
//       typeof message === 'string' ? message : message.content

//     await prisma.chatHistory.create({
//       data: {
//         sessionId,
//         message: messageContent,
//         response,
//         role: 'user',
//       },
//     })
//   } catch (error) {
//     console.error(' Error saving chat message:', error)
//   }
// }

/**
 * Gets chat history for a session
 */
export async function getChatHistory(sessionId: string) {
  try {
    return await prisma.chatHistory.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 50, // Last 50 messages
    })
  } catch (error) {
    console.error(' Error fetching chat history:', error)
    return []
  }
}
