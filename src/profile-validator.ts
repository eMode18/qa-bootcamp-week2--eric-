type Profile = {
  id: number;
  username: string;
  settings?: {
    notifications: boolean;
  };
};

let testUser1: Profile = {
  id: 1,
  username: "testuser1",
  settings: {
    notifications: true,
  },
};

let testUser2: Profile = {
  id: 2,
  username: "testuser2",
};

let testUser3: Profile = {
  id: 3,
  username: "testuser3",
  settings: {
    notifications: false,
  },
};

function isNotified(user: Profile): boolean {
  return user.settings?.notifications ?? false;
}

for (let user of [testUser1, testUser2, testUser3]) {
  console.log(`User ${user.username} is notified: ${isNotified(user)}`);
}
