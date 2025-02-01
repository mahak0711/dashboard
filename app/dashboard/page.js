import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.email}!</p>
      <p>Role: {session.user?.role}</p>
      <p>Phone: {session.user?.phone}</p>
    </div>
  );
}