// Mock data for development
export const mockMeals = [
  {
    id: 1,
    name: "Beef Stew with Rice",
    price: 350,
    image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400&h=300&fit=crop",
    category: "Main Course",
    description: "Tender beef stew served with steamed rice",
    available: true,
    units: 20,
    maxPerPerson: 1,
    restrictions: [3] // Can only be ordered with item ID 3
  },
  {
    id: 2,
    name: "Chapati",
    price: 50,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    category: "Sides",
    description: "Fresh homemade chapati",
    available: true,
    units: null, // Unlimited
    maxPerPerson: 2,
    restrictions: []
  },
  {
    id: 3,
    name: "Vegetable Curry",
    price: 200,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    category: "Main Course",
    description: "Mixed vegetable curry with aromatic spices",
    available: true,
    units: 15,
    maxPerPerson: 1,
    restrictions: []
  },
  {
    id: 4,
    name: "Fruit Salad",
    price: 150,
    image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400&h=300&fit=crop",
    category: "Dessert",
    description: "Fresh seasonal fruit salad",
    available: false,
    units: 10,
    maxPerPerson: 1,
    restrictions: []
  },
  {
    id: 5,
    name: "Ugali",
    price: 80,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop",
    category: "Sides",
    description: "Traditional ugali",
    available: true,
    units: null,
    maxPerPerson: 2,
    restrictions: []
  }
];

export const mockOrders = [
  {
    id: 1,
    customerName: "John Doe",
    customerEmail: "john@company.com",
    items: [
      { mealId: 1, quantity: 1, name: "Beef Stew with Rice", price: 350 },
      { mealId: 2, quantity: 2, name: "Chapati", price: 50 }
    ],
    total: 450,
    paymentStatus: "pending",
    transactionCode: "",
    orderTime: new Date().toISOString(),
    confirmed: false
  },
  {
    id: 2,
    customerName: "Jane Smith",
    customerEmail: "jane@company.com",
    items: [
      { mealId: 3, quantity: 1, name: "Vegetable Curry", price: 200 },
      { mealId: 5, quantity: 1, name: "Ugali", price: 80 }
    ],
    total: 280,
    paymentStatus: "paid",
    transactionCode: "MP12345678",
    orderTime: new Date().toISOString(),
    confirmed: true
  }
];

export const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@company.com",
  role: "customer" // or "admin"
};