import { css } from 'lit'

/** shared look of the card, based on the variables of the Home Assistant theme (light and dark) */
export const style = css`
  :host {
    --hg-radius: 12px;
    --hg-border: var(--divider-color, rgba(127, 127, 127, 0.3));
    --hg-comfort: var(--state-climate-heat-color, #ff8100);
    --hg-eco: var(--state-climate-cool-color, #2b9af9);
    --hg-off: var(--state-climate-off-color, #8a8a8a);
    --hg-muted: var(--secondary-text-color);
    color: var(--primary-text-color);
  }

  button {
    font: inherit;
    color: inherit;
  }

  .hint {
    color: var(--hg-muted);
    font-size: 0.8rem;
    line-height: 1.3;
    margin: 0;
  }

  .segmented {
    display: inline-flex;
    gap: 2px;
    padding: 3px;
    border-radius: 18px;
    background-color: rgba(127, 127, 127, 0.12);
  }

  .segmented button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 28px;
    padding: 0 8px;
    border: none;
    border-radius: 14px;
    background: transparent;
    color: var(--hg-muted);
    cursor: pointer;
    font-size: 0.85rem;
    --mdc-icon-size: 18px;
  }

  .segmented button.selected {
    background-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.18);
    color: var(--primary-text-color);
    padding: 0 10px 0 8px;
  }

  .segmented button.selected.heating ha-icon {
    color: var(--hg-comfort);
  }

  .segmented button.selected.cooling ha-icon {
    color: var(--hg-eco);
  }
`
