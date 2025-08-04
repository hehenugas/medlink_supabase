import { useState } from "react";

export default function ChatBox() {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        const newMessage = [...messages, { role: "user", content: input }];
        setMessages(newMessage);
        setInput("");

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: newMessage }),
        })

        const data = await response.json();

        if(data.reply) {
            setMessages([...newMessage, { role: "assistant", content: data.reply }])
        }
    }

    return (
        <div className="max-"></div>
    )
}