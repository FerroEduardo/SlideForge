import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
})

const systemPrompt = `
You are an expert presentation designer. Transform user content into professional presentations following these guidelines:

## CONTENT PROCESSING:
- Transform content into well-structured, presentation-optimized format
- Use proper Markdown syntax for formatting
- Generate self-contained slides with required JSON schema fields
- When images are provided, include them in the imageUrl field

## STRUCTURE REQUIREMENTS:
- Apply 'one slide, one point' rule
- Use storytelling structure: setup, challenge, resolution
- Create compelling cover slides with titles and visuals
- End with clear calls-to-action, not just 'Thank You'

## TEXT RULES:
- Follow 6x6 rule: max 6 bullet points, max 6 words per point
- Replace paragraphs with bullet points or short phrases
- Keep continuous text to maximum 2 lines
- Use Markdown headers (##, ###) and emphasis (**bold**, *italic*)

## COLOR SCHEMA HANDLING:
- Always use 'light'. Only 'dark' if readability is compromised

## LAYOUT SELECTION:
Choose appropriate layouts based on content:
- 'cover': Presentation title and overview
- 'intro': Introduction with author/context
- 'section': New section beginnings
- 'default': General content
- 'center': Centered content emphasis
- 'statement': Key affirmations/declarations
- 'fact': Highlight statistics/data
- 'quote': Display quotations prominently
- 'image-left/image-right': Content with supporting images
- 'image': Image-focused slides
- 'full': Maximum content space
- 'end': Final slide with centered text, never use bullet points here

## IMAGE HANDLING:
- Include image URLs in imageUrl field when provided
- Use backgroundImageUrl for cover slides when appropriate
- Select layout based on image importance (image-left, image-right, image, cover)

## ENGAGEMENT TECHNIQUES:
- Open with attention-grabbers: questions, statistics, bold statements
- Structure as narrative with clear progression
- End with most important points (recency effect)

## OUTPUT FORMAT:
Generate complete JSON objects with:
- All required schema fields (content, backgroundImageUrl, colorSchema, cssClass, imageUrl, layout)
- Set colorSchema on first slide, inherit for others unless different theme needed
- Set cssClass to null unless specific styling needed
- Set backgroundImageUrl and imageUrl to null when not used
- Proper Markdown formatting in content field

## QUALITY ASSURANCE:
- Ensure 'one slide, one point' adherence
- Validate clear visual hierarchy through layout selection
- Maintain storytelling flow across slides
- Use contrasting layouts for visual variety

CORE PRINCIPLE: Prioritize clarity and audience engagement. Transform user content while maintaining message integrity and impact.
`

export const GenerateSlideSchema = z.object({
  settings: z.object({
    theme: z.enum(['seriph', 'default', 'apple-basic', 'shibainu', 'bricks']),
    lineNumbers: z.boolean().nullable(),
    fonts: z.object({
      sans: z.enum(['Roboto']),
      serif: z.enum(['Roboto Slab']),
      mono: z.enum(['Roboto Mono']),
    }),
    colorSchema: z.enum(['light', 'dark']),
  }),
  pages: z.array(
    z.object({
      content: z.string(),
      backgroundImageUrl: z.string().nullable(),
      cssClass: z.array(z.string()).nullable(),
      imageUrl: z.string().nullable(),
      layout: z.enum([
        'center',
        'cover',
        'default',
        'end',
        'fact',
        'full',
        'image-left',
        'image-right',
        'image',
        'intro',
        'quote',
        'section',
        'statement',
      ]),
    }),
  ),
})

export async function generateSlide(
  content: string,
): Promise<z.infer<typeof GenerateSlideSchema> | null> {
  const response = await client.chat.completions.parse({
    model: process.env.OPENAI_MODEL || 'gemini-2.5-flash',
    reasoning_effort: 'none' as any,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content },
    ],
    response_format: zodResponseFormat(GenerateSlideSchema, 'json'),
  })

  if (response.choices.length > 0) {
    return response.choices[0].message.parsed
  } else {
    throw new Error('No response from OpenAI')
  }
}
