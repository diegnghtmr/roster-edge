import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About RosterEdge</h1>
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-4">
          RosterEdge is a comprehensive sports team management application designed to streamline
          the organization and coordination of sports teams at all levels.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          To provide coaches, managers, and players with the tools they need to focus on what
          matters most - playing and enjoying the game.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Features</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Team roster management</li>
          <li>Game scheduling and calendar</li>
          <li>Player statistics tracking</li>
          <li>Communication tools</li>
          <li>Performance analytics</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
