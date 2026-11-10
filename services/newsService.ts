// NewsAPI Service for fetching legal news from Egypt

const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
const NEWS_API_URL = "https://newsapi.org/v2/everything";

export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    source: { name: string };
    publishedAt: string;
}

export async function fetchLegalNewsFromAPI(language: string): Promise<NewsArticle[]> {
    if (!NEWS_API_KEY) {
        console.warn("NEWS_API_KEY is not set");
        return [];
    }

    try {
        const query = language === 'ar' ? 'قانون مصر OR تشريعات مصرية' : 'Egypt law OR Egyptian legislation';
        const response = await fetch(
            `${NEWS_API_URL}?q=${encodeURIComponent(query)}&language=${language === 'ar' ? 'ar' : 'en'}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`NewsAPI error: ${response.status}`);
        }

        const data = await response.json();
        return data.articles || [];
    } catch (err) {
        console.error("NewsAPI fetch error:", err);
        return [];
    }
}
