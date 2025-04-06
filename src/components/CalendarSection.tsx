
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

interface ScheduleItem {
  id: number;
  time: string;
  activity: string;
}

const CalendarSection = () => {
  // Sample schedule items
  const scheduleItems: ScheduleItem[] = [
    { id: 1, time: "9:00 am", activity: "Morning Rituals" },
    { id: 2, time: "12:00 pm", activity: "Lunch" },
    { id: 3, time: "1:30 pm", activity: "Study Blockchain" },
    { id: 4, time: "5:00 pm", activity: "Study AI Agents" },
    { id: 5, time: "8:00 pm", activity: "Cook & Dinner" },
  ];

  return (
    <Card className="w-full shadow-md border-0 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2 text-blue-800 dark:text-blue-300">
          <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
            <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          Today's Schedule
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-3">
          {scheduleItems.map((item) => (
            <div 
              key={item.id} 
              className="flex gap-3 items-start p-2 rounded-md hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="min-w-[80px] text-xs font-medium text-blue-700 dark:text-blue-400">{item.time}</div>
              <div className="text-xs text-gray-700 dark:text-gray-300">{item.activity}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSection;
