"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from '../../public/logo.png'
import Cookies from "js-cookie";

interface Message {
  id: string;
  content: string;
  sender: "user" | "server";
  timestamp: number;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  interface User {
    id: number;
    username: string;
    email: string;

  }
  const [user, setUser] = useState<User | null>(null);
  
  const router = useRouter();
 
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const connectWebSocket = () => {
      try {
        const websocket = new WebSocket('http://localhost:1337');
        
        websocket.onopen = () => {
          setIsConnected(true);
          console.log("Connected to WebSocket");
        };

        websocket.onmessage = (event) => {
          const newMessage: Message = {
            id: Date.now().toString(),
            content: event.data,
            sender: "server",
            timestamp: Date.now(),
          };
          
          setMessages((prev) => {
            const updated = [...prev, newMessage];
            localStorage.setItem("chatMessages", JSON.stringify(updated));
            return updated;
          });
        };

        websocket.onclose = () => {
          setIsConnected(false);
          console.log("Disconnected from WebSocket");
          setTimeout(connectWebSocket, 3000);
        };

        websocket.onerror = (error) => {
          console.error("WebSocket error:", error);
          websocket.close();
        };

        setWs(websocket);
        return websocket;
      } catch (error) {
        console.error("WebSocket connection error:", error);
        setTimeout(connectWebSocket, 3000);
        return null;
      }
    };

    const websocket = connectWebSocket();
    
    const fetchProfile = async () => {
      const token = Cookies.get("jwt"); 
      if (!token){
        router.push("/login");
      };

      try {
        const response = await fetch("http://localhost:1337/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const userData: User = await response.json(); // Parse response JSON
        setUser(userData);
      } catch (error) {
        console.error(error);
        Cookies.remove("jwt"); // Clear the token if fetching fails
        setUser(null);
      }
    };

    fetchProfile();
    
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim() || !ws) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: Date.now(),
    };

    try {
      ws.send(JSON.stringify(newMessage));
      setMessages((prev) => {
        const updated = [...prev, newMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updated));
        return updated;
      });
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const clearChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
  };

  const handleLogout = () => {
    Cookies.remove('jwt'); 
    router.push("/");   
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      
        <nav className="flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="EchoSphere Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-semibold">EchoSphere</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
          <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
            Privacy
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/signup"
              className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors"
            >
              SignUp
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      <Card className="max-w-2xl mx-auto h-[80vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Chat with Server</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? "Connected" : "Reconnecting..."}
            </span>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start text-"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!isConnected}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-destructive"
            >
              Clear Chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}