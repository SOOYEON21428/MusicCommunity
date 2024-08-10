import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './styles/App.css';

const CLIENT_ID = '92b2c30da2b042019289806adcbb5bfc';
const CLIENT_SECRET = '08d34d62b77542ce84bc724c85dd81de';
const BASE_URL = 'https://api.spotify.com/v1';

const App: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    const getAccessToken = async (): Promise<string> => {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
                },
            }
        );
        return response.data.access_token;
    };

    const searchTracks = async (query: string, page: number) => {
        const token = await getAccessToken();
        const response = await axios.get(`${BASE_URL}/search`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                q: query,
                type: 'track',
                limit: 20,
                offset: (page - 1) * 20,
            },
        });

        return response.data.tracks.items;
    };

    const loadMoreResults = useCallback(async () => {
        if (!query) return;

        const newResults = await searchTracks(query, page);
        setResults(prevResults => [...prevResults, ...newResults]);
        setPage(prevPage => prevPage + 1);

        if (newResults.length < 20) {
            setHasMore(false);
        }
    }, [query, page]);

    const lastTrackElementRef = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreResults();
            }
        });
        if (node) observer.current.observe(node);
    }, [loadMoreResults, hasMore]);

    const handleSearch = async () => {
        setPage(1);
        setResults([]);
        setHasMore(true);
        const initialResults = await searchTracks(query, 1);
        setResults(initialResults);
    };

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <h1 className="logo">Musitify</h1>
                    <nav className="nav">
                        <a href="#trend">Trend Chart</a>
                        <a href="#join">Join</a>
                    </nav>
                </div>
            </header>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for songs..."
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="results-grid">
                {results.map((track, index) => {
                    const isLastElement = results.length === index + 1;
                    return (
                        <div
                            className="track"
                            ref={isLastElement ? lastTrackElementRef : null}
                            key={track.id}
                        >
                            <img src={track.album.images[0]?.url} alt={track.name} />
                            <div className="track-info">
                                <h3>{track.name}</h3>
                                <p>{track.artists[0].name}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
