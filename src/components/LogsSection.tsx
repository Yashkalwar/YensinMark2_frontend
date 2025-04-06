
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

const LogsSection = () => {
  // Sample log entries
  const logEntries = [
    { id: 1, text: "Added Study Session for Blockchain." },
    { id: 2, text: "John emailed last night." },
    { id: 3, text: "Meeting with Jake upcoming." },
  ];

  return (
    <Card className="w-full shadow-md border-0 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex items-center gap-2 text-purple-800 dark:text-purple-300">
          <div className="bg-purple-100 dark:bg-purple-900 p-1.5 rounded-full">
            <ClipboardList className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          {logEntries.map((entry) => (
            <div 
              key={entry.id} 
              className="flex gap-3 items-start p-2 rounded-md hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors"
            >
              <div className="text-purple-500 dark:text-purple-400">•</div>
              <div className="text-xs text-gray-700 dark:text-gray-300">{entry.text}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogsSection;
