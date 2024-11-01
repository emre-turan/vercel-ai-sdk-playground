"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, RefreshCcw, Send } from "lucide-react";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    reload,
  } = useChat({
    maxSteps: 5,
    keepLastMessageOnError: true,
  });

  return (
    <div className="p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
        <CardHeader className="flex-none border-b shadow-sm bg-muted">
          <CardTitle>Chat with AI- Vercel AI SDK Playground</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 p-4 h-full overflow-hidden">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="size-4" />
              <AlertDescription className="flex items-center gap-4">
                An error occurred.
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => reload()}
                  className="ml-auto"
                >
                  <RefreshCcw className="size-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <ScrollArea className="flex-1 w-full h-[calc(100%-80px)]">
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-2 p-4 rounded-lg",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground max-w-[80%]"
                      : "mr-auto bg-muted max-w-[80%]"
                  )}
                >
                  <div className="text-sm font-medium">
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  {message.toolInvocations ? (
                    <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
                      {JSON.stringify(message.toolInvocations, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 pt-4 border-t mt-auto"
          >
            <Input
              value={input}
              placeholder="Type your message..."
              onChange={handleInputChange}
              className="flex-1"
              disabled={error != null || isLoading}
            />
            <Button
              type={isLoading ? "button" : "submit"}
              size="icon"
              onClick={isLoading ? () => stop() : undefined}
              disabled={(!input.trim() && !isLoading) || error != null}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span className="sr-only">Stop generating</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span className="sr-only">Send message</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
