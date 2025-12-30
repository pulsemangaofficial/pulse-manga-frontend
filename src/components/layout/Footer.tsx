import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export const Footer = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Mock latest discussions - in production, fetch from a discussions API
    const latestDiscussions = [
        { user: 'DemonKing', manga: 'Solo Leveling', comment: '"The art in this chapter is insane!"', time: '2m ago' },
        { user: 'Reader99', manga: 'One Piece', comment: '"Luffy is actually..."', time: '5m ago' },
        { user: 'SimpleMdeline', manga: 'Chainsaw Man', comment: '"Worst arc?"', time: '12m ago' },
        { user: 'AngelPatricia', manga: 'Spy x Family', comment: '"Anya Waku Waku"', time: '1h ago' },
    ];

    return (
        <footer className="bg-[#0b0c15] border-t border-white/5 mt-20">
            <div className="container mx-auto px-4 py-10">
                {/* Latest Discussions */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Latest Discussions</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {latestDiscussions.map((disc, idx) => (
                            <Link
                                key={idx}
                                to="/discussions"
                                className="bg-surface/30 hover:bg-surface/50 border border-white/5 hover:border-primary/30 rounded-lg p-4 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-semibold text-primary">{disc.user}</span>
                                    <span className="text-xs text-gray-600">{disc.time}</span>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">{disc.manga}</h4>
                                <p className="text-xs text-gray-400 line-clamp-1">{disc.comment}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* A-Z List */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-primary mb-3 uppercase tracking-wider">A-Z List</h3>
                    <p className="text-sm text-gray-400 mb-4">Searching Manga order by alphabet name A to Z.</p>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            to="/list?sort=all"
                            className="px-3 py-2 bg-surface/50 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded text-sm font-medium text-gray-300 hover:text-primary transition-all"
                        >
                            All
                        </Link>
                        <Link
                            to="/list?sort=0-9"
                            className="px-3 py-2 bg-surface/50 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded text-sm font-medium text-gray-300 hover:text-primary transition-all"
                        >
                            0-9
                        </Link>
                        {alphabet.map(letter => (
                            <Link
                                key={letter}
                                to={`/list?sort=${letter.toLowerCase()}`}
                                className="px-3 py-2 bg-surface/50 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded text-sm font-medium text-gray-300 hover:text-primary transition-all"
                            >
                                {letter}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Footer Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/5">
                    {/* Help Section */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Help</h4>
                        <div className="space-y-2">
                            <Link to="/contact" className="block text-sm text-gray-400 hover:text-primary transition-colors">
                                Contact
                            </Link>
                            <Link to="/privacy-policy" className="block text-sm text-gray-400 hover:text-primary transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/tos" className="block text-sm text-gray-400 hover:text-primary transition-colors">
                                TOS
                            </Link>
                            <Link to="/dmca" className="block text-sm text-gray-400 hover:text-primary transition-colors">
                                DMCA
                            </Link>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Links</h4>
                        <div className="space-y-2">
                            <Link to="/" className="block text-sm text-gray-400 hover:text-primary transition-colors">
                                Newest
                            </Link>
                            <Link to="/latest" className="block text-sm text-gray-400 hover:text-primary transition-colors">
                                Recently Updated
                            </Link>
                            <Link to="/popular" className="block text-sm text-gray-400 hover:text-primary transition-colors">
                                Popular
                            </Link>
                            <Link to="/list" className="block text-sm text-gray-400 hover:text-primary transition-colors">
                                A-Z List
                            </Link>
                        </div>
                    </div>

                    {/* Partners Section */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Partners</h4>
                        <div className="space-y-2">
                            <a
                                href="https://example.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-gray-400 hover:text-primary transition-colors"
                            >
                                Read novel online
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-xs text-gray-600">
                    <p className="mb-2">
                        All Manga, Character Designs and Logos are © to their respective copyright holders.
                    </p>
                    <p className="text-gray-700">
                        © 2025 <span className="text-primary font-bold">PULSEMANGA</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
