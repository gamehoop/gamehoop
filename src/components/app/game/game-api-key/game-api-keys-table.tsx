import { ActionIcon } from '@/components/ui/action-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/ui/menu';
import { Table } from '@/components/ui/table';
import { Title } from '@/components/ui/title';
import { Game, GameApiKey } from '@/db/types';
import { useSessionContext } from '@/hooks/use-session-context';
import { ArrowDown, CirclePlus, Ellipsis, Trash2 } from 'lucide-react';
import { useCreateGameApiKeyModal } from './create-game-api-key-modal';
import { useDeleteGameApiKeyModal } from './delete-game-api-key-modal';

export interface GameApiKeysTableProps {
  game: Game;
  gameApiKeys: GameApiKey[];
}

export function GameApiKeysTable({ game, gameApiKeys }: GameApiKeysTableProps) {
  const { user } = useSessionContext();
  const openCreateGameApiKeyModal = useCreateGameApiKeyModal({ game });
  const onDeleteGameApiKeyModal = useDeleteGameApiKeyModal();

  return (
    <>
      <div className="flex items-center justify-between">
        <Title order={4}>API Keys ({gameApiKeys.length})</Title>
        <Button
          leftSection={<CirclePlus />}
          onClick={openCreateGameApiKeyModal}
          disabled={user.role === 'member'}
        >
          Create API Key
        </Button>
      </div>

      <Table striped withTableBorder className="mt-4">
        <Table.Head>
          <Table.Tr>
            <Table.Th>Description</Table.Th>
            <Table.Th className="flex flex-row gap-1 items-center">
              Created At <ArrowDown />
            </Table.Th>
            <Table.Th>Expires At</Table.Th>
            <Table.Th>Active</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {gameApiKeys
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .map((apiKey) => (
              <Table.Tr key={apiKey.id}>
                <Table.Td className="flex justify-center">
                  {apiKey.description}
                </Table.Td>
                <Table.Td>
                  {apiKey.createdAt.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Table.Td>
                <Table.Td>
                  {apiKey.expiresAt?.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) ?? ''}
                </Table.Td>
                <Table.Td>
                  {
                    <Badge color={!apiKey.active ? 'red' : undefined}>
                      {apiKey.active ? 'Active' : 'Expired'}
                    </Badge>
                  }
                </Table.Td>
                <Table.Td>
                  <Menu>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <Ellipsis />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<Trash2 />}
                        onClick={() => onDeleteGameApiKeyModal(apiKey)}
                        disabled={user.role === 'member'}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Body>
      </Table>
    </>
  );
}
