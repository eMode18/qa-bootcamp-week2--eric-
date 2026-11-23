type Employee = {
  readonly id: number;
  name: string;
  retire: (date: Date) => void;
};

let staff: Employee = {
  id: 1,
  name: "Eric",
  retire: (date: Date) => {
    console.log(`Employee ${staff.name} will retire on ${date.toISOString()}`);
  },
};
