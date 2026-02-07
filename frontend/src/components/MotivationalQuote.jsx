import React, { useEffect, useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';

const motivationalQuotes = [
    "Ready to crush today? Start logging!",
    "Every workout counts. Let's make today amazing!",
    "Your only limit is you. Push harder!",
    "Success starts with a single step. Take it now!",
    "Believe in yourself and all that you are!",
    "The body achieves what the mind believes!",
    "Don't stop when you're tired. Stop when you're done!",
    "Your fitness journey starts here. Let's go!",
    "Make yourself proud today!",
    "Progress, not perfection. Keep moving forward!"
];

const MotivationalQuote = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Get random quote
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setQuote(randomQuote);
    }, []);

    return (
        <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6 text-white" />
                <p className="text-white text-lg font-medium">{quote}</p>
            </div>
        </div>
    );
};

export default MotivationalQuote;
