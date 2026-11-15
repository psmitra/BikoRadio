import Card from '../components/ui/Card'

export default function Placeholder({ title }: { title: string }) {
  return (
    <Card>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-muted">This page will be built in the next phase.</p>
    </Card>
  )
}
