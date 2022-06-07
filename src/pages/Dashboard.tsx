import { useAccount } from 'hooks/useAccount';

const Dashboard = () => {
  const { account } = useAccount();
  console.log({ account });
  return <div>Dashboard</div>;
};

export default Dashboard;
