import { Navigate } from 'react-router-dom'

// Compatibility route kept for existing links; the maintained scanner lives at /scanner.
export default function Experience() {
  return <Navigate to="/scanner" replace />
}
