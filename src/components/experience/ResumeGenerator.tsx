'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import type { Experience, Education, PersonalInfo } from '@/lib/types'

interface ResumeGeneratorProps {
  experiences: Experience[]
  education: Education[]
  personalInfo: PersonalInfo
}

export function ResumeGenerator({
  experiences,
  education,
  personalInfo,
}: ResumeGeneratorProps) {
  const resumeRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${personalInfo.firstName}_${personalInfo.lastName}_Resume`,
  })

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    const startMonth = start.toLocaleDateString('en-US', { month: 'long' })
    const startYear = start.getFullYear()

    if (end) {
      const endMonth = end.toLocaleDateString('en-US', { month: 'long' })
      const endYear = end.getFullYear()
      return `${startMonth} ${startYear} – ${endMonth} ${endYear}`
    }

    return `${startMonth} ${startYear} – Present`
  }

  const sortedExperiences = [...experiences].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  const sortedEducation = [...education].sort(
    (a, b) =>
      new Date(b.graduationDate).getTime() -
      new Date(a.graduationDate).getTime()
  )

  return (
    <>
      <Button
        onClick={handlePrint}
        className='bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md flex items-center gap-2 print:hidden'
      >
        <Download className='w-4 h-4' />
        Resume.pdf
      </Button>

      {/* Resume */}
      <div
        ref={resumeRef}
        className='
          hidden print:block 
          bg-white text-black 
          p-8 max-w-3xl mx-auto 
          font-serif text-[11pt] leading-snug
        '
      >
        {/* Header */}
        <header className='text-center mb-4'>
          <h1 className='text-xl font-bold tracking-wide'>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className='text-sm flex flex-wrap items-center justify-center gap-2'>
            <span>{personalInfo.address}</span>
            <span>|</span>
            <span>{personalInfo.email}</span>
            <span>|</span>
            <span>{personalInfo.linkedin}</span>
          </p>
        </header>

        {/* Experience */}
        <section className='mb-4'>
          <h2 className='font-bold uppercase border-b border-gray-400 mb-2 text-sm'>
            Experience
          </h2>
          {sortedExperiences.map((exp) => (
            <div key={exp.id} className='mb-3'>
              <div className='flex justify-between text-sm font-bold'>
                <span>{exp.organization}</span>
                <span>{exp.location}</span>
              </div>
              <div className='flex justify-between text-xs italic'>
                <span>{exp.position}</span>
                <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
              </div>
              <ul className='list-disc ml-5 text-xs'>
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className='mb-4'>
          <h2 className='font-bold uppercase border-b border-gray-400 mb-2 text-sm'>
            Education
          </h2>
          <ul className='list-disc ml-5 text-xs'>
            {sortedEducation.map((edu) => (
              <li key={edu.id}>
                <div className='mb-2 flex gap-1 items-center'>
                  <span className='font-bold'>{edu.institution}</span>
                  <span>|</span>
                  <div className='flex items-center gap-1 text-xs'>
                    <span>{edu.degree}</span>
                    <span>{edu.major}</span>
                    {/* <span>
                  {new Date(edu.graduationDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span> */}
                  </div>
                  {/* {edu.details && (
                <p className='text-xs text-gray-700'>{edu.details}</p>
              )} */}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills & Interests */}
        {/* {personalInfo.skills?.length ? (
          <section>
            <h2 className='font-bold uppercase border-b border-gray-400 mb-2 text-sm'>
              Skills & Interests
            </h2>
            <ul className='list-disc ml-5 text-xs'>
              {personalInfo.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </section>
        ) : null} */}
      </div>
    </>
  )
}
