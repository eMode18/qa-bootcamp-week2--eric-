let employee: {
  readonly id: number;
  name: string;
  retire: (date: Date) => void;
} = {
  id: 1,
  name: "Eric",
  retire: (date: Date) => {
    console.log(
      `Employee ${employee.name} will retire on ${date.toISOString()}`,
    );
  },
};
