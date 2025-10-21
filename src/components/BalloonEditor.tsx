"use client";

interface Balloon {
  id: string;
  text: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  tail?: { x: number; y: number };
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
      w: 120,
      h: 60,
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

  const updateBalloonPosition = (id: string, field: 'x' | 'y', value: number) => {
    const updatedBalloons = balloons.map((b) =>
      b.id === id ? { ...b, [field]: value } : b
    );
    onBalloonsChange?.(updatedBalloons);
  };

  const deleteBalloon = (id: string) => {
    const updatedBalloons = balloons.filter((b) => b.id !== id);
    onBalloonsChange?.(updatedBalloons);
  };

  return (
    <div className="border-t-2 border-gray-200 pt-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Speech Balloons</h3>
        <button
          onClick={addBalloon}
          aria-label="Add speech balloon to panel"
          className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800"
        >
          Add Balloon
        </button>
      </div>
      <div className="space-y-4">
        {balloons.map((balloon) => (
          <div key={balloon.id} className="border-2 border-gray-200 p-4">
            <div className="flex gap-2 items-start mb-3">
              <input
                type="text"
                value={balloon.text}
                onChange={(e) => updateBalloonText(balloon.id, e.target.value)}
                placeholder="Balloon text"
                className="flex-1 px-3 py-2 border-2 border-gray-200 focus:border-gray-900 focus:outline-none"
              />
              <button
                onClick={() => deleteBalloon(balloon.id)}
                aria-label="Delete balloon"
                className="px-3 py-2 text-sm border-2 border-gray-900 text-gray-900 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-700 font-medium block mb-1">X Position (%)</label>
                <input
                  type="number"
                  value={balloon.x}
                  onChange={(e) => updateBalloonPosition(balloon.id, 'x', Number(e.target.value))}
                  className="w-full px-2 py-1 border-2 border-gray-200 focus:border-gray-900 focus:outline-none"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium block mb-1">Y Position (%)</label>
                <input
                  type="number"
                  value={balloon.y}
                  onChange={(e) => updateBalloonPosition(balloon.id, 'y', Number(e.target.value))}
                  className="w-full px-2 py-1 border-2 border-gray-200 focus:border-gray-900 focus:outline-none"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        ))}
        {balloons.length === 0 && (
          <p className="text-gray-600 text-sm">No balloons. Click Add Balloon to start.</p>
        )}
      </div>
    </div>
  );
}
