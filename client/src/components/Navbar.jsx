import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdOutlineSearch, MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Initialize from URL search params
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const debounceRef = useRef(null);

  // Sync input when URL changes externally (e.g. navigating away and back)
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchValue(currentSearch);
  }, [location.pathname, searchParams]);

  const performSearch = useCallback(
    (term) => {
      const currentPath = location.pathname;
      if (term.trim()) {
        navigate(`${currentPath}?search=${encodeURIComponent(term.trim())}`);
      } else {
        navigate(currentPath);
      }
    },
    [navigate, location.pathname]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Debounce search navigation
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Immediate search on Enter
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      performSearch(searchValue);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    navigate(location.pathname);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className='flex justify-between items-center bg-white px-4 py-3 2xl:py-4 sticky z-10 top-0'>
      <div className='flex gap-4'>
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className='text-2xl text-gray-500 block md:hidden'
        >
          ☰
        </button>

        <div className='w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]'>
          <MdOutlineSearch className='text-gray-500 text-xl' />

          <input
            type='text'
            placeholder='ค้นหาที่นี่...'
            value={searchValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800'
          />

          {searchValue && (
            <button
              onClick={handleClear}
              className='text-gray-400 hover:text-gray-600 transition-colors'
              title='ล้างการค้นหา'
            >
              <MdClose className='text-lg' />
            </button>
          )}
        </div>
      </div>

      <div className='flex gap-2 items-center'>
        <NotificationPanel />

        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;

