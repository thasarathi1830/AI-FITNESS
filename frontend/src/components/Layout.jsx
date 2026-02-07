import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Main content with left margin for sidebar */}
            <div className="ml-64">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
