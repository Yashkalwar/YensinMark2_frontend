
import { Card, CardContent } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface YoutubeItem {
  id: number;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
}

const YoutubeSection = () => {
  // YouTube items with matching content and URLs
  const youtubeItems: YoutubeItem[] = [
    {
      id: 1,
      title: "How to Build a React App in 10 Minutes",
      channel: "CodeMaster",
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=320&h=180",
      url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM"
    },
    {
      id: 2,
      title: "Learn Tailwind CSS - Complete Course",
      channel: "CSS Wizards",
      thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=320&h=180",
      url: "https://www.youtube.com/watch?v=lCxcTsOHrjo"
    },
    {
      id: 3,
      title: "TypeScript Tips and Tricks",
      channel: "TS Guru",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=320&h=180",
      url: "https://www.youtube.com/watch?v=30LWjhZzg50"
    },
    {
      id: 4,
      title: "Building Modern UIs - Design Patterns",
      channel: "UI Masters",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=320&h=180",
      url: "https://www.youtube.com/watch?v=MqYm3LIcpoQ"
    }
  ];

  return (
    <div className="space-y-3 max-h-[calc(100vh-2.5rem)] overflow-y-auto pr-1">
      <Card className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 border-0 shadow">
        <h2 className="text-md font-medium flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          <span className="text-slate-800 dark:text-slate-200">YouTube Videos</span>
        </h2>
      </Card>
      
      <div className="grid gap-3">
        {youtubeItems.map((item) => (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            key={item.id}
            className="block group transition-transform duration-300 transform hover:-translate-y-1"
          >
            <Card className="overflow-hidden shadow hover:shadow-md transition-shadow duration-300 border-0">
              <div className="relative">
                <AspectRatio ratio={16/9} className="max-h-24">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Youtube className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </div>
              
              <CardContent className="py-2 px-3 bg-white dark:bg-gray-800">
                <h3 className="font-medium text-xs line-clamp-1 text-gray-800 dark:text-gray-200 mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs text-gray-500 dark:text-gray-400">{item.channel}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default YoutubeSection;
