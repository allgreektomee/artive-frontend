// components/MainNoticeBar.tsx
const MainNoticeBar: React.FC = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/blog/notices/main`)
      .then((res) => res.json())
      .then((data) => setNotices(data));
  }, []);

  if (notices.length === 0) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center">
        <span className="text-yellow-700 font-bold mr-2">📢</span>
        <div className="flex-1">
          {notices.map((notice) => (
            <div key={notice.id} className="mb-2 last:mb-0">
              {notice.post_type === "EXHIBITION" && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  전시
                </span>
              )}
              {notice.post_type === "AWARD" && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2">
                  수상
                </span>
              )}
              <Link
                href={`/blog/${notice.slug}`}
                className="text-gray-800 hover:text-blue-600"
              >
                {notice.title}
              </Link>
              {notice.event_date && (
                <span className="text-gray-500 text-sm ml-2">
                  ({new Date(notice.event_date).toLocaleDateString()})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
