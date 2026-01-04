import { ActionIcon } from '@/components/ui/action-icon';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select } from '@/components/ui/select';
import { TextInput } from '@/components/ui/text-input';
import { Game } from '@/db/types';
import {
  gameGenreOptions,
  gamePlatformOptions,
  gameSdkOptions,
} from '@/domain/game';
import { deleteGameLogo } from '@/functions/game/delete-game-logo';
import { updateGame } from '@/functions/game/update-game';
import { updateGameLogo } from '@/functions/game/update-game-logo';
import { useSessionContext } from '@/hooks/use-session-context';
import { logError } from '@/lib/logger';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { Copy, Gamepad2, Save } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import z from 'zod';

export interface GameSettingsFormProps {
  game: Game;
}

export function GameSettingsForm({ game }: GameSettingsFormProps) {
  const { user } = useSessionContext();
  const router = useRouter();
  const notify = useNotifications();
  const logoInput = useRef<HTMLInputElement>(null);

  const formSchema = z.object({
    name: z.string().min(1),
    genre: z.string().optional(),
    platforms: z.array(z.string()).optional(),
    sdk: z.string().optional(),
  });

  const defaultValues: z.infer<typeof formSchema> = {
    name: game.name,
    genre: game.genre ?? undefined,
    platforms: game.platforms ?? undefined,
    sdk: game.sdk ?? undefined,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateGame({
          data: {
            gameId: game.id,
            ...value,
          },
        });
        form.reset(value);
        await router.invalidate();
        notify.success({
          title: 'Game updated',
          message: 'Your changes have been saved.',
        });
      } catch (error) {
        logError(error);
        notify.error({
          title: 'Failed to update game',
          message: 'Something went wrong. Please try again.',
        });
      }
    },
  });

  const onLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const maxFileSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxFileSizeBytes) {
      notify.error({
        title: 'Logo file too large',
        message: 'Please select a file smaller than 2MB.',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      notify.error({
        title: 'Invalid file type',
        message: `Supported file types are png, jpg, jpeg, gif, and webp.`,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('gameId', game.id.toString());
      formData.append('logo', file);
      await updateGameLogo({ data: formData });
      await router.invalidate();
      notify.success({
        title: 'Logo updated',
        message: 'Your new logo has been uploaded.',
      });
    } catch (error) {
      logError(error);
      notify.error({
        title: 'Failed to update logo',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  const onDeleteLogo = async () => {
    try {
      await deleteGameLogo({ data: { gameId: game.id } });
      await router.invalidate();
      notify.success({
        title: 'Logo deleted',
        message: 'The logo has been removed.',
      });
    } catch (error) {
      logError(error);
      notify.error({
        title: 'Failed to delete logo',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  const onCopyId = async () => {
    await window.navigator.clipboard.writeText(game.publicId);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4 max-w-125"
    >
      <div className="flex gap-2 items-center mt-2">
        <input
          ref={logoInput}
          type="file"
          className="hidden"
          onChange={onLogoChange}
        />
        <Avatar
          onClick={() => {
            if (user.role !== 'member') {
              logoInput.current?.click();
            }
          }}
          src={
            game.logo
              ? `/api/games/${game.id}/logo?updatedAt=${game.updatedAt.toString()}`
              : ''
          }
          className="cursor-pointer"
          size="xl"
        >
          <Gamepad2 />
        </Avatar>
        {game.logo && (
          <Button variant="subtle" size="sm" onClick={onDeleteLogo}>
            Delete Logo
          </Button>
        )}
      </div>

      <TextInput
        label="ID"
        name="id"
        value={game.publicId}
        rightSection={
          <ActionIcon variant="transparent" onClick={onCopyId}>
            <Copy />
          </ActionIcon>
        }
        readOnly
      />

      <form.Field name="name">
        {(field) => (
          <TextInput
            label="Name"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
            required
          />
        )}
      </form.Field>

      <form.Field name="genre">
        {(field) => (
          <Select
            label="Genre"
            data={gameGenreOptions}
            name={field.name}
            value={field.state.value}
            onChange={(value) => value && field.handleChange(value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>

      <form.Field name="platforms">
        {(field) => (
          <MultiSelect
            label="Platforms"
            data={gamePlatformOptions}
            name={field.name}
            value={field.state.value}
            onChange={(value) => value && field.handleChange(value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>

      <form.Field name="sdk">
        {(field) => (
          <Select
            label="SDK"
            data={gameSdkOptions}
            name={field.name}
            value={field.state.value}
            onChange={(value) => value && field.handleChange(value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [
          state.isDirty,
          state.canSubmit,
          state.isSubmitting,
        ]}
      >
        {([isDirty, canSubmit, isSubmitting]) => (
          <span>
            <Button
              onClick={() => form.handleSubmit()}
              disabled={!isDirty || !canSubmit || isSubmitting}
              leftSection={<Save />}
              loading={isSubmitting}
            >
              Save Changes
            </Button>
          </span>
        )}
      </form.Subscribe>
    </form>
  );
}
