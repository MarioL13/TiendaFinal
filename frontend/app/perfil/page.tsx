// pages/profile.jsx
import ProfileCard from "@/components/Perfil";
export default function ProfilePage() {
  const user = {
    name: "Tony",
    surname: "Stark",
    email: "tony.stark@avengers.com",
    phone: "123-456-7890",
    address: "Stark Tower, New York",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ProfileCard user={user} />
    </div>
  );
}
