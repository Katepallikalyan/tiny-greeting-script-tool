
import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPORT_PHONE = "+1-800-555-1234";

export default function CustomerSupportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Welcome to Customer Care 👋 How may we help you today?" },
  ]);
  const [input, setInput] = useState("");
  const endOfMessages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { role: "user", text: input },
      {
        role: "bot",
        text:
          "Thank you for your message. Our team will reply soon. For urgent queries, you may call our helpline.",
      },
    ]);
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customer Care Support</DialogTitle>
          <DialogDescription>
            {showChat ? "Chat live with our support or switch to call." : "Contact us by phone."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={showChat ? "default" : "secondary"}
            className="gap-2 rounded"
            onClick={() => setShowChat(true)}
          >
            <MessageSquare className="w-4 h-4" /> Chat
          </Button>
          <Button
            size="sm"
            variant={!showChat ? "default" : "secondary"}
            className="gap-2 rounded"
            onClick={() => setShowChat(false)}
          >
            <Phone className="w-4 h-4" /> Call Us
          </Button>
        </div>

        {showChat ? (
          <div className="flex flex-col h-64 border rounded p-2 overflow-y-auto bg-muted/20 mb-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`mb-1 text-sm ${
                  m.role === "user"
                    ? "text-right text-green-800"
                    : "text-left text-gray-700"
                }`}
              >
                <span
                  className={`inline-block px-2 py-1 rounded ${
                    m.role === "user" ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            <div ref={endOfMessages}></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 gap-2 text-gray-800">
            <Phone className="w-10 h-10 text-green-700" />
            <div className="font-semibold">Call us at:</div>
            <div className="text-lg font-mono">{SUPPORT_PHONE}</div>
            <span className="text-xs text-gray-500">
              Available 9am to 6pm, Monday to Saturday.
            </span>
          </div>
        )}

        {showChat && (
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border px-2 py-1 text-sm"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={e => (e.key === "Enter" ? handleSend() : undefined)}
            />
            <Button type="button" onClick={handleSend} size="sm" disabled={!input.trim()}>
              Send
            </Button>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
