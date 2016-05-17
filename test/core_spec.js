import { expect } from 'chai';
import { List, Map } from 'immutable';

import { setEntries, next, vote } from '../src/core';

describe('application logic', () => {
  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const state = Map();
      const entries = ['V for Vendetta', 'Batman'];
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(Map({
        entries: List.of('V for Vendetta', 'Batman')
      }));
    });
  });

  describe('next', () => {
    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('V for Vendetta', 'Batman', 'Deadpool')
      });

      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote:     Map({ pair: List.of('V for Vendetta', 'Batman') }),
        entries:  List.of('Deadpool')
      }));
    });

    it('puts winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('V for Vendetta', 'Batman'),
          tally: Map({
            'V for Vendetta': 3,
            'Batman': 2
          })
        }),
        entries: List.of('Deadpool', 'Avengers')
      })

      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Deadpool', 'Avengers')
        }),
        entries: List.of('V for Vendetta')
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('V for Vendetta', 'Batman'),
          tally: Map({
            'V for Vendetta': 2,
            'Batman': 2
          })
        }),
        entries: List.of('Deadpool', 'Avengers')
      })

      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Deadpool', 'Avengers')
        }),
        entries: List.of('V for Vendetta', 'Batman')
      }));
    });

    it('marks winner when just one entry left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Deadpool', 'Batman'),
          tally: Map({
            'Deadpool':  4,
            'Batman':    2
          })
        }),
        entries: List()
      });

      const nextState = next(state);

      expect(nextState).to.equal(Map({
        winner: 'Deadpool'
      }));
    });

  });

  describe('vote', () => {
    it('creates a tally for the voted entry', () => {
      const state = Map({
        vote:     Map({ pair: List.of('V for Vendetta', 'Batman') }),
        entries:  List()
      });

      const nextState = vote(state, 'V for Vendetta');

      expect(nextState).to.equal(Map({
        vote: Map({ 
          pair:   List.of('V for Vendetta', 'Batman'),
          tally:  Map({ 'V for Vendetta': 1 }),
        }),
        entries: List()
      }));

    });

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        vote: Map({
          pair:   List.of('V for Vendetta', 'Batman'),
          tally:  Map({
            'V for Vendetta':  2,
            'Batman':          2
          })
        }),
        entries: List()
      });

      const nextState = vote(state, 'Batman');

      expect(nextState).to.equal(Map({
        vote: Map({
          pair:   List.of('V for Vendetta', 'Batman'),
          tally:  Map({
            'V for Vendetta':  2,
            'Batman':          3
          })
        }),
        entries: List()
      }));
    });
  });

});
