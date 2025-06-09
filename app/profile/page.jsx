import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className='p-4'>
        <h1 className='text-2xl font-bold'>My Profile</h1>
        {/* secure content here */}
      </div>
    </ProtectedRoute>
  );
}
