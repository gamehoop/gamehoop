import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/player/email-verified')({
  component: PlayerEmailVerified,
});

function PlayerEmailVerified() {
  return <div>Your email has been verified successfully. Happy playing!</div>;
}
