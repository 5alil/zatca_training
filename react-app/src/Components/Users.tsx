import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

function Users() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],

    queryFn: async (): Promise<User[]> => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return response.json();
    }
  });

  if (isLoading) return <p>Loading users...</p>;

  if (isError) return <p>Something went wrong!</p>;

  return (
    <div>
      <h2>Users List</h2>

      {data?.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default Users;