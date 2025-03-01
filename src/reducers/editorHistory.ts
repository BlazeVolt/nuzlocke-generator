import { Action, REDO_EDITOR_HISTORY, UNDO_EDITOR_HISTORY, UPDATE_EDITOR_HISTORY } from 'actions';
import { init, last, lift } from 'ramda';
import { diff, applyChange, Diff, applyDiff, revertChange } from 'deep-diff';

export interface History<T> {
    past: any[];
    present?: T;
    future: any[];
    lastRevisionType: 'undo' | 'redo' | 'update' | 'load';
}

export function editorHistory(
    state: History<any> = {
        past: [],
        present: undefined,
        future: [],
        lastRevisionType: 'update',
    },
    action: Action<UNDO_EDITOR_HISTORY | UPDATE_EDITOR_HISTORY | REDO_EDITOR_HISTORY>,
): History<any> {
    switch (action.type) {
        case UPDATE_EDITOR_HISTORY:
            const { present, future, past } = state;

            if (action.present == null) {
                return state;
            }

            return {
                past: present == null ? past : [...past, present],
                present: action.present,
                // reset the future so we can't create a forked path
                future: [],
                lastRevisionType: 'update',
            };

        case UNDO_EDITOR_HISTORY:
            const undo = (): History<any> => {
                const { past, present, future } = state;

                const latest = past ? last(past) : [];
                const newPast = past.slice(0, past.length - 1);
                return {
                    past: newPast,
                    present: action.present,
                    future: [present, ...future],
                    lastRevisionType: 'undo',
                };
            };

            return undo();

        case REDO_EDITOR_HISTORY:
            const redo = (): History<any> => {
                const { past, present, future } = state;

                const next = future[0];
                const newFuture = future.slice(1);

                return {
                    past: [...past, present],
                    present: action.present,
                    future: newFuture,
                    lastRevisionType: 'redo',
                };
            };

            return redo();

        default:
            return state;
    }
}

