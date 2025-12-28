export function MangaComments() {
    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4">COMMENTS</h3>
            <div className="bg-surface border border-border rounded-lg p-8 text-center">
                <p className="text-text-muted mb-4">You must be logged in to post a comment.</p>
                <button className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-primary/90 transition-colors">
                    Login to Comment
                </button>
            </div>

            {/* Mock Existing Comments */}
            <div className="mt-6 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 p-4 border-b border-border/50">
                        <div className="w-10 h-10 rounded-full bg-border flex-shrink-0" />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-white text-sm">User_{i}</span>
                                <span className="text-xs text-text-muted">2 days ago</span>
                            </div>
                            <p className="text-sm text-text-main">
                                What are your thoughts? Don&apos;t be shy! amazing! Can&apos;t wait for the next update.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
