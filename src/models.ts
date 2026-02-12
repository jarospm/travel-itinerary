export type Activity = {
  id: string;
  name: string;
  cost: number;
  category: 'food' | 'transport' | 'sightseeing';
  startTime: Date;
};
export type Trip = {
  id: string;
  destination: string;
  startDate: Date;
  activities: Activity[];
};
