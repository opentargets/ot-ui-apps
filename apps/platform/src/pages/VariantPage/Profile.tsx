import ProfileHeader from "./ProfileHeader";

type ProfileProps = {
  varId: string;
};

function Profile({ varId }: ProfileProps) {
  
  return <ProfileHeader varId={varId} />

}

export default Profile;