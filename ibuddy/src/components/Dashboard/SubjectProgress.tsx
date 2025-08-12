import Card from '../UI/Card'
import type { Subject } from '../../types'

interface SubjectProgressProps {
  subjects: Subject[]
}

interface ProgressCircleProps {
  subject: Subject
}

function ProgressCircle({ subject }: ProgressCircleProps): JSX.Element {
  const circumference = 2 * Math.PI * 20 // radius of 20
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (subject.progress / 100) * circumference

  return (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-2">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 44 44">
          {/* Background circle */}
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-500 ${subject.color.replace('bg-', 'text-')}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-900">
            {subject.progress}%
          </span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-900">{subject.name}</p>
    </div>
  )
}

export default function SubjectProgress({ subjects }: SubjectProgressProps): JSX.Element {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">IB Progress</h3>
      <div className="grid grid-cols-2 gap-4">
        {subjects.map(subject => (
          <ProgressCircle key={subject.name} subject={subject} />
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Focus Area:</strong> Chemistry needs attention (45%). Consider scheduling extra study time.
        </p>
      </div>
    </Card>
  )
}