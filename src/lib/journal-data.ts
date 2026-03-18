export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  image: string;
  imageAlt: string;
}

export const journalEntries: JournalEntry[] = [
  {
    id: "je-1",
    title: "The Architecture of Silence",
    date: "2024-12-18",
    tags: ["Architecture", "Light"],
    content: "Today I found myself drawn to the interplay between shadow and structure. There's a particular quality of afternoon light that transforms concrete into poetry. The geometric patterns created by window blinds became a meditation on presence and absence. Architecture isn't just about space—it's about the light that defines it. Every building is a camera, capturing moments of illumination.",
    image: "/images/journal/journal-1.png",
    imageAlt: "Architectural detail with dramatic shadow patterns",
  },
  {
    id: "je-2",
    title: "Window Light Studies",
    date: "2024-12-15",
    tags: ["Light", "Interior"],
    content: "The most simple subjects often yield the most profound results. A window, some blinds, and afternoon sun—that's all it takes to create drama. I spent three hours watching the light shift across a single room, each moment a new composition. The patterns are never quite the same, like snowflakes made of shadow. Patience is the photographer's most valuable lens.",
    image: "/images/journal/journal-2.png",
    imageAlt: "Play of light through window blinds",
  },
  {
    id: "je-3",
    title: "Roads Less Traveled",
    date: "2024-12-10",
    tags: ["Travel", "Landscape"],
    content: "There's a certain poetry in empty roads winding through misty landscapes. Early morning drives through the countryside revealed scenes of quiet beauty. A lone tree standing sentinel, fog rolling across fields, the promise of destination unknown. Sometimes the journey itself becomes the photograph. These roads remind me that not all who wander are lost.",
    image: "/images/journal/journal-3.png",
    imageAlt: "Winding road through misty landscape",
  },
  {
    id: "je-4",
    title: "Café Solitude",
    date: "2024-12-05",
    tags: ["Lifestyle", "Interior"],
    content: "Empty cafés hold a special kind of magic. The morning light streams through windows, illuminating dust particles dancing in the air. There's anticipation in the silence before the rush, potential energy in every empty chair. I've always believed that spaces have moods, and this café was contemplative, almost meditative. The perfect place to lose track of time.",
    image: "/images/journal/journal-4.png",
    imageAlt: "Empty cafe interior with natural light",
  },
  {
    id: "je-5",
    title: "Tools of the Trade",
    date: "2024-12-01",
    tags: ["Photography", "Nostalgia"],
    content: "My first camera sits on the shelf, a reminder of where this journey began. There's something deeply personal about the tools we choose—they become extensions of our vision. Holding this camera, I remember the excitement of those early rolls of film, the anticipation of development. The technology changes, but the essence of photography remains: capturing light, freezing time, telling stories.",
    image: "/images/journal/journal-5.png",
    imageAlt: "Vintage camera on wooden surface",
  },
  {
    id: "je-6",
    title: "Night Movements",
    date: "2024-11-28",
    tags: ["Urban", "Night"],
    content: "The city transforms after dark. What was ordinary becomes extraordinary when bathed in artificial light. Long exposures reveal movements invisible to the naked eye—light trails become brushstrokes on the canvas of night. Urban photography at night is like jazz: improvisational, moody, full of unexpected beauty. Every light trail tells a story of motion and stillness.",
    image: "/images/journal/journal-6.png",
    imageAlt: "Abstract light trails in urban night",
  },
];

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
