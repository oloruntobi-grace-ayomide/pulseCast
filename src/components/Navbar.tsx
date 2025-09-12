"use client"
import Link from "next/link"
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TiTimes } from "react-icons/ti";
import { TbSearch } from "react-icons/tb";

const Navbar = () => {
    const [isTogglerOpen, setisTogglerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    interface LinkObject {
        path: string,
        linkText: string,
        dropdownLinks?: LinkObject[];
    }

    const Links: LinkObject[] = [
        { path: '/', linkText: 'Home' },
        { path: '/news', linkText: 'News' },
        { path: "/weather", linkText: 'Weather' },
        // { path: '/help-center', linkText: 'Help Center', dropdownLinks: [{ path: '/help-center/faqs', linkText: 'Frequently Asked Questions' }, { path: '/help-center/contact-us', linkText: 'Contact Us' }] },
    ]

    const commonSearches = [
        "weather in Lagos",
        "latest news today",
        "stock market news",
        "sports headlines",
        "technology updates",
        "political news",
        "entertainment news",
        "health articles",
        "business news",
        "science discoveries"
    ];

    // trigger suggestions
    useEffect(() => {
        if (searchQuery.length >= 1) {
            setIsLoading(true);
            const filtered = commonSearches.filter(item =>
                item.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
            setShowSuggestions(true);
            setIsLoading(false);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    }, [searchQuery]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // handle search submit to go to search page
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
            setSearchQuery(searchQuery);                                                        
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        console.log(suggestion)
        router.push(`/search?q=${encodeURIComponent(suggestion)}`);
        setShowSuggestions(false);
        setSearchQuery(suggestion);
    };

    const handleInputFocus = () => {
        if (searchQuery.length > 1) {
            setShowSuggestions(true);
        }
    };

    return (
        <>
            <nav className="items-center justify-between hidden parent md:flex">
                <div className="logo-and-togger-box flex items-center md:gap-[25px] lg:gap-[30px] lg:w-[70%] md:w-[70%]">
                    <Link href='/' className="inline-block relative md:w-[100px] md:h-[80px] lg:w-[120px] lg:h-[100px]">
                        <Image src="/images/logo_blue.png" alt="Pulsecast Logo" fill sizes="100vw" className="object-contain" />
                    </Link>
                    
                    {/* Search Box with Suggestions and no suggestion alert*/}
                    <div ref={searchRef} className="relative w-[70%]">
                        <form onSubmit={handleSearch} className="rounded-[30px] h-[42px] pl-[15px] bg-anti-flash-white w-full flex items-center">
                            <input 
                                type="search" 
                                placeholder="Search for news or articles" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={handleInputFocus}
                                className="bg-transparent outline-none flex-1 caret-primary-color placeholder:text-[#768196] text-[14px]"
                            />
                            <button 
                                type="submit"
                                className="bg-primary-color flex items-center justify-center h-full rounded-[20px] w-[72px] text-white font-semibold hover:bg-hover-primary-color"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loader submiting-search border-2 w-[20px] h-[20px]"></span>
                                ) : (
                                    <TbSearch className="text-[20px]" />
                                )}
                            </button>
                        </form>

                        {showSuggestions && suggestions.length > 1 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] max-h-60 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors w-full text-left"
                                        type="button"
                                        onClick={() => {handleSuggestionClick(suggestion);}}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleSuggestionClick(suggestion);
                                            }
                                        }}
                                        role="option"
                                    >
                                        <div className="flex items-center gap-2">
                                            <TbSearch className="text-gray-400 text-sm" />
                                            <span className="text-gray-700">{suggestion}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {showSuggestions && searchQuery.length > 1 && suggestions.length === 0 && !isLoading && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                                <p className="text-gray-500 text-center">No suggestions found</p>
                            </div>
                        )}
                    </div>
                </div>

                <ul className="flex items-center justify-between lg:w-[25%] md:w-[28%] md:px-[10px] lg:px-[20px]">
                    {Links && Links.map((link, index) => {
                        const isActive = pathname === link.path || link.dropdownLinks?.some(item => pathname.startsWith(item.path));
                        return (
                            <li
                                key={index}
                                className={`nav-links-list ${link.dropdownLinks ? "relative group" : "static"}`}
                            >
                                <Link
                                    href={link.path}
                                    className={`nav-links font-medium text-[#5B636A] hover:text-primary-color ${isActive ? "border-b-2 border-primary-color" : "text-[#5B636A]"}`}
                                >
                                    {link.linkText}
                                </Link>
                                {link.dropdownLinks && (
                                    <ul className="nav-links-dropdown absolute left-1/2 -translate-x-1/2 mt-[10px] min-w-fit py-2.5 px-2.5 rounded-[12px] bg-white shadow-[0px_0px_4px_0px_#00000040] text-nowrap whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-100">
                                        {link.dropdownLinks.map((item, i) => (
                                            <li key={i} className="[&:not(:last-child)]:mb-2 text-[#5B636A] hover:text-primary-color">
                                                <Link href={item.path} className={`dropdown-link ${isActive ? "active" : "not-active"}`}>
                                                    {item.linkText}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <nav className="md:hidden parent">
                <div className="flex items-center justify-between py-[15px]">
                    <Link href='/' className="inline-block relative w-[100px] h-[40px] z-[1000000]">
                        <Image src="/images/logo_blue.png" alt="Pulsecast Logo" fill sizes="100vw" className="object-contain" />
                    </Link>
                    
                    <button className="text-[25px] text-[#333333]" onClick={() => (setisTogglerOpen(prev => !prev))}>
                        {isTogglerOpen ? <TiTimes className="toggler-icon text-[#888888]"/> : <RxHamburgerMenu className="toggler-icon text-[#888888]"/>}
                    </button>
                </div>

                {/* Search Box with Suggestions and no suggestion alert*/}
                <div ref={searchRef} className="relative w-[90%] mx-auto mt-[10px]">
                    <form onSubmit={handleSearch} className="rounded-[30px] sm:h-[45px] xsm:h-[40px] xxsm:h-[35px] sm:pl-[15px] xsm-[10px] pl-[5px] bg-anti-flash-white w-full flex items-center">
                        <button 
                            type="submit"
                            className="flex items-center justify-center h-full text-[#333333] px-[5px] font-bold hover:text-hover-primary-color"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loader submiting-search border-1 w-[18px] h-[18px]"></span>
                            ) : (
                                <TbSearch className="text-[18px]" />
                            )}
                        </button>
                        <input 
                            type="search" 
                            placeholder="Search for news or articles" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={handleInputFocus}
                            className="bg-transparent outline-none flex-1 caret-primary-color placeholder:text-[#768196] text-[13px] px-0"
                        />
                    </form>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                                  <button
                                    key={index}
                                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors block w-full"
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleSuggestionClick(suggestion);
                                        }
                                    }}
                                    role="option"
                                >
                                    <div className="flex items-center gap-2">
                                        <TbSearch className="text-gray-400 text-sm" />
                                        <span className="text-gray-700">{suggestion}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {showSuggestions && searchQuery.length > 1 && suggestions.length === 0 && !isLoading && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                            <p className="text-gray-500 text-center">No suggestions found</p>
                        </div>
                    )}
                </div>

                <ul className={`nav-links-container xxsm:w-[80%] xsm:w-[60%] sm:w-[50%] z-[100000] px-[20px] ${isTogglerOpen ? 'open' : 'close'}`}>
                    {Links && Links.map((link, index) => {
                        const isActive = pathname === link.path || link.dropdownLinks?.some(item => pathname.startsWith(item.path));
                        return (
                            <li
                                key={index}
                                className={`mb-[15px] nav-links-list ${link.dropdownLinks ? "relative group" : "static"}`}
                            >
                                <Link
                                    href={link.path}
                                    className={`nav-links font-medium text-[#5B636A] hover:text-primary-color ${isActive ? "border-b-2 border-primary-color" : "text-[#5B636A]"}`}
                                >
                                    {link.linkText}
                                </Link>
                                {link.dropdownLinks && (
                                    <ul className="nav-links-dropdown absolute left-1/2 -translate-x-1/2 mt-[10px] min-w-fit py-2.5 px-2.5 rounded-[12px] bg-white shadow-[0px_0px_4px_0px_#00000040] text-nowrap whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-100">
                                        {link.dropdownLinks.map((item, i) => (
                                            <li key={i} className="[&:not(:last-child)]:mb-2 text-[#5B636A] hover:text-primary-color">
                                                <Link href={item.path} className={`dropdown-link ${isActive ? "active" : "not-active"}`}>
                                                    {item.linkText}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    )
}

export default Navbar;
