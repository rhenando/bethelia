// app/dashboard/page.jsx (or wherever the user lands after login)
import { currentUser } from "@clerk/nextjs/server";
import { syncUserToFirestore } from "@/lib/syncUserToFirestore";

export default async function DashboardPage() {
  const user = await currentUser();
  await syncUserToFirestore(user);

  return (
    <div>
      {/* Your dashboard content */}
      <h1>Welcome to your buyer dashboard</h1>
    </div>
  );
}
