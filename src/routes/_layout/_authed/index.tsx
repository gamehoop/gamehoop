import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/')({
  component: Home,
});

function Home() {
  return <div></div>;
}
