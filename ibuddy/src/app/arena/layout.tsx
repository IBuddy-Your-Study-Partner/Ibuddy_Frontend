import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'iBuddy - Arena Mode',
    description: 'Immersive focus mode for deep work sessions',
}

interface ArenaLayoutProps {
    children: React.ReactNode
}

export default function ArenaLayout({ children }: ArenaLayoutProps) {
  return (
    <div className="arena-mode">
        {children}
    </div>
  )
}