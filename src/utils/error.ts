export const handleError = (error: unknown): any => {
  console.error(error);

  if (error instanceof Error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }

  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: `Error: ${JSON.stringify(error)}`,
      },
    ],
  };
};
