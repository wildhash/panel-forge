"use client";

interface Balloon {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface BalloonEditorProps {
  balloons?: Balloon[];
  onBalloonsChange?: (balloons: Balloon[]) => void;
}

export function BalloonEditor({ balloons = [], onBalloonsChange }: BalloonEditorProps) {

  const addBalloon = () => {
    const newBalloon: Balloon = {
      id: Date.now().toString(),
      text: "New text",
      x: 50,
      y: 50,
    };
    const updatedBalloons = [...balloons, newBalloon];
    onBalloonsChange?.(updatedBalloons);
  };

  const updateBalloonText = (id: string, text: string) => {
    const updatedBalloons = balloons.map((b) =>
      b.id === id ? { ...b, text } : b
    );
    onBalloonsChange?.(updatedBalloons);
  };

  const deleteBalloon = (id: string) => {
    const updatedBalloons = balloons.filter((b) => b.id !== id);
    onBalloonsChange?.(updatedBalloons);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Speech Balloons</h3>
        <button
          onClick={addBalloon}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Balloon
        </button>
      </div>
      <div className="space-y-2">
        {balloons.map((balloon) => (
          <div key={balloon.id} className="flex gap-2 items-center">
            <input
              type="text"
              value={balloon.text}
              onChange={(e) => updateBalloonText(balloon.id, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => deleteBalloon(balloon.id)}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
        {balloons.length === 0 && (
          <p className="text-gray-500 text-sm">No balloons yet. Click &ldquo;Add Balloon&rdquo; to start.</p>
        )}
      </div>
    </div>
  );
}
