
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, BookOpen, Stethoscope, HeartHandshake, UserRound } from "lucide-react";
import { Message } from "@/types/message";
import DOMPurify from 'dompurify';

interface MessageAreaProps {
  messages: Message[];
  isLoading?: boolean;
}

const AgentIcon = ({ agentName }: { agentName?: string }) => {
  switch (agentName?.toLowerCase()) {
    case "flock":
      return <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />;
    case "mia":
      return <HeartHandshake className="h-6 w-6 text-amber-600 dark:text-amber-300" />;
    case "doctor strange":
    case "doctor_strange":
      return <Stethoscope className="h-6 w-6 text-green-600 dark:text-green-300" />;
    case "sara":
      return <UserRound className="h-6 w-6 text-red-600 dark:text-red-300" />;
    default:
      return <Bot className="h-6 w-6 text-purple-600 dark:text-purple-300" />;
  }
};

const getAvatarBackground = (agentName?: string) => {
  switch (agentName?.toLowerCase()) {
    case "flock":
      return "bg-blue-100 dark:bg-blue-900/30";
    case "mia":
      return "bg-amber-100 dark:bg-amber-900/30";
    case "doctor strange":
    case "doctor_strange":
      return "bg-green-100 dark:bg-green-900/30";
    case "sara":
      return "bg-red-100 dark:bg-red-900/30";
    default:
      return "bg-purple-100 dark:bg-purple-900/30";
  }
};



const MessageArea = ({ messages, isLoading = false }: MessageAreaProps) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show only the latest system response without the user's query
  return (
    <ScrollArea className="flex-grow">
      <div className="flex-grow p-4 overflow-y-auto bg-white dark:bg-gray-900 min-h-full">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md p-6 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Type something below to start the conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Find only the last system response */}
            {(() => {
              // Get the last system response (if any)
              const lastSystemResponse = messages.filter(msg => !msg.isUser).pop();
              
              return (
                <>
                  {/* Display only the last system response if it exists */}
                  {lastSystemResponse && (
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 mt-1">
                        <AvatarFallback className={getAvatarBackground(lastSystemResponse.agent_name)}>
                          <AgentIcon agentName={lastSystemResponse.agent_name} />
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className="py-3 px-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-purple-100 dark:border-purple-900/30 rounded-tl-none flex-1 message-content"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lastSystemResponse.text) }}
                      />
                    </div>
                  )}
                  
                  {/* Show loading indicator when waiting for response */}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 mt-1">
                        <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30">
                          <Bot className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="py-3 px-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-purple-100 dark:border-purple-900/30 rounded-tl-none flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                          <span className="ml-2 text-sm text-gray-500">Processing your request...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageArea;
