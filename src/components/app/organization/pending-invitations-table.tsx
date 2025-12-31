import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Table } from '@/components/ui/table';
import { Title } from '@/components/ui/title';
import { Invitation } from '@/lib/auth';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/logger';
import { capitalize } from '@/utils/string';
import { useRouter } from '@tanstack/react-router';
import { Send } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface PendingInvitationsTableProps {
  invitations: Invitation[];
}

export function PendingInvitationsTable({
  invitations,
}: PendingInvitationsTableProps) {
  const router = useRouter();
  const notify = useNotifications();
  const [resending, setResending] = useState(false);

  const onResend = async (invitation: Invitation) => {
    if (resending) {
      return;
    }

    try {
      setResending(true);
      await authClient.organization.inviteMember({
        email: invitation.email,
        organizationId: invitation.organizationId,
        role: invitation.role,
        resend: true,
      });
      await router.invalidate();
      notify.success({
        title: 'Member invitation sent',
        message: 'An invitation has been sent via email.',
      });
    } catch (err) {
      logger.error(err);
      notify.error({
        title: 'Failed to send member invitation',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setResending(false);
    }
  };

  const pendingInvitations = useMemo(
    () => invitations.filter((i) => i.status === 'pending'),
    [invitations],
  );

  return (
    <>
      <Title order={4}>Pending Invitations ({pendingInvitations.length})</Title>
      <Table striped withTableBorder className="mt-4">
        <Table.Head>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Expires At</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {pendingInvitations.map((invitation) => (
            <Table.Tr key={invitation.id}>
              <Table.Td className="flex justify-center">
                <Avatar size="md" />
              </Table.Td>
              <Table.Td>{invitation.email}</Table.Td>
              <Table.Td>{capitalize(invitation.role)}</Table.Td>
              <Table.Td>
                {invitation.expiresAt.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Table.Td>
              <Table.Td>
                <Button
                  onClick={() => onResend(invitation)}
                  loading={resending}
                  leftSection={<Send />}
                  size="xs"
                >
                  Resend
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
