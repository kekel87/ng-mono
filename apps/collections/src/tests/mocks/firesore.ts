export const snapshot = [
  {
    type: 'added',
    payload: {
      doc: {
        id: 'id1',
        data: () => ({
          name: 'Entity 1',
          acquired: false,
        }),
      },
    },
  },
  {
    type: 'added',
    payload: {
      doc: {
        id: 'id2',
        data: () => ({
          name: 'Entity 1',
          acquired: false,
        }),
      },
    },
  },
];
