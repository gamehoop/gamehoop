// @vitest-environment jsdom
import { Game } from '@/db/types';
import { render } from '@/utils/testing';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { GameDangerZone } from '../game-danger-zone';

describe('GameDangerZone', () => {
  it('should render a delete game button', async () => {
    const game = {} as Game;

    const { getByText } = render(<GameDangerZone game={game} />);

    expect(getByText('Danger Zone')).toBeInTheDocument();

    const deleteGameBtn = getByText('Delete Game');
    expect(deleteGameBtn).toBeInTheDocument();

    await userEvent.click(deleteGameBtn);
    expect(getByText('Confirm Game Deletion')).toBeInTheDocument();
  });
});
