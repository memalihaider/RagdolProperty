import AgentSidebar from '@/components/AgentSidebar'

export const metadata = {
  title: 'Agent Portal | RAGDOL',
  description: 'Manage your properties and applications',
}

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AgentSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="pt-20 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
