import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchableItem, searchableItems } from '@/searchable-items';
import Link from 'next/link';
import IconSearch from '@/components/icon/icon-search';
import { getTranslation } from '@/i18n';
import { isAllowed } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/hooks';

const SearchComponent = () => {
  const router = useRouter();
  const { t } = getTranslation();
  const [search, setSearch] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const authState = useAppSelector(state => state.auth);

  const getSearchableItems = (query: string): SearchableItem[] => {
    if (!query || query.trim() === '') {
      return [];
    }

    return searchableItems
      .filter((item) =>
        t(item.title).toLowerCase().includes(query.trim().toLowerCase()) &&
        (item.permissions && item.permissions.length > 0 ? isAllowed(authState, item.permissions) : true)
      )
      .slice(0, 5);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setSearchResults(getSearchableItems(query));
    setActiveIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      setActiveIndex((prevIndex) => (prevIndex + 1) % searchResults.length);
    } else if (event.key === 'ArrowUp') {
      setActiveIndex((prevIndex) => (prevIndex - 1 + searchResults.length) % searchResults.length);
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      router.push(searchResults[activeIndex].url);
      setSearchQuery('');
      setSearchResults([]);
      setActiveIndex(-1);
    }
  };

  const highlightText = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? <span key={index} className="bg-yellow-200">{part}</span> : part
    );
  };

  return (
    <form
      className={`${search && '!block'} absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
      onSubmit={(e) => {
        e.preventDefault();
        setSearch(false);
        if (searchResults.length > 0) {
          router.push(searchResults[0].url);
          setSearchQuery('');
          setSearchResults([]);
        }
      }}
    >
      <div className="relative w-full sm:w-auto">
        <input
          type="text"
          className="peer form-input bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pl-9 rtl:pr-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4 w-full"
          placeholder={t('search...')}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        {searchResults.length > 0 && (
          <ul className="absolute bg-white text-black shadow dark:bg-[#1b2e4b] dark:text-white-dark w-full">
            {searchResults.map((item: SearchableItem, index) => (
              <li key={item.url} className={index === activeIndex ? 'bg-primary/10 text-primary hover:bg-primary/5' : 'hover:text-primary hover:bg-primary/5'}>
                <Link
                  href={item.url}
                  className="block px-4 py-2"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setActiveIndex(-1);
                  }}
                >
                  {highlightText(t(item.title), searchQuery)}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto">
          <IconSearch className="mx-auto" />
        </button>
      </div>
    </form>
  );
};

export default SearchComponent;
