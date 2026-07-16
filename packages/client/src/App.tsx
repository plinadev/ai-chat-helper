import { useState } from "react";
import ChatBot from "./components/chat/ChatBot";
import ReviewList from "./components/reviews/ReviewList";
import { Button } from "./components/ui/button";

const DEMO_PRODUCT_ID = 1;

type View = "chatbot" | "reviews";

function App() {
  const [view, setView] = useState<View>("chatbot");

  return (
    <div className="p-4 h-screen w-full flex flex-col">
      <div className="flex gap-2 mb-4">
        <Button
          variant={view === "chatbot" ? "default" : "outline"}
          onClick={() => setView("chatbot")}
        >
          Chatbot
        </Button>
        <Button
          variant={view === "reviews" ? "default" : "outline"}
          onClick={() => setView("reviews")}
        >
          Review Summarizer
        </Button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {view === "chatbot" ? (
          <ChatBot />
        ) : (
          <ReviewList productId={DEMO_PRODUCT_ID} />
        )}
      </div>
    </div>
  );
}

export default App;
