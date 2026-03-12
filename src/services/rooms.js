import { supabase } from '../lib/supabase';
import { ROOMS_DATA } from '../data/store';

// Maps the store.js categories to colors for UI consistency
export const CAT_COLORS = {
  "AI & Tech": "#3b3bff", "Finance": "#f39c12", "Healthcare": "#9b5cff",
  "Environment": "#27ae60", "Startup": "#e74c3c", "HR": "#3b8bff",
};
export const CAT_GRADIENTS = {
  "AI & Tech": "linear-gradient(135deg, #1a1a3a, #2d3566)",
  "Finance": "linear-gradient(135deg, #1a2a3a, #1a3a50)",
  "Healthcare": "linear-gradient(135deg, #1a1a3a, #2d3566)",
  "Environment": "linear-gradient(135deg, #1a3a1a, #2a6633)",
  "Startup": "linear-gradient(135deg, #2a1a2a, #3a2040)",
  "HR": "linear-gradient(135deg, #2a2a3a, #3a3a5a)",
};

/**
 * Parses a Supabase room row into the frontend ROOM object format.
 */
const formatRoom = (row) => ({
  id: row.room_id,
  user_id: row.user_id,
  cat: row.category,
  catColor: CAT_COLORS[row.category] || "#3b3bff",
  title: row.title,
  gradient: CAT_GRADIENTS[row.category] || "linear-gradient(135deg, #2a2a3a, #3a3a5a)",
  status: row.status,
  participants: row.participants || 1,
  max_participants: row.max_participants,
  ideas: row.ideas || 0,
  date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  created_at: row.created_at,
  deadline: row.deadline,
  description: row.description,
  score: row.score || "—",
});

export const getRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }

  return data.map(formatRoom);
};

export const createRoom = async (roomData) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("Must be logged in to create a room");

  // Calculate deadline from duration string if provided (mock logic)
  let deadline = null;
  if (roomData.duration && roomData.duration !== "Unlimited") {
    const hours = parseInt(roomData.duration) || 1;
    deadline = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  }

  const newRoom = {
    user_id: userData.user.id,
    title: roomData.title,
    description: roomData.description,
    category: roomData.category,
    max_participants: parseInt(roomData.limit) || 500,
    deadline: deadline,
  };

  const { data, error } = await supabase
    .from('rooms')
    .insert([newRoom])
    .select();

  if (error) throw error;
  return formatRoom(data[0]);
};

/**
 * One-time utility to push the dummy ROOMS_DATA from store.js into Supabase
 * This ignores rooms that don't have a valid uuid format or are already migrated.
 */
export const migrateDummyData = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return; // Need a user to own the legacy rooms

  // Fetch current to avoid duplicates based on title
  const { data: existing } = await supabase.from('rooms').select('title');
  const existingTitles = new Set((existing || []).map(r => r.title));

  const toInsert = ROOMS_DATA
    .filter(r => !existingTitles.has(r.title))
    .map(r => ({
      user_id: userData.user.id,
      title: r.title,
      description: r.description,
      category: r.cat,
      max_participants: 50,
      participants: r.participants,
      ideas: r.ideas,
      score: r.score,
      created_at: new Date(r.date + " 2023").toISOString(), // best effort parse
    }));

  if (toInsert.length > 0) {
    console.log("Migrating dummy data to Supabase...", toInsert);
    await supabase.from('rooms').insert(toInsert);
  }
};
