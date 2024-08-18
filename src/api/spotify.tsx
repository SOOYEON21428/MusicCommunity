import axios from 'axios';

const CLIENT_ID = '92b2c30da2b042019289806adcbb5bfc';
const CLIENT_SECRET = '08d34d62b77542ce84bc724c85dd81de';
const BASE_URL = 'https://api.spotify.com/v1';

// 스포티파이 API 액세스 토큰을 가져오는 함수
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

// 검색 기능을 위한 함수
export const searchTracks = async (query: string) => {
    const token = await getAccessToken();
    const response = await axios.get(`${BASE_URL}/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            q: query,
            type: 'track',
            limit: 10,
        },
    });

    return response.data.tracks.items;
};

// 트렌드 차트를 가져오는 함수
export const getTopTracks = async () => {
    const token = await getAccessToken();
    const response = await axios.get(`${BASE_URL}/browse/new-releases`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            limit: 10,
        },
    });

    return response.data.albums.items;
};
