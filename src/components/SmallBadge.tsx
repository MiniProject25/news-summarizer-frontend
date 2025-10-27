export default function SmallBadge({ text }: { text: string }) {
    return (
        <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {text}
        </span>
    );
}