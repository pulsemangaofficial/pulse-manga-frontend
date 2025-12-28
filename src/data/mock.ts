export interface Manga {
    id: string;
    title: string;
    cover: string;
    rating: number;
    status: "Ongoing" | "Completed";
    latestChapter: string;
    updatedAt: string;
    genres: string[];
}

export const MOCK_MANGA: Manga[] = [
    {
        id: "1",
        title: "Solo Leveling",
        cover: "https://dummyimage.com/300x450/161B26/3498DB&text=Solo+Leveling",
        rating: 4.8,
        status: "Completed",
        latestChapter: "179",
        updatedAt: "2 days ago",
        genres: ["Action", "Fantasy"]
    },
    {
        id: "2",
        title: "One Piece",
        cover: "https://dummyimage.com/300x450/161B26/FF9D00&text=One+Piece",
        rating: 4.9,
        status: "Ongoing",
        latestChapter: "1105",
        updatedAt: "1 hour ago",
        genres: ["Adventure", "Comedy"]
    },
    {
        id: "3",
        title: "Jujutsu Kaisen",
        cover: "https://dummyimage.com/300x450/161B26/E0E6ED&text=Jujutsu+Kaisen",
        rating: 4.7,
        status: "Ongoing",
        latestChapter: "248",
        updatedAt: "3 hours ago",
        genres: ["Action", "Supernatural"]
    },
    {
        id: "4",
        title: "Chainsaw Man",
        cover: "https://dummyimage.com/300x450/161B26/FF4444&text=Chainsaw+Man",
        rating: 4.6,
        status: "Ongoing",
        latestChapter: "153",
        updatedAt: "5 hours ago",
        genres: ["Horror", "Action"]
    },
    {
        id: "5",
        title: "Spy x Family",
        cover: "https://dummyimage.com/300x450/161B26/55BB55&text=Spy+x+Family",
        rating: 4.8,
        status: "Ongoing",
        latestChapter: "92",
        updatedAt: "1 day ago",
        genres: ["Comedy", "Slice of Life"]
    }
];

export const HOT_UPDATES = [...MOCK_MANGA, ...MOCK_MANGA]; // Duplicate for slider length
