"use client";

import { useState } from "react";

interface QuestionAnswer {
    id: number;
    Question: string;
    Answer: string;
}

interface FaqClientProps {
    questionanswers: QuestionAnswer[];
}

export default function FaqClient({ questionanswers }: FaqClientProps) {
    const [openId, setOpenId] = useState<number | null>(null);

    const toggleQuestion = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    const items = Array.isArray(questionanswers) ? questionanswers : [];

    return (
        <main className="bg-[#EEEEEE] min-h-screen py-12 md:py-20 px-6 md:px-12 text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-12 uppercase">
                    Frequently Asked Questions
                </h1>

                <div className="space-y-4">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg overflow-hidden shadow-sm"
                            >
                                <button
                                    onClick={() => toggleQuestion(item.id)}
                                    className="w-full text-left px-6 py-4 md:px-8 md:py-6 flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-bold text-lg md:text-l pr-8">
                                        {item.Question}
                                    </span>
                                    <span className={`transform transition-transform duration-200 ${openId === item.id ? 'rotate-180' : ''}`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </span>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === item.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 text-base md:text-lg text-gray-700 whitespace-pre-wrap leading-relaxed border-t border-gray-100 mt-2">
                                        {item.Answer}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            No questions available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
