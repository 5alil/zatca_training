// src/components/Greeting.tsx
type GreetingProps = {
  name: string;
  role?: string; // Optional prop
};

export default function Greeting({ name, role = "Developer" }: GreetingProps) {
  return (
    <div className="greeting-card">
      <h2>Hello, {name}!</h2>
      <p>Role: {role}</p>
    </div>
  );
}
