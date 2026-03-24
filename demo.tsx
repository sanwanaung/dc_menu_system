export type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  ordersToday: number;
  averageRating: number; // 0-5
};

export type PopularMenuItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  ratingAverage: number;
  ratingCount: number;
};

export type RecentOrder = {
  id: string;
  guestName: string;
  itemsCount: number;
  totalPrice: string;
  status: "Pending" | "Preparing" | "Completed" | "Cancelled";
  createdAt: string;
};

export const demoDashboard: {
  stats: DashboardStats;
  popularItems: PopularMenuItem[];
  recentOrders: RecentOrder[];
} = {
  stats: {
    totalUsers: 1284,
    activeUsers: 312,
    ordersToday: 47,
    averageRating: 4.38,
  },
  popularItems: [
    {
      id: "mi_01",
      name: "Club Sandwich",
      category: "All Day Dining",
      price: "$12.00",
      ratingAverage: 4.6,
      ratingCount: 182,
    },
    {
      id: "mi_02",
      name: "Caesar Salad",
      category: "Salads",
      price: "$8.50",
      ratingAverage: 4.4,
      ratingCount: 121,
    },
    {
      id: "mi_03",
      name: "Grilled Salmon",
      category: "Mains",
      price: "$18.90",
      ratingAverage: 4.7,
      ratingCount: 94,
    },
    {
      id: "mi_04",
      name: "Spaghetti Carbonara",
      category: "Pasta",
      price: "$14.20",
      ratingAverage: 4.5,
      ratingCount: 88,
    },
    {
      id: "mi_05",
      name: "Iced Latte",
      category: "Beverages",
      price: "$4.00",
      ratingAverage: 4.3,
      ratingCount: 240,
    },
  ],
  recentOrders: [
    {
      id: "ORD-10492",
      guestName: "Room 508",
      itemsCount: 3,
      totalPrice: "$28.40",
      status: "Preparing",
      createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    },
    {
      id: "ORD-10491",
      guestName: "Table 12",
      itemsCount: 2,
      totalPrice: "$16.00",
      status: "Pending",
      createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    },
    {
      id: "ORD-10490",
      guestName: "Room 214",
      itemsCount: 5,
      totalPrice: "$52.70",
      status: "Completed",
      createdAt: new Date(Date.now() - 44 * 60 * 1000).toISOString(),
    },
    {
      id: "ORD-10489",
      guestName: "Table 3",
      itemsCount: 1,
      totalPrice: "$4.00",
      status: "Cancelled",
      createdAt: new Date(Date.now() - 72 * 60 * 1000).toISOString(),
    },
  ],
};

export type DemoRoom = {
  id: string;
  name: string;
  // imgUrl?: string | null;
  roomQR: string;
  type: string;
  floor: string;
  // createdAt: string;
  // updatedAt: string;
};

export type DemoRoomServiceStatus =
  | "PENDING"
  | "ACCEPTED"
  | "CANCELED"
  | "FINISHED";

export type DemoRoomServiceOrder = {
  id: string;
  roomId: string;
  date: string; // yyyy-MM-dd
  startTime: string; // ISO
  endTime: string; // ISO
  notes?: string | null;
  status: DemoRoomServiceStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

const now = Date.now();
const today = new Date(now);
const todayYmd = today.toISOString().slice(0, 10);

export const demoRooms: DemoRoom[] = [
  {
    id: "111",
    name: "Room 101",
    roomQR: "QR-RM-101",
    type: "Family",
    floor: "Floor 1",
  },
  {
    id: "222",
    name: "Room 201",
    roomQR: "QR-RM-201",
    type: "Superior",
    floor: "Floor 2",
  },
];

export const demoRoomServiceOrders: DemoRoomServiceOrder[] = [
  {
    id: "RSO-2026-0008",
    roomId: "rm_508",
    date: todayYmd,
    startTime: new Date(now - 26 * 60 * 1000).toISOString(),
    endTime: new Date(now + 34 * 60 * 1000).toISOString(),
    notes: "No onions, please.",
    status: "ACCEPTED",
    createdAt: new Date(now - 27 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "RSO-2026-0007",
    roomId: "rm_214",
    date: todayYmd,
    startTime: new Date(now - 52 * 60 * 1000).toISOString(),
    endTime: new Date(now + 18 * 60 * 1000).toISOString(),
    notes: null,
    status: "PENDING",
    createdAt: new Date(now - 52 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 52 * 60 * 1000).toISOString(),
  },
  {
    id: "RSO-2026-0006",
    roomId: "rm_101",
    date: todayYmd,
    startTime: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(now - 90 * 60 * 1000).toISOString(),
    notes: "Deliver to the balcony door.",
    status: "FINISHED",
    createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 88 * 60 * 1000).toISOString(),
  },
  {
    id: "RSO-2026-0005",
    roomId: "rm_612",
    date: todayYmd,
    startTime: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(now - 4.5 * 60 * 60 * 1000).toISOString(),
    notes: "Guest canceled before preparation.",
    status: "CANCELED",
    createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 4.8 * 60 * 60 * 1000).toISOString(),
  },
];
