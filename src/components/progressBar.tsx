export default function ProgressBar({
    left = 0,
    center = 0,
    right = 0,
}: {
    left?: number;
    center?: number;
    right?: number;
}) {
    const total = Math.max(left + center + right, 1);
    const leftPct = Math.round((left / total) * 100);
    const centerPct = Math.round((center / total) * 100);
    const rightPct = 100 - leftPct - centerPct;

    return (
        <div className="w-full rounded overflow-hidden bg-gray-700 h-3 mt-2 flex">
            <div style={{ width: `${leftPct}%` }} className="bg-red-500 h-full" />
            <div style={{ width: `${centerPct}%` }} className="bg-green-500 h-full" />
            <div style={{ width: `${rightPct}%` }} className="bg-blue-500 h-full" />
        </div>
    );
}