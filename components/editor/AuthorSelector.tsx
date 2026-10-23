import { FC, useEffect, useState } from "react";
import axios from "axios";

interface AuthorOption {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  avatar?: string;
}

interface Props {
  value: string;
  onChange: (id: string) => void;
}

const AuthorSelector: FC<Props> = ({ value, onChange }) => {
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/authors")
      .then(({ data }) => setAuthors(data.authors || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selected = authors.find((a) => a._id === value);

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#105d97] focus:border-transparent outline-none bg-white"
      >
        <option value="">{loading ? "Đang tải..." : "-- Chọn tác giả --"}</option>
        {authors.map((author) => (
          <option key={author._id} value={author._id}>
            {author.name}{author.role ? ` — ${author.role}` : ""}
          </option>
        ))}
      </select>

      {selected && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
          {selected.avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={selected.avatar}
              alt={selected.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#105d97] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {selected.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{selected.name}</p>
            {selected.role && (
              <p className="text-xs text-gray-500">{selected.role}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorSelector;
