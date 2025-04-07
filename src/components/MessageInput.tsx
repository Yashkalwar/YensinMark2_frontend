
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import SpeechInput from "./SpeechInput";

interface MessageInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  handleSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput = ({ 
  currentMessage, 
  setCurrentMessage, 
  handleSendMessage,
  isLoading
}: MessageInputProps) => {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(currentMessage);
    }
  };

  return (
    <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky bottom-0 backdrop-blur-sm">
      <div className="flex flex-col gap-2 max-w-4xl mx-auto">
        {isLoading && (
          <div className="text-xs text-center text-blue-500 dark:text-blue-400 animate-pulse">
            {/* Show more detailed status message when loading */}
            Connecting to AI backend... If this takes too long, the server might be unavailable or have CORS issues.
          </div>
        )}
        <div className="flex items-center gap-3">
          <SpeechInput 
            onTranscription={(text) => setCurrentMessage(text)}
            disabled={isLoading}
          />
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type something..."
            className="flex-grow border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus-visible:ring-blue-500"
            disabled={isLoading}
          />
          
          {/* Send button */}
          <Button 
            onClick={() => handleSendMessage(currentMessage)}
            disabled={!currentMessage.trim() || isLoading}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
