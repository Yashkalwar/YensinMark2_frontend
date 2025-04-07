import { useState } from "react";
import CalendarSection from "@/components/CalendarSection";
import LogsSection from "@/components/LogsSection";
import MessageArea from "@/components/MessageArea";
import YoutubeSection from "@/components/YoutubeSection";
import MessageInput from "@/components/MessageInput";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message, BackendResponse } from "@/types/message";

const Index = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mockResponses: BackendResponse[] = [
    { output: "I'm sorry, I can't connect to the backend right now. This is a fallback response.", agent_name: "Mia" },
    { output: "The backend seems to be offline. Here's a simulated response instead.", agent_name: "Flock" },
    { output: "I'm currently running in offline mode. In a real scenario, I would fetch responses from the backend.", agent_name: "Doctor Strange" },
    { output: "Backend connection failed. Try running the local server at http://51.21.162.46:8000 for actual AI responses.", agent_name: "Sara" },
    { output: "This is a placeholder message. Please ensure your backend server is running for real responses.", agent_name: "Mia" }
  ];

  const getRandomMockResponse = () => {
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  };

  const processMessageWithBackend = async (userMessage: string) => {
    setIsLoading(true);
    try {
      console.log("Sending message to backend:", userMessage);
      const controller = new AbortController();
      // Increase timeout from 10 seconds to 60 seconds to give the backend more time to process
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch("http://51.21.162.46:8000/process-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userMessage }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error("Error response:", errorText);
        throw new Error(`Server responded with status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Received data from backend:", data);
      
      // Check if output is an object with final_response_to_user (new format)
      if (data.output && typeof data.output === 'object' && data.output.final_response_to_user) {
        console.log("Detected nested output structure with final_response_to_user");
        return { 
          output: data.output.final_response_to_user, 
          agent_name: data.output.current_agent_name || "Mia",
          agent_type: data.output.current_agent_type || "orchestrator",
          voice_text: data.output.summarized_response || "" // Use summarized_response for audio
        };
      } else {
        // Fallback to old format
        console.log("Using direct output format");
        return { 
          output: data.output, 
          agent_name: data.agent_name || "Mia", // Default to "Mia" if agent_name is not provided
          agent_type: data.agent_type || "orchestrator", // Default to orchestrator for old format
          voice_text: "" // No summarized response available in old format
        };
      }
    } catch (error) {
      console.error("Error processing message:", error);

      let errorDescription = "Could not connect to the AI backend. Using fallback response instead.";

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorDescription = "Could not connect to the AI backend. Please ensure the server is running at http://51.21.162.46:8000.";
        console.error("Failed to fetch error - backend server might not be running");
      } else if (String(error).includes("405")) {
        errorDescription = "CORS issue detected (405 Method Not Allowed). Add CORS middleware to your backend.";
        console.error("CORS issue detected");
      } else if (error.name === "AbortError") {
        errorDescription = "Request timed out. The backend server took too long to respond.";
        console.error("Request timeout");
      } else {
        console.error("Other error:", String(error));
      }

      toast({
        title: "Connection Error",
        description: errorDescription,
        variant: "destructive",
      });

      return getRandomMockResponse();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      const userMessage: Message = { text: message, isUser: true };
      setMessages((prev) => [...prev, userMessage]);
      setCurrentMessage("");

      const response = await processMessageWithBackend(message);
      
      if (response) {
        const aiMessage: Message = { 
          text: response.output, 
          isUser: false,
          agent_name: response.agent_name,
          agent_type: response.agent_type,
          voice_text: response.voice_text || response.output // Use voice_text if available, otherwise fallback to output
        };
        console.log("Creating AI message:", {
          agent_name: response.agent_name,
          agent_type: response.agent_type,
          voice_text: response.voice_text
        });
        setMessages((prev) => [...prev, aiMessage]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950 dark:to-slate-900 flex flex-col">
      <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm py-3 px-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="w-9"></div> {/* Empty div for spacing */}
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-blue-600 dark:text-blue-400">NAAVI</span>
          </div>
          
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80" alt="Profile" />
            <AvatarFallback>NA</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="container mx-auto px-3 py-5 max-w-full flex-grow">
        <div className="grid grid-cols-12 gap-5">
          <div className={`${leftCollapsed ? 'col-span-1' : 'col-span-3 lg:col-span-2'} relative transition-all duration-300`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute -right-3 top-1/2 z-10 h-8 w-8 rounded-full p-0 shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              onClick={() => setLeftCollapsed(!leftCollapsed)}
            >
              {leftCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            
            {leftCollapsed ? (
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center shadow-lg">
                <CalendarIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            ) : (
              <div className="space-y-4 h-[calc(100vh-7.5rem)] overflow-auto">
                <CalendarSection />
                <LogsSection />
              </div>
            )}
          </div>

          <div className={`${leftCollapsed && rightCollapsed ? 'col-span-10' : leftCollapsed || rightCollapsed ? 'col-span-8 lg:col-span-9' : 'col-span-6 lg:col-span-8'} flex flex-col h-[calc(100vh-7.5rem)]`}>
            <div className="flex-grow rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col shadow-xl">
              <MessageArea messages={messages} isLoading={isLoading} />
              <MessageInput 
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
                handleSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className={`${rightCollapsed ? 'col-span-1' : 'col-span-3 lg:col-span-2'} relative transition-all duration-300`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute -left-3 top-1/2 z-10 h-8 w-8 rounded-full p-0 shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              onClick={() => setRightCollapsed(!rightCollapsed)}
            >
              {rightCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            
            {rightCollapsed ? (
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center shadow-lg">
                <Youtube className="h-5 w-5 text-red-600" />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 h-[calc(100vh-7.5rem)] overflow-hidden shadow-lg p-3">
                <YoutubeSection />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default Index;
